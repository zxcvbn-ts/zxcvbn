import { createRequire } from 'node:module'
import path from 'node:path'
import { performance } from 'node:perf_hooks'

export const benchmarkDir = __dirname
const root = path.resolve(__dirname, '../..')
// resolves the aliased published versions from scripts/benchmark/node_modules
const requireFromBenchmark = createRequire(
  path.join(benchmarkDir, 'package.json'),
)
const requireFromRoot = createRequire(path.join(root, 'package.json'))

export interface Target {
  name: string
  description: string
  load: () => Estimator
}

export interface Estimator {
  check: (password: string) => { score: number }
  dictionaryWords: number
  // new ZxcvbnFactory(options) for 4.x, the global setOptions(options) before
  initMs?: number
}

type Dictionary = Record<string, unknown[]>

interface LanguagePackage {
  dictionary: Dictionary
  adjacencyGraphs?: unknown
  translations?: unknown
}

const countWords = (dictionary: Dictionary) =>
  Object.values(dictionary).reduce((sum, words) => sum + words.length, 0)

// the same setup for every zxcvbn-ts version: language-common and language-en
const createEstimator = (
  core: any,
  common: LanguagePackage,
  en: LanguagePackage,
): Estimator => {
  const dictionary = { ...common.dictionary, ...en.dictionary }
  const options = {
    dictionary,
    graphs: common.adjacencyGraphs,
    translations: en.translations,
  }
  const dictionaryWords = countWords(dictionary)
  const initStart = performance.now()
  // up to 3.x the options are a global singleton, 4.x moved them into a factory instance
  if (core.ZxcvbnFactory) {
    const factory = new core.ZxcvbnFactory(options)
    return {
      check: (password) => factory.check(password),
      dictionaryWords,
      initMs: performance.now() - initStart,
    }
  }
  // 1.x exported it as ZxcvbnOptions
  const globalOptions = core.zxcvbnOptions ?? core.ZxcvbnOptions
  globalOptions.setOptions(options)
  return {
    check: (password) => core.zxcvbn(password),
    dictionaryWords,
    initMs: performance.now() - initStart,
  }
}

const publishedTarget = (major: number, version: string): Target => ({
  name: `@zxcvbn-ts ${version}`,
  description: `@zxcvbn-ts/core@${version} with language-common and language-en of the same major`,
  load: () =>
    createEstimator(
      requireFromBenchmark(`core-${major}`),
      requireFromBenchmark(`language-common-${major}`),
      requireFromBenchmark(`language-en-${major}`),
    ),
})

export const localPackageDirs = [
  'libraries/main',
  'languages/common',
  'languages/en',
].map((dir) => path.join(root, 'packages', dir))

export const targets: Target[] = [
  {
    name: 'zxcvbn 4.4.2',
    description: 'the original Dropbox zxcvbn, with its bundled english data',
    load: () => {
      const zxcvbn = requireFromBenchmark('zxcvbn')
      return { check: (password) => zxcvbn(password), dictionaryWords: 0 }
    },
  },
  publishedTarget(1, '1.2.0'),
  publishedTarget(2, '2.2.1'),
  publishedTarget(3, '3.0.4'),
  publishedTarget(4, '4.2.0'),
  {
    name: 'local',
    description: 'the dist builds of this checkout (run "yarn build" first)',
    load: () => {
      const [core, common, en] = localPackageDirs.map((dir) =>
        requireFromRoot(dir),
      )
      return createEstimator(core, common, en)
    },
  },
]
