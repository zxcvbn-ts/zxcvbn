import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
} from './types'
import l33tTable from './data/l33tTable'
import translationKeys from './data/translationKeys'
import bruteforceMatcher from './matcher/bruteforce'
import dateMatcher from './matcher/date'
import dictionaryMatcher from './matcher/dictionary'
import regexMatcher from './matcher/regex'
import repeatMatcher from './matcher/repeat'
import sequenceMatcher from './matcher/sequence'
import spatialMatcher from './matcher/spatial'
import { defaultFeedbackFunction } from './Feedback'
import { defaultScoringFunction } from './scoring/estimate'

export type Matchers = {
  [key: string]: {
    feedback?: typeof defaultFeedbackFunction
    scoring: typeof defaultScoringFunction
    Matching?: any
  }
}

class Options {
  matchers: Matchers = {
    bruteforce: bruteforceMatcher,
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
  }

  l33tTable: OptionsL33tTable = l33tTable

  dictionary: OptionsDictionary = {
    userInput: [],
  }

  rankedDictionaries: RankedDictionaries = {}

  translations: TranslationKeys = translationKeys

  graphs: OptionsGraph = {}

  availableGraphs: string[] = []

  constructor() {
    this.setRankedDictionaries()
  }

  setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      this.l33tTable = options.l33tTable
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
    Object.keys(this.dictionary).forEach((name) => {
      const list = this.dictionary[name]
      if (name === 'userInputs') {
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

        rankedDictionaries[name] = buildRankedDictionary(sanitizedInputs)
      } else {
        rankedDictionaries[name] = buildRankedDictionary(list)
      }
    })
    this.rankedDictionaries = rankedDictionaries
  }
}

export default new Options()
