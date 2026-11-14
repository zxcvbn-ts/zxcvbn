import { isDictionaryNamed } from './utils/helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  OptionsL33tTable,
  OptionsGraph,
  Matchers,
  Matcher,
  UserInputsOptions,
  TimeEstimationValues,
} from './types'
import l33tTable from './data/l33tTable'
import translationKeys from './data/translationKeys'
import TrieNode from './matcher/dictionary/variants/matching/unmunger/TrieNode'
import WordIndex from './matcher/dictionary/WordIndex'
import {
  buildRankedDictionary,
  createUserInputsOptions,
  getMaxWordSize,
} from './matcher/dictionary/wordLists'
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'
import getL33tSubstitutions from './matcher/dictionary/variants/matching/l33tSubstitutions'
import { timeEstimationValuesDefaults } from './TimeEstimates'
import {
  checkCustomMatchers,
  checkCustomTranslations,
  checkDictionary,
  checkGraphs,
  checkL33tMaxSubstitutions,
  checkL33tTable,
  checkMatcher,
  checkMaxLength,
  checkTimeEstimationValues,
  checkUseLevenshteinDistance,
  checkLevenshteinThreshold,
} from './runtimeChecks'

export default class Options {
  public matchers: Matchers = {}

  public l33tTable: OptionsL33tTable = l33tTable

  // only for the fully substituted passwords checked with levenshtein, empty
  // without it
  public trieNodeRoot = new TrieNode()

  public l33tSubstitutions = getL33tSubstitutions(l33tTable)

  public dictionary: OptionsDictionary = {
    userInputs: [],
  }

  // the words of all dictionaries, empty until the dictionary option is set
  public wordIndex = new WordIndex()

  public dictionaryMaxWordSizes: Record<string, number> = {}

  private cachedRankedDictionaries:
    | Record<string, Record<string, number>>
    | undefined

  public translations: TranslationKeys = translationKeys

  private cachedUserInputs: (string | number)[] | undefined

  private cachedUserInputsOptions: Required<UserInputsOptions> | undefined

  public graphs: OptionsGraph = {}

  public useLevenshteinDistance = false

  public levenshteinThreshold = 2

  public l33tMaxSubstitutions = 100

  public maxLength = 256

  public wordSequenceNames = [
    'cardinalNumbers',
    'ordinalNumbers',
    'daysOfWeek',
    'months',
    'seasons',
    'timePeriods',
    'rainbowColors',
    'directions',
    'intermediateDirections',
    'sizeProgression',
    'militaryAlphabet',
    'planets',
    'zodiacSigns',
    'chineseZodiac',
    'userInputs',
  ]

  timeEstimationValues: TimeEstimationValues = {
    scoring: {
      ...timeEstimationValuesDefaults.scoring,
    },
    attackTime: {
      ...timeEstimationValuesDefaults.attackTime,
    },
  }
  constructor(
    options: OptionsType = {},
    customMatchers: Record<string, Matcher> = {},
  ) {
    checkCustomMatchers(customMatchers)
    this.setOptions(options)
    Object.entries(customMatchers).forEach(([name, matcher]) => {
      checkMatcher(name, matcher)
      this.addMatcher(name, matcher)
    })
  }

  /**
   * @deprecated The dictionaries are matched with `wordIndex`. This is only
   * built when read and will be removed in the next major version.
   */
  public get rankedDictionaries(): Record<string, Record<string, number>> {
    if (this.cachedRankedDictionaries === undefined) {
      const rankedDictionaries: Record<string, Record<string, number>> = {}
      Object.keys(this.dictionary).forEach((name) => {
        rankedDictionaries[name] = buildRankedDictionary(this.dictionary[name])
      })
      this.cachedRankedDictionaries = rankedDictionaries
    }
    return this.cachedRankedDictionaries
  }

