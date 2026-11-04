import findLevenshteinDistance, {
  fromRankedDictionary,
  LevenshteinDictionary,
} from '../../utils/levenshtein'
import {
  DictionaryNames,
  DictionaryMatch,
  MatcherBaseClass,
  RankedDictionary,
  UserInputsOptions,
} from '../../types'
import Options from '../../Options'
import { DictionaryHit, DictionaryMatchOptions } from './types'
import {
  buildRankedDictionary,
  countCharacters,
  toLowerCase,
} from '../../utils/helper'
import WordIndex from './WordIndex'

const USER_INPUTS = 'userInputs'

// for a UserInputsOptions built without Options.getUserInputsOptions
const userInputsWordIndexCache = new WeakMap<RankedDictionary, WordIndex>()

const getUserInputsWordIndex = (userInputsOptions: UserInputsOptions) => {
  if (userInputsOptions.wordIndex) {
    return userInputsOptions.wordIndex
  }
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- the only input it has
  const { rankedDictionary } = userInputsOptions
  let wordIndex = userInputsWordIndexCache.get(rankedDictionary)
  if (!wordIndex) {
    const words = Object.keys(rankedDictionary)
    wordIndex = new WordIndex([
      {
        name: USER_INPUTS,
        words,
        ranks: words.map((word) => rankedDictionary[word]),
      },
    ])
    userInputsWordIndexCache.set(rankedDictionary, wordIndex)
  }
  return wordIndex
}

// the userInputs dictionary of the options with the user inputs on top
const userInputsLevenshteinCache = new WeakMap<
  Options,
  WeakMap<UserInputsOptions, LevenshteinDictionary>
>()

const getUserInputsLevenshteinDictionary = (
  options: Options,
  userInputsOptions: UserInputsOptions,
) => {
  let byUserInputs = userInputsLevenshteinCache.get(options)
  if (!byUserInputs) {
    byUserInputs = new WeakMap()
    userInputsLevenshteinCache.set(options, byUserInputs)
  }
  let dictionary = byUserInputs.get(userInputsOptions)
  if (!dictionary) {
    const optionsUserInputs = options.wordIndex.dictionaryNames.includes(
      USER_INPUTS,
    )
      ? buildRankedDictionary(options.dictionary[USER_INPUTS])
      : {}
    dictionary = fromRankedDictionary({
      ...optionsUserInputs,
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- levenshtein needs every entry
      ...userInputsOptions.rankedDictionary,
    })
    byUserInputs.set(userInputsOptions, dictionary)
  }
  return dictionary
}

class MatchDictionary extends MatcherBaseClass {
  // eslint-disable-next-line complexity,max-statements
  public match({
    password,
    userInputsOptions,
    useLevenshtein = true,
    minWindowEnds,
  }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = toLowerCase(password)
    const { wordIndex } = this.options
    const userInputsWordIndex = userInputsOptions
      ? getUserInputsWordIndex(userInputsOptions)
      : undefined
    const isLevenshteinEnabled =
      this.options.useLevenshteinDistance && useLevenshtein

    const addMatches = (i: number, j: number, hits: DictionaryHit[]) => {
      const usedPassword = passwordLower.slice(i, j + 1)
      hits.forEach(({ dictionaryName, rank, ...levenshtein }) => {
        matches.push({
          pattern: 'dictionary',
          i,
          j,
          token: password.slice(i, j + 1),
          matchedWord: usedPassword,
          rank,
          dictionaryName,
          reversed: false,
          l33t: false,
          ...levenshtein,
        })
      })
    }

    // the words that start with password[i, j], narrowed with each j
    const range = new Int32Array(2)
    const userInputsRange = new Int32Array(2)
    for (let i = 0; i < passwordLength; i += 1) {
      range[0] = 0
      range[1] = wordIndex.words.length
      userInputsRange[0] = 0
      userInputsRange[1] = userInputsWordIndex
        ? userInputsWordIndex.words.length
        : 0
      for (let j = i; j < passwordLength; j += 1) {
        const depth = j - i
        const code = passwordLower.charCodeAt(j)
        if (range[0] < range[1]) {
          wordIndex.narrow(range, depth, code)
        }
        if (userInputsWordIndex && userInputsRange[0] < userInputsRange[1]) {
          userInputsWordIndex.narrow(userInputsRange, depth, code)
        }
        // no longer word starts with it
        if (range[0] >= range[1] && userInputsRange[0] >= userInputsRange[1]) {
          break
        }
        // only use levenshtein distance on full password to minimize the performance drop
        // and because otherwise there would be to many false positives
        const isFullPassword = i === 0 && j === passwordLength - 1
        if (isLevenshteinEnabled && isFullPassword) {
          break
        }
        if (minWindowEnds && j < minWindowEnds[i]) {
          continue
        }
        // the shortest word of a range comes first
        const word =
          range[0] < range[1] && wordIndex.words[range[0]].length === depth + 1
            ? range[0]
            : -1
        const userInputsRank =
          userInputsWordIndex &&
          userInputsRange[0] < userInputsRange[1] &&
          userInputsWordIndex.words[userInputsRange[0]].length === depth + 1
            ? userInputsWordIndex.getRank(userInputsRange[0], 0)
            : undefined
        if (word !== -1 || userInputsRank !== undefined) {
          addMatches(i, j, this.getHits(word, userInputsRank))
        }
      }
      // the full password is checked for every dictionary, even if no word starts with it
      const isFullPasswordSkipped =
        minWindowEnds !== undefined && passwordLength - 1 < minWindowEnds[0]
      if (i === 0 && isLevenshteinEnabled && !isFullPasswordSkipped) {
        addMatches(
          0,
          passwordLength - 1,
          this.getLevenshteinHits(passwordLower, userInputsOptions),
        )
      }
    }
    return matches
  }

