import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
  Matchers,
  Matcher,
} from './types'
import l33tTable from './data/l33tTable'
import translationKeys from './data/translationKeys'
import TrieNode from './matcher/dictionary/variants/matching/unmunger/TrieNode'
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'

export class Options {
  matchers: Matchers = {}

  l33tTable: OptionsL33tTable = l33tTable

  trieNodeRoot: TrieNode = l33tTableToTrieNode(l33tTable, new TrieNode())

  dictionary: OptionsDictionary = {
    userInputs: [],
  }

  rankedDictionaries: RankedDictionaries = {}

  rankedDictionariesMaxWordSize: Record<string, number> = {}

  translations: TranslationKeys = translationKeys

  graphs: OptionsGraph = {}

  useLevenshteinDistance: boolean = false

  levenshteinThreshold: number = 2

  l33tMaxSubstitutions: number = 100

  maxLength: number = 256

  constructor() {
    this.setRankedDictionaries()
  }

  // eslint-disable-next-line max-statements,complexity
  setOptions(options: OptionsType = {}) {
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
  }

  setTranslations(translations: TranslationKeys) {
    if (this.checkCustomTranslations(translations)) {
      this.translations = translations
    } else {
      throw new Error('Invalid translations object fallback to keys')
    }
  }

  checkCustomTranslations(translations: TranslationKeys) {
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

  setRankedDictionaries() {
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

  getRankedDictionariesMaxWordSize(list: (string | number)[]) {
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

  buildSanitizedRankedDictionary(list: (string | number)[]) {
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

  extendUserInputsDictionary(dictionary: (string | number)[]) {
    if (!this.dictionary.userInputs) {
      this.dictionary.userInputs = []
    }

    const newList = [...this.dictionary.userInputs, ...dictionary]
    this.rankedDictionaries.userInputs =
      this.buildSanitizedRankedDictionary(newList)
    this.rankedDictionariesMaxWordSize.userInputs =
      this.getRankedDictionariesMaxWordSize(newList)
  }

  public addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      console.info(`Matcher ${name} already exists`)
    } else {
      this.matchers[name] = matcher
    }
  }
}

export const zxcvbnOptions = new Options()
