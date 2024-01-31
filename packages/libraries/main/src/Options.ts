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
import {
  checkTimeEstimationValues,
  timeEstimationValuesDefaults,
} from './TimeEstimates'

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

  public useLevenshteinDistance: boolean = false

  public levenshteinThreshold: number = 2

  public l33tMaxSubstitutions: number = 100

  public maxLength: number = 256

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
    this.setOptions(options)
    Object.entries(customMatchers).forEach(([name, matcher]) => {
      this.addMatcher(name, matcher)
    })
  }

  // eslint-disable-next-line max-statements,complexity
  private setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      this.l33tTable = options.l33tTable
      this.trieNodeRoot = l33tTableToTrieNode(options.l33tTable, new TrieNode())
    }

    if (options.dictionary) {
      this.dictionary = options.dictionary

      this.setRankedDictionaries()
    }

    if (options.translations) {
      this.setTranslations(options.translations)
    }

    if (options.graphs) {
      this.graphs = options.graphs
    }

    if (options.useLevenshteinDistance !== undefined) {
      this.useLevenshteinDistance = options.useLevenshteinDistance
    }

    if (options.levenshteinThreshold !== undefined) {
      this.levenshteinThreshold = options.levenshteinThreshold
    }

    if (options.l33tMaxSubstitutions !== undefined) {
      this.l33tMaxSubstitutions = options.l33tMaxSubstitutions
    }

    if (options.maxLength !== undefined) {
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
    if (this.checkCustomTranslations(translations)) {
      this.translations = translations
    } else {
      throw new Error('Invalid translations object fallback to keys')
    }
  }

  private checkCustomTranslations(translations: TranslationKeys) {
    let valid = true
    Object.keys(translationKeys).forEach((type) => {
      if (type in translations) {
        const translationType = type as keyof typeof translationKeys
        Object.keys(translationKeys[translationType]).forEach((key) => {
          if (!(key in translations[translationType])) {
            valid = false
          }
        })
      } else {
        valid = false
      }
    })
    return valid
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
    let rankedDictionaryMaxWordSize: number = 0
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
