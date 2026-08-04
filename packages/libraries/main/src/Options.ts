import { buildRankedDictionary } from './utils/helper'
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

  public rankedDictionaries: RankedDictionaries = {}

  public rankedDictionariesMaxWordSize: Record<string, number> = {}

  public translations: TranslationKeys = translationKeys

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
    if (checkCustomTranslations(translations)) {
      this.translations = translations
    } else {
      throw new Error('Invalid translations object fallback to keys')
    }
  }

  private setRankedDictionaries() {
    const rankedDictionaries: RankedDictionaries = {}
    const rankedDictionariesMaxWorkSize: Record<string, number> = {}
    Object.keys(this.dictionary).forEach((name) => {
      rankedDictionaries[name] = buildRankedDictionary(this.dictionary[name])
      rankedDictionariesMaxWorkSize[name] =
        this.getRankedDictionariesMaxWordSize(this.dictionary[name])
    })
    this.rankedDictionaries = rankedDictionaries
    this.rankedDictionariesMaxWordSize = rankedDictionariesMaxWorkSize
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

  private buildSanitizedRankedDictionary(list: (string | number)[]) {
    const sanitizedInputs: string[] = []

    list.forEach((input: string | number | boolean) => {
      const inputType = typeof input
      if (
        inputType === 'string' ||
        inputType === 'number' ||
        inputType === 'boolean'
      ) {
        sanitizedInputs.push(input.toString().toLowerCase())
      }
    })

    return buildRankedDictionary(sanitizedInputs)
  }

  public getUserInputsOptions(
    dictionary?: (string | number)[],
  ): UserInputsOptions {
    let rankedDictionary: RankedDictionary = {}
    let rankedDictionaryMaxWordSize = 0
    if (dictionary) {
      rankedDictionary = this.buildSanitizedRankedDictionary(dictionary)
      rankedDictionaryMaxWordSize =
        this.getRankedDictionariesMaxWordSize(dictionary)
    }

    return {
      rankedDictionary,
      rankedDictionaryMaxWordSize,
    }
  }

  private addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      console.info(`Matcher ${name} already exists`)
    } else {
      this.matchers[name] = matcher
    }
  }
}
