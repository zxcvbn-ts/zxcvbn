// Measures one target in a fresh process, so versions don't share a heap or JIT state.
// Prints a single JSON result to stdout. Started by ./index.ts.
import { performance } from 'node:perf_hooks'
import { createScenarios } from './passwords'
import { Estimator, targets } from './targets'

export interface StartupResult {
  // everything until the first check is possible, including initMs
  loadMs: number
  initMs?: number
  firstCheckMs: number
  heapMb: number
  dictionaryWords: number
}

export interface ThroughputResult {
  checks: number
  meanUs: number
  medianUs: number
  p95Us: number
  averageScore: number
}

const collectGarbage = () => {
  // available because index.ts starts the worker with --expose-gc
  ;(globalThis as { gc?: () => void }).gc?.()
}

const measureStartup = (load: () => Estimator): StartupResult => {
  const loadStart = performance.now()
  const estimator = load()
  const loadEnd = performance.now()
  estimator.check('Tr0ub4dor&3')
  const firstCheckEnd = performance.now()
  collectGarbage()
  return {
    loadMs: loadEnd - loadStart,
    initMs: estimator.initMs,
    firstCheckMs: firstCheckEnd - loadEnd,
    heapMb: process.memoryUsage().heapUsed / 1024 / 1024,
    dictionaryWords: estimator.dictionaryWords,
  }
}

const runFor = (durationMs: number, onePass: () => void) => {
  const end = performance.now() + durationMs
  do {
    onePass()
  } while (performance.now() < end)
}

const percentile = (sorted: Float64Array, fraction: number) =>
  sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))]

const measureThroughput = (
  estimator: Estimator,
  passwords: string[],
  { durationMs, warmupMs }: { durationMs: number; warmupMs: number },
): ThroughputResult => {
  runFor(warmupMs, () => {
    passwords.forEach((password) => estimator.check(password))
  })
  collectGarbage()

  const timings: number[] = []
  let scoreSum = 0
  runFor(durationMs, () => {
    passwords.forEach((password) => {
      const start = performance.now()
      const { score } = estimator.check(password)
      timings.push(performance.now() - start)
      scoreSum += score
    })
  })

  const sorted = Float64Array.from(timings).sort()
  const total = timings.reduce((sum, timing) => sum + timing, 0)
  return {
    checks: timings.length,
    meanUs: (total / timings.length) * 1000,
    medianUs: percentile(sorted, 0.5) * 1000,
    p95Us: percentile(sorted, 0.95) * 1000,
    averageScore: scoreSum / timings.length,
  }
}

const main = () => {
  const [mode, targetName, scenarioName, durationMs, warmupMs] =
    process.argv.slice(2)
  const target = targets.find(({ name }) => name === targetName)
  if (!target) {
    throw new Error(`Unknown target "${targetName}"`)
  }
  if (mode === 'startup') {
    return measureStartup(target.load)
  }
  const scenario = createScenarios().find(({ name }) => name === scenarioName)
  if (!scenario) {
    throw new Error(`Unknown scenario "${scenarioName}"`)
  }
  return measureThroughput(target.load(), scenario.passwords, {
    durationMs: Number(durationMs),
    warmupMs: Number(warmupMs),
  })
}

process.stdout.write(JSON.stringify(main()))
