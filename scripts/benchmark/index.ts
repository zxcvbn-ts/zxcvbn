// Compares the speed of the original zxcvbn, published @zxcvbn-ts/core versions and this
// checkout. Every measurement runs in its own plain node process, see ./worker.ts.
//
// Prints one markdown table, --json also keeps median, p95 and average scores.
// --compact ("yarn -s benchmark:silent") measures the same but prints as little as possible
// for AI agents, without progress, scenario descriptions and table padding.
//
//   yarn benchmark [--targets local,4.2.0] [--scenarios common,long]
//                  [--time 2000] [--warmup 500] [--startup-runs 5] [--baseline "zxcvbn 4.4.2"]
//                  [--timeout 60] [--json out.json] [--compact]
import { execFileSync, spawnSync } from 'node:child_process'
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { buildSync } from 'esbuild'
import { createScenarios, Scenario } from './passwords.ts'
import { benchmarkDir, localPackageDirs, Target, targets } from './targets.ts'
import type { StartupResult, ThroughputResult } from './worker.ts'

const root = path.resolve(__dirname, '../..')
const workerFile = path.join(benchmarkDir, 'node_modules/.cache/worker.cjs')

const { values: args } = parseArgs({
  options: {
    'targets': { type: 'string' },
    'scenarios': { type: 'string' },
    'time': { type: 'string', default: '2000' },
    'warmup': { type: 'string', default: '500' },
    'startup-runs': { type: 'string', default: '5' },
    'baseline': { type: 'string' },
    // seconds per measuring process, old versions take minutes for some inputs
    'timeout': { type: 'string', default: '60' },
    'json': { type: 'string' },
    'compact': { type: 'boolean', default: false },
  },
})

const logProgress = (message: string) => {
  if (!args.compact) {
    console.warn(message)
  }
}

// a comma separated list of word prefixes, e.g. "zxcvbn,4.2,local" picks
// "zxcvbn 4.4.2", "@zxcvbn-ts 4.2.0" and "local"
const filterByName = <T extends { name: string }>(
  items: T[],
  list?: string,
) => {
  if (!list) {
    return items
  }
  const fragments = list.split(',').map((fragment) => fragment.trim())
  return items.filter(({ name }) =>
    name
      .split(' ')
      .some((word) => fragments.some((fragment) => word.startsWith(fragment))),
  )
}

const installPublishedVersions = () => {
  const { dependencies } = JSON.parse(
    readFileSync(path.join(benchmarkDir, 'package.json'), 'utf8'),
  )
  const installed = Object.keys(dependencies).every((dependency) =>
    existsSync(path.join(benchmarkDir, 'node_modules', dependency)),
  )
  if (installed) {
    return
  }
  logProgress('Installing the published versions into scripts/benchmark')
  execFileSync(
    'npm',
    ['install', '--no-audit', '--no-fund', '--no-package-lock'],
    // a failed install still reports its stderr through the thrown error
    { cwd: benchmarkDir, stdio: args.compact ? 'pipe' : 'inherit' },
  )
}

const hasLocalBuild = () =>
  localPackageDirs.every((dir) => existsSync(path.join(dir, 'dist/index.cjs')))

const newestModification = (dir: string) =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .reduce(
      (newest, entry) =>
        Math.max(
          newest,
          statSync(path.join(entry.parentPath, entry.name)).mtimeMs,
        ),
      0,
    )

// "local" measures the dist build, which doesn't pick up source edits on its own
const warnAboutStaleBuild = () => {
  const stale = localPackageDirs
    .filter(
      (dir) =>
        newestModification(path.join(dir, 'src')) >
        statSync(path.join(dir, 'dist/index.cjs')).mtimeMs,
    )
    .map((dir) => path.relative(root, dir))
  if (stale.length > 0) {
    console.warn(
      `Warning: the dist build of ${stale.join(', ')} is older than its src, "local" measures the old code. Run "yarn build" first.`,
    )
  }
}

// bundled so the measured process runs without tsx, which would
// otherwise also transpile the local dist files while they are being loaded
const buildWorker = () => {
  buildSync({
    entryPoints: [path.join(benchmarkDir, 'worker.ts')],
    outfile: workerFile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
    // targets.ts resolves the installed versions relative to its own directory
    define: { __dirname: JSON.stringify(benchmarkDir) },
    logLevel: 'error',
  })
}

