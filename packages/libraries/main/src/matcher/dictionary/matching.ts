import findLevenshteinDistance, {
  FindLevenshteinDistanceResult,
} from '../../utils/levenshtein'
import { sorted } from '../../utils/helper'
import Options from '../../Options'
import { DictionaryNames, DictionaryMatch, L33tMatch } from '../../types'
import Reverse from './variants/matching/reverse'
import L33t from './variants/matching/l33t'
import { DictionaryMatchOptions } from './types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'

class MatchDictionary {
  l33t: L33t

  reverse: Reverse

  constructor(private options: Options) {
    this.l33t = new L33t(options, this.defaultMatch)
    this.reverse = new Reverse(options, this.defaultMatch)
  }

  match(matchOptions: DictionaryMatchOptions) {
    const matches = [
      ...(this.defaultMatch(matchOptions) as DictionaryMatch[]),
      ...(this.reverse.match(matchOptions) as DictionaryMatch[]),
      ...(this.l33t.match(matchOptions) as L33tMatch[]),
    ]
    return sorted(matches)
  }

  defaultMatch({
    password,
    userInputsOptions,
    useLevenshtein = true,
  }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()

    const { rankedDictionaries, rankedDictionariesMaxWordSize } =
      mergeUserInputDictionary(
        this.options.rankedDictionaries,
        this.options.rankedDictionariesMaxWordSize,
        userInputsOptions,
      )
    // eslint-disable-next-line complexity,max-statements
    Object.keys(rankedDictionaries).forEach((dictionaryName) => {
      const rankedDict = rankedDictionaries[dictionaryName as DictionaryNames]
      const longestDictionaryWordSize =
        rankedDictionariesMaxWordSize[dictionaryName]
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
            this.options.useLevenshteinDistance &&
            isFullPassword &&
            !isInDictionary &&
            useLevenshtein
          ) {
            foundLevenshteinDistance = findLevenshteinDistance(
              usedPassword,
              rankedDict,
              this.options.levenshteinThreshold,
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
