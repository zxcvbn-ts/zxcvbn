import findLevenshteinDistance from '../../utils/levenshtein'
import {
  DictionaryNames,
  DictionaryMatch,
  MatcherBaseClass,
  RankedDictionary,
} from '../../types'
import { DictionaryHit, DictionaryMatchOptions } from './types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'
import { countCharacters, toLowerCase } from '../../utils/helper'

type Dictionaries = ReturnType<typeof mergeUserInputDictionary> & {
  dictionaryNames: DictionaryNames[]
}

class MatchDictionary extends MatcherBaseClass {
  // eslint-disable-next-line complexity,max-statements
  public match({
    password,
    userInputsOptions,
    useLevenshtein = true,
    minWindowEnds,
    lookupCache,
  }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = toLowerCase(password)
    const { rankedDictionaries, rankedDictionariesMaxWordSize } =
      mergeUserInputDictionary(
        this.options.rankedDictionaries,
        this.options.rankedDictionariesMaxWordSize,
        userInputsOptions,
      )
    const dictionaries: Dictionaries = {
      rankedDictionaries,
      rankedDictionariesMaxWordSize,
      dictionaryNames: Object.keys(rankedDictionaries) as DictionaryNames[],
    }

    const maxSearchWidth = Math.max(
      0,
      ...Object.values(rankedDictionariesMaxWordSize),
    )
    const isLevenshteinEnabled =
      this.options.useLevenshteinDistance && useLevenshtein

    for (let i = 0; i < passwordLength; i += 1) {
      for (let j = i; j < passwordLength; j += 1) {
        const isFullPassword = i === 0 && j === passwordLength - 1
        // only use levenshtein distance on full password to minimize the performance drop
        // and because otherwise there would be to many false positives
        const shouldCheckLevenshtein = isLevenshteinEnabled && isFullPassword
        // if the word is longer than the longest word in any dictionary we can skip it,
        // unless it is the full password and we still need to check for levenshtein distance.
        // In that case keep going from i === 0 until j reaches it instead of stopping here
        if (j - i + 1 > maxSearchWidth && !shouldCheckLevenshtein) {
          if (i === 0 && isLevenshteinEnabled) {
            continue
          }
          break
        }
        if (minWindowEnds && j < minWindowEnds[i]) {
          continue
        }
        const usedPassword = passwordLower.slice(i, j + 1)

        // a levenshtein result is only valid for the full password, don't share it
        let hits = shouldCheckLevenshtein
          ? undefined
          : lookupCache?.get(usedPassword)
        if (!hits) {
          hits = this.findInDictionaries(
            usedPassword,
            shouldCheckLevenshtein,
            dictionaries,
          )
          if (!shouldCheckLevenshtein) {
            lookupCache?.set(usedPassword, hits)
          }
        }

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
    }
    return matches
  }

  private findInDictionaries(
    usedPassword: string,
    shouldCheckLevenshtein: boolean,
    {
      rankedDictionaries,
      rankedDictionariesMaxWordSize,
      dictionaryNames,
    }: Dictionaries,
  ) {
    const hits: DictionaryHit[] = []
    for (const dictionaryName of dictionaryNames) {
      const rankedDict = rankedDictionaries[dictionaryName]
      const maxWordSize = rankedDictionariesMaxWordSize[dictionaryName]
      if (usedPassword.length > maxWordSize && !shouldCheckLevenshtein) {
        continue
      }

      const rank = rankedDict[usedPassword]
      // a more common entry close to the full password beats the password
      // itself, even if the dictionary contains it
      const levenshteinHit = shouldCheckLevenshtein
        ? this.findLevenshteinHit(usedPassword, rankedDict, maxWordSize)
        : undefined
      if (levenshteinHit) {
        hits.push({ dictionaryName, ...levenshteinHit })
      } else if (rank !== undefined) {
        hits.push({ dictionaryName, rank })
      }
    }
    return hits
  }

  private findLevenshteinHit(
    usedPassword: string,
    rankedDict: RankedDictionary,
    maxWordSize: number,
  ) {
    const { levenshteinThreshold } = this.options
    // a password longer than the dictionary's longest word by more than
    // the threshold is at least that many edits away from every entry
    if (countCharacters(usedPassword) - maxWordSize > levenshteinThreshold) {
      return undefined
    }
    const { levenshteinDistance, levenshteinDistanceEntry } =
      findLevenshteinDistance(usedPassword, rankedDict, levenshteinThreshold)
    // finding the password itself is an exact match, not a levenshtein one
    if (
      levenshteinDistance === undefined ||
      levenshteinDistanceEntry === undefined ||
      levenshteinDistanceEntry === usedPassword
    ) {
      return undefined
    }
    return {
      rank: rankedDict[levenshteinDistanceEntry],
      levenshteinDistance,
      levenshteinDistanceEntry,
    }
  }
}

export default MatchDictionary
