import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  Keyboards,
  Keypads,
  LooseObject,
  OptionsType,
  OptionsDictionary,
  DefaultAdjacencyGraphsKeys,
  OptionsL33tTable,
  OptionsGraph,
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
  rankedDictionaries: OptionsDictionary

  usedKeyboard: Keyboards = 'qwerty'

  usedKeypad: Keypads = 'keypad'

  // @ts-ignore
  translations: TranslationKeys

  // @ts-ignore
  graphs: OptionsGraph

  availableGraphs: DefaultAdjacencyGraphsKeys[] = []

  keyboardAverageDegree = 0

  keypadAverageDegree = 0

  keyboardStartingPositions = 0

  keypadStartingPositions = 0

  setOptions(options: OptionsType = {}) {
    if (options.usedKeyboard) {
      this.usedKeyboard = options.usedKeyboard
    }

    if (options.usedKeypad) {
      this.usedKeypad = options.usedKeypad
    }

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
        Object.keys(translationKeys[type]).forEach((key) => {
          if (!(key in translations[type])) {
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
    const rankedDictionaries: LooseObject = {}
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
    this.rankedDictionaries = rankedDictionaries as OptionsDictionary
  }

  setAdjacencyGraphs(adjacencyGraphs: OptionsGraph) {
    if (adjacencyGraphs) {
      this.graphs = adjacencyGraphs
      this.availableGraphs = Object.keys(
        adjacencyGraphs,
      ) as DefaultAdjacencyGraphsKeys[]
      if (adjacencyGraphs[this.usedKeyboard]) {
        this.keyboardAverageDegree = this.calcAverageDegree(
          // @ts-ignore
          adjacencyGraphs[this.usedKeyboard],
        )
        this.keyboardStartingPositions = Object.keys(
          adjacencyGraphs[this.usedKeyboard],
        ).length
      }
      if (adjacencyGraphs[this.usedKeypad]) {
        this.keypadAverageDegree = this.calcAverageDegree(
          // @ts-ignore
          adjacencyGraphs[this.usedKeypad],
        )

        this.keypadStartingPositions = Object.keys(
          adjacencyGraphs[this.usedKeypad],
        ).length
      }
    }
  }

  calcAverageDegree(graph: OptionsGraph) {
    let average = 0
    Object.keys(graph).forEach((key) => {
      const neighbors = graph[key]
      average += neighbors.filter((entry) => !!entry).length
    })
    average /= Object.entries(graph).length
    return average
  }
}

export default new Options()
