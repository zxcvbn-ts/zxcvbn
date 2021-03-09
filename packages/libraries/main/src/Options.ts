import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  DefaultAdjacencyGraphsKeys,
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
} from './types'
import l33tTable from './data/l33tTable'
import graphs from './data/adjacencyGraphs'
import translationKeys from './data/translationKeys'

class Options {
  l33tTable: OptionsL33tTable = l33tTable

  dictionary: OptionsDictionary = {
    userInput: [],
  }

  rankedDictionaries: RankedDictionaries = {}

  translations: TranslationKeys = translationKeys

  graphs: OptionsGraph = graphs

  availableGraphs: DefaultAdjacencyGraphsKeys[] = []

  constructor() {
    this.setRankedDictionaries()
    this.setAdjacencyGraphs(graphs)
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
      this.setAdjacencyGraphs(options.graphs)
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

  setAdjacencyGraphs(adjacencyGraphs: OptionsGraph) {
    if (adjacencyGraphs) {
      this.graphs = adjacencyGraphs
      this.availableGraphs = Object.keys(
        adjacencyGraphs,
      ) as DefaultAdjacencyGraphsKeys[]
    }
  }
}

export default new Options()
