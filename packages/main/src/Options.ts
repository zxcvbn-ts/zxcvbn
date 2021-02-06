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
  // @ts-ignore
  l33tTable: OptionsL33tTable

  dictionary: OptionsDictionary = {
    userInput: [],
  }

  // @ts-ignore
  rankedDictionaries: RankedDictionaries

  // @ts-ignore
  translations: TranslationKeys

  // @ts-ignore
  graphs: OptionsGraph

  availableGraphs: DefaultAdjacencyGraphsKeys[] = []

  fetch

  setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      this.l33tTable = options.l33tTable
    } else if (!this.l33tTable) {
      this.l33tTable = l33tTable
    }

    if (options.dictionary) {
      this.dictionary = options.dictionary
    }

    if (options.translations) {
      this.setTranslations(options.translations)
    } else if (!this.translations) {
      this.setTranslations(translationKeys)
    }

    if (options.graphs) {
      this.setAdjacencyGraphs(options.graphs)
    } else if (!this.graphs) {
      this.setAdjacencyGraphs(graphs)
    }

    if (options.fetch) {
      this.fetch = options.fetch
    }

    this.setRankedDictionaries()
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
