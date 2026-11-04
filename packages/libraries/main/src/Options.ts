import { buildRankedDictionary, toLowerCase } from './utils/helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
  Matchers,
  Matcher,
  UserInputsOptions,
  RankedDictionary,
  TimeEstimationValues,
} from './types'
import l33tTable from './data/l33tTable'
import translationKeys from './data/translationKeys'
import TrieNode from './matcher/dictionary/variants/matching/unmunger/TrieNode'
import WordIndex from './matcher/dictionary/WordIndex'
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'
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

  public trieNodeRoot: TrieNode = l33tTableToTrieNode(l33tTable, new TrieNode())

  public dictionary: OptionsDictionary = {
    userInputs: [],
  }

  // the words of all dictionaries, empty until the dictionary option is set
  public wordIndex = new WordIndex()

  private cachedRankedDictionaries: RankedDictionaries | undefined

  public rankedDictionariesMaxWordSize: Record<string, number> = {}

  public translations: TranslationKeys = translationKeys

  private cachedUserInputs: (string | number)[] | undefined

  private cachedUserInputsOptions: UserInputsOptions | undefined

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
  public isWordSequence(key: string) {
    return this.wordSequenceNames.some(
      (name) => key === name || key.startsWith(`${name}-`),
    )
  }

  // eslint-disable-next-line max-statements,complexity
  private setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      checkL33tTable(options.l33tTable)
      this.l33tTable = options.l33tTable
      this.trieNodeRoot = l33tTableToTrieNode(options.l33tTable, new TrieNode())
    }

    if (options.dictionary) {
      checkDictionary(options.dictionary)
      this.dictionary = options.dictionary

      this.setRankedDictionaries()
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

  private setRankedDictionaries() {
    const rankedDictionariesMaxWorkSize: Record<string, number> = {}
    const names = Object.keys(this.dictionary)
    names.forEach((name) => {
      rankedDictionariesMaxWorkSize[name] =
        this.getRankedDictionariesMaxWordSize(this.dictionary[name])
    })
    this.wordIndex = new WordIndex(
      names.map((name) => ({ name, words: this.dictionary[name] })),
    )
    this.cachedRankedDictionaries = undefined
    this.rankedDictionariesMaxWordSize = rankedDictionariesMaxWorkSize
  }

  /**
   * @deprecated The matchers use wordIndex, this builds an object per
   * dictionary on first use, which takes several times the memory of it.
   */
  public get rankedDictionaries(): RankedDictionaries {
    if (!this.cachedRankedDictionaries) {
      const rankedDictionaries: RankedDictionaries = {}
      this.wordIndex.dictionaryNames.forEach((name) => {
        rankedDictionaries[name] = buildRankedDictionary(this.dictionary[name])
      })
      this.cachedRankedDictionaries = rankedDictionaries
    }
    return this.cachedRankedDictionaries
  }

  private getRankedDictionariesMaxWordSize(list: (string | number)[]) {
    const data = list.map((el) => {
      if (typeof el !== 'string') {
        return el.toString().length
      }
      return el.length
    })

    // do not use Math.max(...data) because it can result in max stack size error because every entry will be used as an argument
    if (data.length === 0) {
      return 0
    }
    return data.reduce((a, b) => Math.max(a, b), -Infinity)
  }

  private sanitizeUserInputs(list: (string | number)[]) {
    const sanitizedInputs: string[] = []

    list.forEach((input: string | number | boolean) => {
      const inputType = typeof input
      if (
        inputType === 'string' ||
        inputType === 'number' ||
        inputType === 'boolean'
      ) {
        sanitizedInputs.push(toLowerCase(input.toString()))
      }
    })

    return sanitizedInputs
  }

  private createUserInputsOptions(
    dictionary: (string | number)[] | undefined,
  ): UserInputsOptions {
    const sanitizedInputs = dictionary
      ? this.sanitizeUserInputs(dictionary)
      : []
    let rankedDictionary: RankedDictionary | undefined
    return {
      get rankedDictionary() {
        if (!rankedDictionary) {
          rankedDictionary = buildRankedDictionary(sanitizedInputs)
        }
        return rankedDictionary
      },
      rankedDictionaryMaxWordSize: dictionary
        ? this.getRankedDictionariesMaxWordSize(dictionary)
        : 0,
      wordIndex: new WordIndex([
        { name: 'userInputs', words: sanitizedInputs },
      ]),
    }
  }

  public getUserInputsOptions(
    dictionary?: (string | number)[],
  ): UserInputsOptions {
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

    const userInputsOptions = this.createUserInputsOptions(dictionary)

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
