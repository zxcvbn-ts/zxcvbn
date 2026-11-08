import {
  LevenshteinDictionary,
  findLevenshteinEntry,
} from '../../utils/levenshtein'
import { DictionaryNames, DictionaryMatch, MatcherBaseClass } from '../../types'
import { DictionaryHit, DictionaryMatchOptions } from './types'
import { countCharacters, toLowerCase } from '../../utils/helper'
import WordIndex from './WordIndex'
import WordRanges from './WordRanges'

const USER_INPUTS = 'userInputs'

// The position of the user inputs among the dictionaries of wordIndex, the one
// of the dictionary userInputs, or after the last without it
export const getUserInputsPosition = (wordIndex: WordIndex) => {
  const position = wordIndex.dictionaryNames.indexOf(USER_INPUTS)
  return position === -1 ? wordIndex.dictionaryNames.length : position
}

// The longest user input in characters
const userInputsMaxWordSizeCache = new WeakMap<WordIndex, number>()

const getUserInputsMaxWordSize = (userInputsWordIndex: WordIndex) => {
  let maxWordSize = userInputsMaxWordSizeCache.get(userInputsWordIndex)
  if (maxWordSize === undefined) {
    maxWordSize = userInputsWordIndex.words.reduce(
      (max, word) => Math.max(max, countCharacters(word)),
      0,
    )
    userInputsMaxWordSizeCache.set(userInputsWordIndex, maxWordSize)
  }
  return maxWordSize
}

// the entries of both, an entry of first keeps its rank in first
const combineLevenshteinDictionaries = (
  first: LevenshteinDictionary,
  second: LevenshteinDictionary,
): LevenshteinDictionary => ({
  getEntries: () => {
    const { entries, ranks } = first.getEntries()
    const seen = new Set(entries)
    const secondEntries = second.getEntries()
    secondEntries.entries.forEach((entry, index) => {
      if (!seen.has(entry)) {
        entries.push(entry)
        ranks.push(secondEntries.ranks[index])
      }
    })
    return { entries, ranks }
  },
  getRank: (entry) => first.getRank(entry) ?? second.getRank(entry),
})

// The userInputs dictionary of the options with the user inputs on top. Keyed
// by both word indexes, which are rebuilt whenever their words change.
const userInputsLevenshteinCache = new WeakMap<
  WordIndex,
  WeakMap<WordIndex, LevenshteinDictionary>
>()

const getUserInputsLevenshteinDictionary = (
  wordIndex: WordIndex,
  userInputsWordIndex: WordIndex,
) => {
  let byUserInputs = userInputsLevenshteinCache.get(wordIndex)
  if (!byUserInputs) {
    byUserInputs = new WeakMap()
    userInputsLevenshteinCache.set(wordIndex, byUserInputs)
  }
  let dictionary = byUserInputs.get(userInputsWordIndex)
  if (!dictionary) {
    const userInputs = userInputsWordIndex.getLevenshteinDictionary(0)
    const optionsDictionary = wordIndex.dictionaryNames.indexOf(USER_INPUTS)
    dictionary =
      optionsDictionary === -1
        ? userInputs
        : combineLevenshteinDictionaries(
            userInputs,
            wordIndex.getLevenshteinDictionary(optionsDictionary),
          )
    byUserInputs.set(userInputsWordIndex, dictionary)
  }
  return dictionary
}

