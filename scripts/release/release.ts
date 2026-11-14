// Publishes the versions committed in the package.json files: builds, tags, pushes and
// publishes whatever is missing on origin or npm. It never writes versions or changelogs,
// so after a failure the fix is to run it again. Versions and changelogs are prepared
// by the release skill in .claude/skills/release.
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import {
  PackagePlan,
  PackageState,
  planPackage,
  sortTopologically,
} from './plan'

const root = path.resolve(__dirname, '../..')
const packageRoots = ['packages/libraries', 'packages/languages']
const remote = 'origin'
// set explicitly: yarn 1 exports npm_config_registry=https://registry.yarnpkg.com to
// scripts, which npm would otherwise pick up and publish to
const registry = 'https://registry.npmjs.org/'

interface WorkspacePackage {
  name: string
  version: string
  dir: string
  internalDependencies: string[]
}

class ReleaseError extends Error {}

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()

const run = (command: string, args: string[], cwd = root) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  return result.status === 0
}

const ask = async (question: string) => {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = await readline.question(`${question} (y/N) `)
  readline.close()
  return answer.trim().toLowerCase() === 'y'
}

const readPackages = (): WorkspacePackage[] => {
  const manifests = packageRoots.flatMap((packageRoot) =>
    readdirSync(path.join(root, packageRoot))
      .map((name) => path.join(packageRoot, name))
      .filter((dir) => existsSync(path.join(root, dir, 'package.json')))
      .map((dir) => ({
        dir,
        json: JSON.parse(
          readFileSync(path.join(root, dir, 'package.json'), 'utf8'),
        ),
      }))
      .filter(({ json }) => json.private !== true),
  )
  const names = new Set(manifests.map(({ json }) => json.name as string))
  return manifests.map(({ dir, json }) => ({
    name: json.name,
    version: json.version,
    dir,
    internalDependencies: Object.keys({
      ...json.dependencies,
      ...json.peerDependencies,
      ...json.optionalDependencies,
    }).filter((dependency) => names.has(dependency)),
  }))
}

