import findLevenshteinDistance from '../../utils/levenshtein'
import {
  DictionaryNames,
  DictionaryMatch,
  UserInputsOptions,
  MatcherBaseClass,
} from '../../types'
import { DictionaryMatchOptions } from './types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'

class MatchDictionary extends MatcherBaseClass {
  private getRangedDictionaries(userInputsOptions?: UserInputsOptions) {
    if (
      userInputsOptions?.mergedDictionaries &&
      userInputsOptions?.mergedDictionaryMaxWordSize &&
      userInputsOptions?.mergedDictionaryMinWordSize
    ) {
      return {
        dictionaries: userInputsOptions.mergedDictionaries,
        dictionaryMaxWordSize: userInputsOptions.mergedDictionaryMaxWordSize,
        dictionaryMinWordSize: userInputsOptions.mergedDictionaryMinWordSize,
      }
    }
    return mergeUserInputDictionary(
      this.options.dictionary,
      this.options.dictionaryMaxWordSize,
      this.options.dictionaryMinWordSize,
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
    const { dictionaries, dictionaryMaxWordSize, dictionaryMinWordSize } =
      this.getRangedDictionaries(userInputsOptions)

    const fullPasswordExactMatches = new Set<string>()

    for (let i = 0; i < passwordLength; i += 1) {
      let staticNode = this.options.dictionaryTrie.root
      let userInputNode = userInputsOptions?.dictionaryTrie?.root
      for (let j = i; j < passwordLength; j += 1) {
        const char = passwordLower[j]
        staticNode = staticNode?.children?.get(char)
        userInputNode = userInputNode?.children?.get(char)

        if (!staticNode && !userInputNode) {
          break
        }

        const isFullPassword = i === 0 && j === passwordLength - 1
        const terminals = [
          ...(staticNode?.terminals || []),
          ...(userInputNode?.terminals || []),
        ]

        terminals.forEach(({ dictionaryName, rank }) => {
          if (isFullPassword) {
            fullPasswordExactMatches.add(dictionaryName)
          }
          matches.push({
            pattern: 'dictionary',
            i,
            j,
            token: password.slice(i, j + 1),
            matchedWord: passwordLower.slice(i, j + 1),
            rank,
            dictionaryName,
            reversed: false,
            l33t: false,
          })
        })
      }
    }

    if (
      this.options.useLevenshteinDistance &&
      useLevenshtein &&
      passwordLength > 0
    ) {
      const dictionaryNames = Object.keys(dictionaries) as DictionaryNames[]
      dictionaryNames.forEach((dictionaryName) => {
        if (!fullPasswordExactMatches.has(dictionaryName)) {
          const maxWordSize = dictionaryMaxWordSize[dictionaryName]
          const minWordSize = dictionaryMinWordSize[dictionaryName]
          const threshold = this.options.levenshteinThreshold
          const relativeThreshold = Math.ceil(passwordLength / 4)
          const thresholdForShortEntry =
            passwordLength <= threshold ? relativeThreshold : threshold

          if (
            passwordLength - maxWordSize > thresholdForShortEntry ||
            minWordSize - passwordLength > relativeThreshold
          ) {
            return
          }

          const dictionary = dictionaries[dictionaryName]
          const foundLevenshteinDistance = findLevenshteinDistance(
            passwordLower,
            dictionary,
            this.options.levenshteinThreshold,
          )
          if (foundLevenshteinDistance.levenshteinDistance !== undefined) {
            const {
              levenshteinDistanceRank,
              ...foundLevenshteinDistanceWithoutRank
            } = foundLevenshteinDistance
            matches.push({
              pattern: 'dictionary',
              i: 0,
              j: passwordLength - 1,
              token: password,
              matchedWord: passwordLower,
              rank: levenshteinDistanceRank!,
              dictionaryName,
              reversed: false,
              l33t: false,
              ...foundLevenshteinDistanceWithoutRank,
            })
          }
        }
      })
    }
    return matches
  }
}

export default MatchDictionary