class MatchDictionary extends MatcherBaseClass {
  // eslint-disable-next-line complexity,max-statements
  public match({ password, userInputsOptions }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = toLowerCase(password)
    const { wordIndex, useLevenshteinDistance } = this.options
    const userInputsPosition = getUserInputsPosition(wordIndex)
    const userInputsWordIndex = userInputsOptions?.wordIndex

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
    const ranges = new WordRanges(wordIndex, userInputsWordIndex)
    for (let i = 0; i < passwordLength; i += 1) {
      ranges.reset()
      for (let j = i; j < passwordLength; j += 1) {
        const depth = j - i
        ranges.narrow(depth, passwordLower.charCodeAt(j))
        // no longer word starts with it
        if (ranges.isEmpty()) {
          break
        }
        // only use levenshtein distance on full password to minimize the performance drop
        // and because otherwise there would be to many false positives
        const isFullPassword = i === 0 && j === passwordLength - 1
        if (useLevenshteinDistance && isFullPassword) {
          break
        }
        const word = ranges.getWord(depth + 1)
        const userInputsRank = ranges.getUserInputsRank(depth + 1)
        if (word !== -1 || userInputsRank !== undefined) {
          addMatches(
            i,
            j,
            this.getHits(word, userInputsRank, userInputsPosition),
          )
        }
      }
      // the full password is checked for every dictionary, even if no word starts with it
      if (i === 0 && useLevenshteinDistance) {
        addMatches(
          0,
          passwordLength - 1,
          this.getLevenshteinHits(passwordLower, userInputsWordIndex),
        )
      }
    }
    return matches
  }

  // The hits of wordIndex.words[word], or -1 for none, in dictionary order.
  // A rank of the user inputs replaces the one of the dictionary userInputs,
  // or comes last without it.
  // eslint-disable-next-line max-statements
  protected getHits(
    word: number,
    userInputsRank: number | undefined,
    userInputsDictionary: number,
  ) {
    const { wordIndex } = this.options
    const { dictionaryNames, hitStart, hitDictionary, hitRank } = wordIndex
    const hits: DictionaryHit[] = []
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
  protected getLevenshteinHits(
    usedPassword: string,
    userInputsWordIndex: WordIndex | undefined,
  ) {
    const { wordIndex, dictionaryMaxWordSizes, levenshteinThreshold } =
      this.options
    const { dictionaryNames } = wordIndex
    const passwordLength = countCharacters(usedPassword)
    const hits: DictionaryHit[] = []
    const addHit = (
      dictionaryName: string,
      dictionary: LevenshteinDictionary,
      maxWordSize: number,
    ) => {
      const rank = dictionary.getRank(usedPassword)
      // a more common entry close to the full password beats the password
      // itself, even if the dictionary contains it. A password longer than
      // the dictionary's longest word by more than the threshold is at least
      // that many edits away from every entry.
      const found =
        passwordLength - maxWordSize > levenshteinThreshold
          ? undefined
          : findLevenshteinEntry(
              usedPassword,
              dictionary,
              levenshteinThreshold,
              rank,
            )
      // finding the password itself is an exact match, not a levenshtein one
      if (found && found.entry !== usedPassword) {
        hits.push({
          dictionaryName: dictionaryName as DictionaryNames,
          rank: found.rank,
          levenshteinDistance: found.distance,
          levenshteinDistanceEntry: found.entry,
        })
      } else if (rank !== undefined) {
        hits.push({ dictionaryName: dictionaryName as DictionaryNames, rank })
      }
    }
    const userInputsDictionary = getUserInputsPosition(wordIndex)
    for (
      let dictionary = 0;
      dictionary <= dictionaryNames.length;
      dictionary += 1
    ) {
      if (dictionary === userInputsDictionary && userInputsWordIndex) {
        addHit(
          USER_INPUTS,
          getUserInputsLevenshteinDictionary(wordIndex, userInputsWordIndex),
          Math.max(
            getUserInputsMaxWordSize(userInputsWordIndex),
            dictionaryMaxWordSizes[USER_INPUTS] || 0,
          ),
        )
      } else if (dictionary < dictionaryNames.length) {
        const name = dictionaryNames[dictionary]
        addHit(
          name,
          wordIndex.getLevenshteinDictionary(dictionary),
          dictionaryMaxWordSizes[name],
        )
      }
    }
    return hits
  }
}

export default MatchDictionary