const ensureCleanCheckout = () => {
  const branch = spawnSync('git', ['symbolic-ref', '--short', '-q', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).stdout.trim()
  if (!branch) {
    throw new ReleaseError('HEAD is detached. Check out a branch first.')
  }
  const changes = git('status', '--porcelain', '--untracked-files=no')
  if (changes) {
    throw new ReleaseError(
      `Tracked files have uncommitted changes. Commit or stash them first:\n${changes}`,
    )
  }
  return branch
}

// tag name -> commit, preferring the peeled commit of annotated tags
const parseTagRefs = (lines: string[]) => {
  const tags = new Map<string, string>()
  lines.forEach((line) => {
    const [commit, ref] = line.split(/\s+/)
    if (!ref?.startsWith('refs/tags/')) {
      return
    }
    const peeled = ref.endsWith('^{}')
    const name = ref.slice('refs/tags/'.length, peeled ? -3 : undefined)
    if (peeled || !tags.has(name)) {
      tags.set(name, commit)
    }
  })
  return tags
}

const readRemoteTags = () => {
  const output = spawnSync('git', ['ls-remote', '--tags', remote], {
    cwd: root,
    encoding: 'utf8',
  })
  if (output.status !== 0) {
    throw new ReleaseError(
      `Couldn't list the tags on ${remote}:\n${output.stderr}`,
    )
  }
  return parseTagRefs(output.stdout.split('\n'))
}

const readLocalTags = () =>
  parseTagRefs(
    git(
      'for-each-ref',
      '--format=%(objectname) %(refname)%0a%(*objectname) %(refname)^{}',
      'refs/tags',
    )
      .split('\n')
      // lightweight tags have no peeled line
      .filter((line) => !line.startsWith(' ')),
  )

const fetchNpmInfo = async (registry: string, name: string) => {
  const response = await fetch(
    `${registry}${name.replace('/', '%2f')}`,
    // the abbreviated packument is enough for versions and dist-tags
    { headers: { Accept: 'application/vnd.npm.install-v1+json' } },
  )
  if (response.status === 404) {
    return { versions: new Set<string>(), latest: undefined }
  }
  if (!response.ok) {
    throw new ReleaseError(
      `Couldn't read ${name} from ${registry}: ${response.status} ${response.statusText}`,
    )
  }
  const packument = (await response.json()) as {
    'versions': Record<string, unknown>
    'dist-tags': Record<string, string>
  }
  return {
    versions: new Set(Object.keys(packument.versions)),
    latest: packument['dist-tags'].latest as string | undefined,
  }
}

const readStates = async (packages: WorkspacePackage[]) => {
  const remoteTags = readRemoteTags()
  const localTags = readLocalTags()
  const npmInfos = await Promise.all(
    packages.map((pkg) => fetchNpmInfo(registry, pkg.name)),
  )
  return packages.map((pkg, index): PackageState => {
    const tagName = `${pkg.name}@${pkg.version}`
    return {
      ...pkg,
      onNpm: npmInfos[index].versions.has(pkg.version),
      npmLatest: npmInfos[index].latest,
      remoteTagCommit: remoteTags.get(tagName),
      localTagCommit: localTags.get(tagName),
    }
  })
}

// npm publishes everything under `src`, tracked or not
const ensureNoUntrackedSources = (plans: PackagePlan[]) => {
  const sourceDirs = plans
    .filter((plan) => plan.publish)
    .map((plan) => `${plan.dir}/src`)
  if (sourceDirs.length === 0) {
    return
  }
  const untracked = git(
    'ls-files',
    '--others',
    '--exclude-standard',
    '--',
    ...sourceDirs,
  )
  if (untracked) {
    throw new ReleaseError(
      `Untracked files in published sources would end up on npm. Remove or commit them first:\n${untracked}`,
    )
  }
}

const resolveQuestions = async (plans: PackagePlan[]) => {
  const accepted: PackagePlan[] = []
  for (const plan of plans) {
    let keep = true
    for (const question of plan.questions) {
      if (keep && !(await ask(question.message))) {
        console.info(`Leaving out ${plan.tagName}.`)
        keep = false
      }
    }
    if (keep) {
      accepted.push(plan)
    }
  }
  return accepted
}

const describeActions = (plan: PackagePlan) =>
  [
    plan.createTag && 'create tag',
    plan.pushTag && 'push tag',
    plan.publish && `publish (${plan.distTag})`,
  ]
    .filter(Boolean)
    .join(', ')

const printPlan = (plans: PackagePlan[]) => {
  console.info('\nPlan:')
  // eslint-disable-next-line no-console
  console.table(
    plans.map((plan) => ({
      'package': plan.name,
      'version': plan.version,
      'dist-tag': plan.publish ? plan.distTag : '',
      'actions': describeActions(plan),
    })),
  )
}

const tagAndPush = (plans: PackagePlan[], branch: string) => {
  plans
    .filter((plan) => plan.createTag)
    .forEach((plan) => {
      git('tag', '-a', plan.tagName, '-m', plan.tagName)
      console.info(`Tagged ${plan.tagName}`)
    })
  const tagRefs = plans
    .filter((plan) => plan.pushTag)
    .map((plan) => `refs/tags/${plan.tagName}`)
  if (tagRefs.length === 0) {
    return
  }
  console.info(`\nPushing ${branch} and ${tagRefs.length} tag(s) to ${remote}`)
  // atomic: if the branch is rejected, no tag is pushed either
  if (
    !run('git', [
      'push',
      '--atomic',
      remote,
      `HEAD:refs/heads/${branch}`,
      ...tagRefs,
    ])
  ) {
    throw new ReleaseError(
      `Pushing to ${remote} failed, nothing was published. Fix the push and run "yarn release" again.`,
    )
  }
}

const publish = (plans: PackagePlan[]) => {
  const published: string[] = []
  for (const plan of plans) {
    console.info(`\nPublishing ${plan.tagName} as "${plan.distTag}"`)
    // inherited stdio so npm can prompt for a one-time password or a browser login
    if (
      !run(
        'npm',
        ['publish', '--tag', plan.distTag, '--registry', registry],
        path.join(root, plan.dir),
      )
    ) {
      return { published, failed: plan, left: plans.slice(published.length) }
    }
    published.push(plan.tagName)
  }
  return { published, failed: undefined, left: [] }
}

const preparePlans = async () => {
  const packages = sortTopologically(readPackages())
  const head = git('rev-parse', 'HEAD')
  const states = await readStates(packages)
  const candidates = states
    .map((state) => planPackage(state, head))
    .filter((plan): plan is PackagePlan => plan !== undefined)

  if (candidates.length === 0) {
    console.info(
      'Every package version is tagged on origin and on npm. Nothing to do.',
    )
    return []
  }
  ensureNoUntrackedSources(candidates)
  const plans = await resolveQuestions(candidates)
  if (plans.length === 0) {
    console.info('Nothing left to do.')
  }
  return plans
}

const report = (
  plans: PackagePlan[],
  { published, failed, left }: ReturnType<typeof publish>,
) => {
  console.info('\nDone:')
  plans
    .filter((plan) => plan.pushTag)
    .forEach((plan) => {
      console.info(`  pushed tag ${plan.tagName}`)
    })
  published.forEach((tagName) => {
    console.info(`  published ${tagName}`)
  })
  if (failed) {
    console.error(`\nPublishing ${failed.tagName} failed. Not published yet:`)
    left.forEach((plan) => {
      console.error(`  ${plan.tagName}`)
    })
    console.error('Run "yarn release" again to continue.')
    process.exitCode = 1
  }
}

const main = async () => {
  const branch = ensureCleanCheckout()
  console.info(
    `Releasing from ${branch} at ${git('log', '-1', '--format=%h %s')}`,
  )
  const plans = await preparePlans()
  if (plans.length === 0) {
    return
  }
  printPlan(plans)
  if (!(await ask('Go ahead?'))) {
    console.info('Stopped, nothing was changed.')
    return
  }

  const toPublish = plans.filter((plan) => plan.publish)
  if (toPublish.length > 0 && !run('yarn', ['build'])) {
    throw new ReleaseError('The build failed, nothing was tagged or published.')
  }
  tagAndPush(plans, branch)
  report(plans, publish(toPublish))
}

main().catch((error: unknown) => {
  console.error(error instanceof ReleaseError ? error.message : error)
  process.exitCode = 1
})
