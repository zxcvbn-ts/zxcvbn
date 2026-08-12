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
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'
import { DictionaryTrie } from './matcher/dictionary/DictionaryTrie'
import mergeUserInputDictionary from './utils/mergeUserInputDictionary'
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

  public dictionaryTrie: DictionaryTrie = new DictionaryTrie()
  public dictionaryMaxWordSize: Record<string, number> = {}
  public dictionaryMinWordSize: Record<string, number> = {}

  public translations: TranslationKeys = translationKeys

  private cachedUserInputs: (string | number)[] | undefined

  private cachedUserInputsOptions: UserInputsOptions | undefined

  public graphs: OptionsGraph = {}

  public useLevenshteinDistance = false

  public levenshteinThreshold = 2

  public l33tMaxSubstitutions = 500

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

      this.initDictionaryTrie()
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

  private initDictionaryTrie() {
    this.dictionaryTrie = new DictionaryTrie()
    this.dictionaryMaxWordSize = {}
    this.dictionaryMinWordSize = {}

    Object.entries(this.dictionary).forEach(([name, list]) => {
      const { maxWordSize, minWordSize } = this.buildTrie(
        name,
        list,
        this.dictionaryTrie,
      )
      this.dictionaryMaxWordSize[name] = maxWordSize
      this.dictionaryMinWordSize[name] = minWordSize
    })
  }

  private buildTrie(
    name: string,
    list: (string | number | boolean)[],
    trie: DictionaryTrie,
    shouldSanitize = false,
  ) {
    let maxWordSize = 0
    let minWordSize = Infinity
    const seenWords = new Set<string>()
    const sanitizedList: string[] = []

    list.forEach((input, index) => {
      let word = input.toString()
      if (shouldSanitize) {
        word = word.toLowerCase()
      }

      if (shouldSanitize) {
        if (seenWords.has(word)) {
          return
        }
        seenWords.add(word)
      }

      sanitizedList.push(word)
      const rank = shouldSanitize ? sanitizedList.length : index + 1
      const wordLength = word.length

      if (wordLength > maxWordSize) {
        maxWordSize = wordLength
      }
      if (wordLength < minWordSize) {
        minWordSize = wordLength
      }

      trie.add(word, name, rank, false)
      trie.add(word.split('').reverse().join(''), name, rank, true)
    })

    return {
      maxWordSize,
      minWordSize: sanitizedList.length > 0 ? minWordSize : 0,
      sanitizedList,
    }
  }

  public getUserInputsOptions(
    dictionary?: (string | number)[],
  ): UserInputsOptions {
    if (dictionary && dictionary === this.cachedUserInputs) {
      return this.cachedUserInputsOptions!
    }

    const dictionaryTrie = new DictionaryTrie()
    const {
      maxWordSize: dictionaryMaxWordSize,
      minWordSize: dictionaryMinWordSize,
      sanitizedList: sanitizedDictionary,
    } = this.buildTrie('userInputs', dictionary ?? [], dictionaryTrie, true)

    const userInputsOptions: UserInputsOptions = {
      dictionary: sanitizedDictionary,
      dictionaryMaxWordSize,
      dictionaryMinWordSize,
      dictionaryTrie,
    }

    const {
      dictionaries,
      dictionaryMaxWordSize: maxWordSize,
      dictionaryMinWordSize: minWordSize,
    } = mergeUserInputDictionary(
      this.dictionary,
      this.dictionaryMaxWordSize,
      this.dictionaryMinWordSize,
      userInputsOptions,
    )
    userInputsOptions.mergedDictionaries = dictionaries
    userInputsOptions.mergedDictionaryMaxWordSize = maxWordSize
    userInputsOptions.mergedDictionaryMinWordSize = minWordSize

    this.cachedUserInputs = dictionary
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
