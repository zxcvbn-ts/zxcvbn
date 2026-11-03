export interface PackageState {
  name: string
  version: string
  dir: string
  // names of other publishable packages this one depends on
  internalDependencies: string[]
  onNpm: boolean
  npmLatest?: string
  // commit the tag points at, peeled for annotated tags
  remoteTagCommit?: string
  localTagCommit?: string
}

export type QuestionKind =
  | 'tag-not-at-head'
  | 'on-npm-without-tag'
  | 'latest-backwards'

export interface Question {
  kind: QuestionKind
  message: string
}

export interface PackagePlan {
  name: string
  version: string
  dir: string
  tagName: string
  distTag: string
  createTag: boolean
  pushTag: boolean
  publish: boolean
  // answering "no" to any of these drops the package from the run
  questions: Question[]
}

const stableVersionRegex = /^(\d+)\.(\d+)\.(\d+)$/
const versionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/

export const tagNameFor = (name: string, version: string) =>
  `${name}@${version}`

export const distTagFor = (version: string) => {
  const match = versionRegex.exec(version)
  if (!match) {
    throw new Error(`"${version}" is not a valid version`)
  }
  const prerelease = match[4]
  if (prerelease === undefined) {
    return 'latest'
  }
  const preid = prerelease.split('.')[0]
  if (!/^[A-Za-z][0-9A-Za-z-]*$/.test(preid)) {
    throw new Error(
      `can't derive a dist-tag from "${version}", the prerelease needs a name like "beta"`,
    )
  }
  return preid
}

// Only stable versions are compared: it guards `latest`, which never points at a prerelease.
export const compareStableVersions = (a: string, b: string) => {
  const matchA = stableVersionRegex.exec(a)
  const matchB = stableVersionRegex.exec(b)
  if (!matchA || !matchB) {
    throw new Error(`can't compare "${a}" and "${b}", both must be stable`)
  }
  for (let i = 1; i <= 3; i += 1) {
    const diff = Number(matchA[i]) - Number(matchB[i])
    if (diff !== 0) {
      return diff
    }
  }
  return 0
}

const questionFor: Record<
  QuestionKind,
  (
    state: PackageState,
    tagName: string,
    context: { distTag: string; head: string },
  ) => string | undefined
> = {
  'on-npm-without-tag': (state, tagName) => {
    const tagCommit = state.remoteTagCommit ?? state.localTagCommit
    if (!state.onNpm || tagCommit !== undefined) {
      return undefined
    }
    return `${tagName} is on npm but has no git tag. Tag HEAD for it?`
  },
  'tag-not-at-head': (state, tagName, { head }) => {
    const tagCommit = state.remoteTagCommit ?? state.localTagCommit
    if (state.onNpm || tagCommit === undefined || tagCommit === head) {
      return undefined
    }
    return `${tagName} is tagged at ${tagCommit.slice(0, 7)}, not at HEAD, and isn't on npm yet. Publish it from HEAD anyway?`
  },
  'latest-backwards': (state, tagName, { distTag }) => {
    if (
      state.onNpm ||
      distTag !== 'latest' ||
      state.npmLatest === undefined ||
      compareStableVersions(state.version, state.npmLatest) >= 0
    ) {
      return undefined
    }
    return `${tagName} is lower than ${state.npmLatest}, the current "latest" on npm. Publish it as "latest" anyway, moving "latest" backwards?`
  },
}

const collectQuestions = (
  state: PackageState,
  context: { distTag: string; head: string },
) => {
  const tagName = tagNameFor(state.name, state.version)
  return (Object.keys(questionFor) as QuestionKind[]).flatMap((kind) => {
    const message = questionFor[kind](state, tagName, context)
    return message === undefined ? [] : [{ kind, message }]
  })
}

// Returns undefined when the version is already tagged on origin and on npm.
export const planPackage = (
  state: PackageState,
  head: string,
): PackagePlan | undefined => {
  const hasRemoteTag = state.remoteTagCommit !== undefined
  if (state.onNpm && hasRemoteTag) {
    return undefined
  }
  const distTag = distTagFor(state.version)
  return {
    name: state.name,
    version: state.version,
    dir: state.dir,
    tagName: tagNameFor(state.name, state.version),
    distTag,
    createTag: !hasRemoteTag && state.localTagCommit === undefined,
    pushTag: !hasRemoteTag,
    publish: !state.onNpm,
    questions: collectQuestions(state, { distTag, head }),
  }
}

// Dependencies before dependents, otherwise in the given order.
export const sortTopologically = <
  T extends { name: string; internalDependencies: string[] },
>(
  packages: T[],
) => {
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const sorted: T[] = []
  const visiting = new Set<string>()
  const done = new Set<string>()

  const visit = (pkg: T) => {
    if (done.has(pkg.name)) {
      return
    }
    if (visiting.has(pkg.name)) {
      throw new Error(`dependency cycle involving ${pkg.name}`)
    }
    visiting.add(pkg.name)
    pkg.internalDependencies.forEach((dependency) => {
      const dependencyPackage = byName.get(dependency)
      if (dependencyPackage) {
        visit(dependencyPackage)
      }
    })
    visiting.delete(pkg.name)
    done.add(pkg.name)
    sorted.push(pkg)
  }

  packages.forEach(visit)
  return sorted
}
