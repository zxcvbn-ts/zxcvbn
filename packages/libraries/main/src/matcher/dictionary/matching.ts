import findLevenshteinDistance, {
  FindLevenshteinDistanceResult,
} from '../../levenshtein'
import { sorted } from '../../helper'
import { zxcvbnOptions } from '../../Options'
import { DictionaryNames, DictionaryMatch, L33tMatch } from '../../types'
import Reverse from './variants/matching/reverse'
import L33t from './variants/matching/l33t'
import { DictionaryMatchOptions } from './types'

class MatchDictionary {
  l33t: L33t

  reverse: Reverse

  constructor() {
    this.l33t = new L33t(this.defaultMatch)
    this.reverse = new Reverse(this.defaultMatch)
  }

  match({ password }: DictionaryMatchOptions) {
    const matches = [
      ...(this.defaultMatch({
        password,
      }) as DictionaryMatch[]),
      ...(this.reverse.match({ password }) as DictionaryMatch[]),
      ...(this.l33t.match({ password }) as L33tMatch[]),
    ]
    return sorted(matches)
  }

  defaultMatch({ password, useLevenshtein = true }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()

    // eslint-disable-next-line complexity,max-statements
    Object.keys(zxcvbnOptions.rankedDictionaries).forEach((dictionaryName) => {
      const rankedDict =
        zxcvbnOptions.rankedDictionaries[dictionaryName as DictionaryNames]
      const longestDictionaryWordSize =
        zxcvbnOptions.rankedDictionariesMaxWordSize[dictionaryName]
      const searchWidth = Math.min(longestDictionaryWordSize, passwordLength)
      for (let i = 0; i < passwordLength; i += 1) {
        const searchEnd = Math.min(i + searchWidth, passwordLength)
        for (let j = i; j < searchEnd; j += 1) {
          const usedPassword = passwordLower.slice(i, +j + 1 || 9e9)
          const isInDictionary = usedPassword in rankedDict
          let foundLevenshteinDistance: Partial<FindLevenshteinDistanceResult> =
            {}
          // only use levenshtein distance on full password to minimize the performance drop
          // and because otherwise there would be to many false positives
          const isFullPassword = i === 0 && j === passwordLength - 1
          if (
            zxcvbnOptions.useLevenshteinDistance &&
            isFullPassword &&
            !isInDictionary &&
            useLevenshtein
          ) {
            foundLevenshteinDistance = findLevenshteinDistance(
              usedPassword,
              rankedDict,
              zxcvbnOptions.levenshteinThreshold,
            )
          }
          const isLevenshteinMatch =
            Object.keys(foundLevenshteinDistance).length !== 0

          if (isInDictionary || isLevenshteinMatch) {
            const usedRankPassword = isLevenshteinMatch
              ? (foundLevenshteinDistance.levenshteinDistanceEntry as string)
              : usedPassword

            const rank = rankedDict[usedRankPassword]
            matches.push({
              pattern: 'dictionary',
              i,
              j,
              token: password.slice(i, +j + 1 || 9e9),
              matchedWord: usedPassword,
              rank,
              dictionaryName: dictionaryName as DictionaryNames,
              reversed: false,
              l33t: false,
              ...foundLevenshteinDistance,
            })
          }
        }
      }
    })
    return matches
  }
}

export default MatchDictionary