  // The hits of wordIndex.words[word], or -1 for none, in dictionary order.
  // A rank of the user inputs replaces the one of the dictionary userInputs,
  // or comes last without it.
  // eslint-disable-next-line max-statements
  private getHits(word: number, userInputsRank: number | undefined) {
    const { wordIndex } = this.options
    const { dictionaryNames, hitStart, hitDictionary, hitRank } = wordIndex
    const hits: DictionaryHit[] = []
    let userInputsDictionary = dictionaryNames.indexOf(USER_INPUTS)
    if (userInputsDictionary === -1) {
      userInputsDictionary = dictionaryNames.length
    }
    let remainingUserInputsRank = userInputsRank
    if (word !== -1) {
      for (let hit = hitStart[word]; hit < hitStart[word + 1]; hit += 1) {
        const dictionary = hitDictionary[hit]
        if (
          remainingUserInputsRank !== undefined &&
          dictionary >= userInputsDictionary
        ) {
          hits.push({
            dictionaryName: USER_INPUTS,
            rank: remainingUserInputsRank,
          })
          remainingUserInputsRank = undefined
          if (dictionary === userInputsDictionary) {
            continue
          }
        }
        hits.push({
          dictionaryName: dictionaryNames[dictionary] as DictionaryNames,
          rank: hitRank[hit],
        })
      }
    }
    if (remainingUserInputsRank !== undefined) {
      hits.push({ dictionaryName: USER_INPUTS, rank: remainingUserInputsRank })
    }
    return hits
  }

  // the hits of the full password in every dictionary, in dictionary order
  private getLevenshteinHits(
    usedPassword: string,
    userInputsOptions: UserInputsOptions | undefined,
  ) {
    const { wordIndex, rankedDictionariesMaxWordSize } = this.options
    const hits: DictionaryHit[] = []
    const addHit = (
      dictionaryName: string,
      dictionary: LevenshteinDictionary,
      maxWordSize: number,
    ) => {
      // a more common entry close to the full password beats the password
      // itself, even if the dictionary contains it
      const levenshteinHit = this.findLevenshteinHit(
        usedPassword,
        dictionary,
        maxWordSize,
      )
      const rank = dictionary.getRank(usedPassword)
      if (levenshteinHit) {
        hits.push({
          dictionaryName: dictionaryName as DictionaryNames,
          ...levenshteinHit,
        })
      } else if (rank !== undefined) {
        hits.push({ dictionaryName: dictionaryName as DictionaryNames, rank })
      }
    }
    const addUserInputsHit = (options: UserInputsOptions) => {
      addHit(
        USER_INPUTS,
        getUserInputsLevenshteinDictionary(this.options, options),
        Math.max(
          options.rankedDictionaryMaxWordSize,
          rankedDictionariesMaxWordSize[USER_INPUTS] || 0,
        ),
      )
    }
    wordIndex.dictionaryNames.forEach((name, dictionary) => {
      if (name === USER_INPUTS && userInputsOptions) {
        addUserInputsHit(userInputsOptions)
      } else {
        addHit(
          name,
          wordIndex.getLevenshteinDictionary(dictionary),
          rankedDictionariesMaxWordSize[name],
        )
      }
    })
    if (userInputsOptions && !wordIndex.dictionaryNames.includes(USER_INPUTS)) {
      addUserInputsHit(userInputsOptions)
    }
    return hits
  }

  private findLevenshteinHit(
    usedPassword: string,
    dictionary: LevenshteinDictionary,
    maxWordSize: number,
  ) {
    const { levenshteinThreshold } = this.options
    // a password longer than the dictionary's longest word by more than
    // the threshold is at least that many edits away from every entry
    if (countCharacters(usedPassword) - maxWordSize > levenshteinThreshold) {
      return undefined
    }
    const { levenshteinDistance, levenshteinDistanceEntry } =
      findLevenshteinDistance(usedPassword, dictionary, levenshteinThreshold)
    // finding the password itself is an exact match, not a levenshtein one
    if (
      levenshteinDistance === undefined ||
      levenshteinDistanceEntry === undefined ||
      levenshteinDistanceEntry === usedPassword
    ) {
      return undefined
    }
    return {
      rank: dictionary.getRank(levenshteinDistanceEntry)!,
      levenshteinDistance,
      levenshteinDistanceEntry,
    }
  }
}

export default MatchDictionary