// undefined when the process ran into --timeout
const runWorker = (workerArgs: string[]): unknown => {
  const result = spawnSync(
    process.execPath,
    ['--expose-gc', workerFile, ...workerArgs],
    {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      timeout: Number(args.timeout) * 1000,
    },
  )
  // spawnSync stops the process with SIGTERM on timeout
  if (result.signal === 'SIGTERM') {
    return undefined
  }
  if (result.status !== 0) {
    throw new Error(`Worker ${workerArgs.join(' ')} failed:\n${result.stderr}`)
  }
  return JSON.parse(result.stdout)
}

const median = (values: number[]) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

const measureStartup = (target: Target): StartupResult => {
  const runs = Array.from({ length: Number(args['startup-runs']) }, () => {
    const result = runWorker(['startup', target.name])
    if (result === undefined) {
      throw new Error(`Startup of ${target.name} timed out`)
    }
    return result as StartupResult
  })
  const initMs = runs.map((run) => run.initMs)
  return {
    loadMs: median(runs.map((run) => run.loadMs)),
    initMs: initMs.includes(undefined) ? undefined : median(initMs as number[]),
    firstCheckMs: median(runs.map((run) => run.firstCheckMs)),
    heapMb: median(runs.map((run) => run.heapMb)),
    dictionaryWords: runs[0].dictionaryWords,
  }
}

const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

