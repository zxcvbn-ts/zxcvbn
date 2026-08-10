import findLevenshteinDistance, {
  FindLevenshteinDistanceResult,
} from '../../utils/levenshtein.ts'
import Options from '../../Options.ts'
import {
  DictionaryNames,
  DictionaryMatch,
  UserInputsOptions,
  MatcherBaseClass,
  RankedDictionaries,
} from '../../types.ts'
import { DictionaryMatchOptions } from './types.ts'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary.ts'

class MatchDictionary extends MatcherBaseClass {
  constructor(
    options: Options,
    protected wordSequenceCheck?: boolean,
  ) {
    super(options)
  }

  private getRangedDictionaries(userInputsOptions?: UserInputsOptions) {
    if (this.wordSequenceCheck) {
      const rankedDictionaries: RankedDictionaries = {}
      const rankedDictionariesMaxWordSize: Record<string, number> = {}
      Object.keys(this.options.rankedDictionaries).forEach((key) => {
        if (this.options.isWordSequence(key)) {
          rankedDictionaries[key] = this.options.rankedDictionaries[key]
          rankedDictionariesMaxWordSize[key] =
            this.options.rankedDictionariesMaxWordSize[key]
        }
      })
      return {
        rankedDictionaries,
        rankedDictionariesMaxWordSize,
      }
    }
    return mergeUserInputDictionary(
      this.options.rankedDictionaries,
      this.options.rankedDictionariesMaxWordSize,
      userInputsOptions,
    )
  }

  // eslint-disable-next-line complexity,max-statements
  public match({
    password,
    userInputsOptions,
    useLevenshtein = true,
  }: DictionaryMatchOptions) {
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()
    const { rankedDictionaries, rankedDictionariesMaxWordSize } =
      this.getRangedDictionaries(userInputsOptions)

    const dictionaryNames = Object.keys(rankedDictionaries) as DictionaryNames[]
    const maxSearchWidth = Math.max(
      0,
      ...Object.values(rankedDictionariesMaxWordSize),
    )

    for (let i = 0; i < passwordLength; i += 1) {
      for (let j = i; j < passwordLength; j += 1) {
        const isFullPassword = i === 0 && j === passwordLength - 1
        // if the word is longer than the longest word in any dictionary and it is not the full password
        // we can skip it. For the full password we still need to check for levenshtein distance
        if (j - i + 1 > maxSearchWidth && !isFullPassword) {
          break
        }
        const usedPassword = passwordLower.slice(i, j + 1)

        for (const dictionaryName of dictionaryNames) {
          const rankedDict = rankedDictionaries[dictionaryName]
          if (
            j - i + 1 > rankedDictionariesMaxWordSize[dictionaryName] &&
            !isFullPassword
          ) {
            continue
          }

          const rank = rankedDict[usedPassword]
          const isInDictionary = rank !== undefined
          let foundLevenshteinDistance: Partial<FindLevenshteinDistanceResult> =
            {}
          // only use levenshtein distance on full password to minimize the performance drop
          // and because otherwise there would be to many false positives
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
            foundLevenshteinDistance.levenshteinDistance !== undefined

          if (isInDictionary || isLevenshteinMatch) {
            const usedRankPassword = isLevenshteinMatch
              ? foundLevenshteinDistance.levenshteinDistanceEntry!
              : usedPassword

            const rankValue = isInDictionary
              ? rank
              : rankedDict[usedRankPassword]
            matches.push({
              pattern: 'dictionary',
              i,
              j,
              token: password.slice(i, j + 1),
              matchedWord: usedPassword,
              rank: rankValue,
              dictionaryName,
              reversed: false,
              l33t: false,
              ...foundLevenshteinDistance,
            })
          }
        }
      }
    }
    return matches
  }
}

export default MatchDictionary