  /**
   * @deprecated Use `dictionaryMaxWordSizes`, will be removed in the next
   * major version.
   */
  public get rankedDictionariesMaxWordSize(): Record<string, number> {
    return this.dictionaryMaxWordSizes
  }
  public isWordSequence(key: string) {
    return this.wordSequenceNames.some((name) => isDictionaryNamed(key, name))
  }

  // eslint-disable-next-line max-statements,complexity
  private setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      checkL33tTable(options.l33tTable)
      this.l33tTable = options.l33tTable
      this.l33tSubstitutions = getL33tSubstitutions(options.l33tTable)
    }

    if (options.dictionary) {
      checkDictionary(options.dictionary)
      this.dictionary = options.dictionary

      this.setWordIndex()
    }

    if (options.translations) {
      this.setTranslations(options.translations)
    }

    if (options.graphs) {
      checkGraphs(options.graphs)
      this.graphs = options.graphs
    }

    if (options.useLevenshteinDistance !== undefined) {
      checkUseLevenshteinDistance(options.useLevenshteinDistance)
      this.useLevenshteinDistance = options.useLevenshteinDistance
    }

    if (this.useLevenshteinDistance) {
      this.trieNodeRoot = l33tTableToTrieNode(this.l33tTable, new TrieNode())
    }

    if (options.levenshteinThreshold !== undefined) {
      checkLevenshteinThreshold(options.levenshteinThreshold)
      this.levenshteinThreshold = options.levenshteinThreshold
    }

    if (options.l33tMaxSubstitutions !== undefined) {
      checkL33tMaxSubstitutions(options.l33tMaxSubstitutions)
      this.l33tMaxSubstitutions = options.l33tMaxSubstitutions
    }

    if (options.maxLength !== undefined) {
      checkMaxLength(options.maxLength)
      this.maxLength = options.maxLength
    }

    if (options.timeEstimationValues !== undefined) {
      checkTimeEstimationValues(options.timeEstimationValues)
      this.timeEstimationValues = {
        scoring: {
          ...options.timeEstimationValues.scoring,
        },
        attackTime: {
          ...options.timeEstimationValues.attackTime,
        },
      }
    }
  }

  private setTranslations(translations: TranslationKeys) {
    const invalidKeys = checkCustomTranslations(translations)
    if (invalidKeys.length > 0) {
      throw new Error(
        `Invalid translations object, missing or invalid keys: ${invalidKeys.join(', ')}`,
      )
    }
    this.translations = translations
  }

  private setWordIndex() {
    const dictionaryMaxWordSizes: Record<string, number> = {}
    const names = Object.keys(this.dictionary)
    names.forEach((name) => {
      dictionaryMaxWordSizes[name] = getMaxWordSize(this.dictionary[name])
    })
    this.wordIndex = new WordIndex(
      names.map((name) => ({ name, words: this.dictionary[name] })),
    )
    this.dictionaryMaxWordSizes = dictionaryMaxWordSizes
  }

  public getUserInputsOptions(
    dictionary?: (string | number)[],
  ): Required<UserInputsOptions> {
    const { cachedUserInputs } = this
    const isCacheHit =
      this.cachedUserInputsOptions !== undefined &&
      (dictionary === undefined
        ? cachedUserInputs === undefined
        : cachedUserInputs?.length === dictionary.length &&
          cachedUserInputs.every((value, index) => value === dictionary[index]))

    if (isCacheHit) {
      return this.cachedUserInputsOptions!
    }

    const userInputsOptions = createUserInputsOptions(dictionary)

    // Snapshot the contents rather than keeping the caller's array reference,
    // so a later mutate-and-reuse of the same array is detected as a cache miss.
    this.cachedUserInputs = dictionary ? [...dictionary] : undefined
    this.cachedUserInputsOptions = userInputsOptions

    return userInputsOptions
  }

  private addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      console.info(`Matcher ${name} already exists`)
    } else {
      this.matchers[name] = matcher
    }
  }
}