const printTable = (rows: Record<string, string>[], textColumns = 1) => {
  const headers = Object.keys(rows[0])
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`
  console.info(
    [
      '',
      line(headers),
      line(headers.map((_, index) => (index < textColumns ? '---' : '---:'))),
      ...rows.map((row) => line(headers.map((header) => row[header]))),
    ].join('\n'),
  )
}

const compareToBaseline = (
  values: Map<Target, number>,
  target: Target,
  baseline: string,
) => {
  if (target.name === baseline) {
    return 'baseline'
  }
  const baselineValue = [...values].find(([{ name }]) => name === baseline)?.[1]
  if (baselineValue === undefined) {
    return '-'
  }
  const ratio = baselineValue / values.get(target)!
  return ratio >= 1
    ? `${formatNumber(ratio, 2)}x faster`
    : `${formatNumber(1 / ratio, 2)}x slower`
}

// a value with its comparison to the baseline in one cell
const formatWithBaseline = (
  values: Map<Target, number>,
  target: Target,
  baseline: string,
) =>
  values.has(target)
    ? `${formatNumber(values.get(target)!)} (${compareToBaseline(values, target, baseline)})`
    : `timed out (> ${args.timeout} s)`

const mapValues = <T>(results: Map<Target, T>, value: (result: T) => number) =>
  new Map([...results].map(([target, result]) => [target, value(result)]))

const printResults = (
  startup: Map<Target, StartupResult>,
  throughput: ReturnType<typeof measure>['throughput'],
  baseline: string,
) => {
  const loadMs = mapValues(startup, (result) => result.loadMs)
  const meanUs = throughput.map(({ scenario, results }) => ({
    scenario,
    values: mapValues(results, (result) => result.meanUs),
  }))
  printTable(
    [...startup].map(([target, result]) => ({
      'target': target.name,
      'words': result.dictionaryWords
        ? result.dictionaryWords.toLocaleString('en-US')
        : 'bundled',
      'heap MB': formatNumber(result.heapMb),
      'import ms':
        result.initMs === undefined
          ? formatNumber(result.loadMs)
          : formatNumber(result.loadMs - result.initMs),
      'init factory ms':
        result.initMs === undefined ? '-' : formatNumber(result.initMs),
      'startup ms': formatWithBaseline(loadMs, target, baseline),
      'first check ms': formatNumber(result.firstCheckMs, 2),
      ...Object.fromEntries(
        meanUs.map(({ scenario, values }) => [
          `${scenario.name} µs`,
          formatWithBaseline(values, target, baseline),
        ]),
      ),
    })),
  )
}

const formatCompactNumber = (value: number) => {
  if (value >= 100) {
    return value.toFixed(0)
  }
  return String(Number(value.toFixed(value >= 10 ? 1 : 2)))
}

// a value and, unlike formatWithBaseline, its time relative to the baseline as a plain factor
const formatCompactCell = (
  values: Map<Target, number>,
  target: Target,
  baseline: string,
) => {
  const value = values.get(target)
  if (value === undefined) {
    return 't/o'
  }
  const baselineValue = [...values].find(([{ name }]) => name === baseline)?.[1]
  return target.name === baseline || baselineValue === undefined
    ? formatCompactNumber(value)
    : `${formatCompactNumber(value)} ${formatCompactNumber(value / baselineValue)}x`
}

const printCompactResults = (
  startup: Map<Target, StartupResult>,
  throughput: ReturnType<typeof measure>['throughput'],
  baseline: string,
) => {
  const loadMs = mapValues(startup, (result) => result.loadMs)
  const meanUs = throughput.map(({ scenario, results }) => ({
    scenario,
    values: mapValues(results, (result) => result.meanUs),
  }))
  const rows = [...startup].map(([target, result]) =>
    [
      target.name.replace('@zxcvbn-ts ', ''),
      result.dictionaryWords || 'bundled',
      formatCompactNumber(result.heapMb),
      formatCompactNumber(
        result.initMs === undefined
          ? result.loadMs
          : result.loadMs - result.initMs,
      ),
      result.initMs === undefined ? '-' : formatCompactNumber(result.initMs),
      formatCompactCell(loadMs, target, baseline),
      formatCompactNumber(result.firstCheckMs),
      ...meanUs.map(({ values }) =>
        formatCompactCell(values, target, baseline),
      ),
    ].join('|'),
  )
  console.info(
    [
      `target|words|heapMB|importMs|initMs|startupMs|firstCheckMs|${meanUs
        .map(({ scenario }) => `${scenario.name}Us`)
        .join('|')}`,
      ...rows,
    ].join('\n'),
  )
}

const selectTargets = () => {
  const selected = filterByName(targets, args.targets).filter((target) => {
    if (target.name !== 'local') {
      return true
    }
    if (!hasLocalBuild()) {
      console.warn(
        'Skipping "local": no dist build found, run "yarn build" first.',
      )
      return false
    }
    warnAboutStaleBuild()
    return true
  })
  if (selected.length === 0) {
    throw new Error(`No target matches "${args.targets}"`)
  }
  return selected
}

const measure = (selectedTargets: Target[], scenarios: Scenario[]) => {
  const startup = new Map<Target, StartupResult>()
  selectedTargets.forEach((target) => {
    logProgress(`startup: ${target.name}`)
    startup.set(target, measureStartup(target))
  })

  const throughput = scenarios.map((scenario) => {
    const results = new Map<Target, ThroughputResult>()
    selectedTargets.forEach((target) => {
      logProgress(`${scenario.name}: ${target.name}`)
      const result = runWorker([
        'throughput',
        target.name,
        scenario.name,
        args.time,
        args.warmup,
      ])
      if (result === undefined) {
        logProgress(`  timed out after ${args.timeout} s`)
        return
      }
      results.set(target, result as ThroughputResult)
    })
    return { scenario, results }
  })

  return { startup, throughput }
}

const writeJson = (
  file: string,
  {
    baseline,
    selectedTargets,
    startup,
    throughput,
  }: {
    baseline: string
    selectedTargets: Target[]
    startup: Map<Target, StartupResult>
    throughput: ReturnType<typeof measure>['throughput']
  },
) => {
  const serialize = <T>(results: Map<Target, T>) =>
    [...results].map(([target, result]) => ({
      target: target.name,
      ...result,
    }))
  writeFileSync(
    file,
    JSON.stringify(
      {
        node: process.version,
        cpu: os.cpus()[0].model,
        baseline,
        targets: selectedTargets.map(({ name, description }) => ({
          name,
          description,
        })),
        startup: serialize(startup),
        scenarios: throughput.map(({ scenario, results }) => ({
          name: scenario.name,
          description: scenario.description,
          results: serialize(results),
        })),
      },
      null,
      2,
    ),
  )
  console.info(`\nWrote ${file}`)
}

const printLegend = (scenarios: Scenario[]) => {
  if (args.compact) {
    console.info(
      `Nx: time relative to baseline, <1 is faster; t/o: over ${args.timeout} s`,
    )
    return
  }
  console.info(
    '- @zxcvbn-ts targets load language-common and language-en, zxcvbn uses its bundled data',
  )
  console.info(
    '- startup: median of fresh processes, import + init factory (setOptions before 4.x)',
  )
  scenarios.forEach(({ name, description, passwords }) => {
    console.info(
      `- ${name} µs: mean per check, ${description} (${passwords.length} passwords)`,
    )
  })
}

const main = () => {
  installPublishedVersions()
  buildWorker()
  const selectedTargets = selectTargets()
  const scenarios = filterByName(createScenarios(), args.scenarios)
  const baseline = args.baseline ?? selectedTargets[0].name

  console.info(
    `Node ${process.version} on ${os.cpus()[0].model}, ${args.time} ms per scenario, baseline "${baseline}"`,
  )
  printLegend(scenarios)

  const { startup, throughput } = measure(selectedTargets, scenarios)

  const print = args.compact ? printCompactResults : printResults
  print(startup, throughput, baseline)

  if (args.json) {
    writeJson(args.json, {
      baseline,
      selectedTargets,
      startup,
      throughput,
    })
  }
}

main()
