import { RankedDictionaries, UserInputsOptions } from '../types'

export default (
  optionsRankedDictionaries: RankedDictionaries,
  optionsRankedDictionariesMaxWordSize: Record<string, number>,
  userInputsOptions?: UserInputsOptions,
) => {
  const rankedDictionaries = {
    ...optionsRankedDictionaries,
  }
  const rankedDictionariesMaxWordSize = {
    ...optionsRankedDictionariesMaxWordSize,
  }
  if (!userInputsOptions) {
    return {
      rankedDictionaries,
      rankedDictionariesMaxWordSize,
    }
  }

  rankedDictionaries.userInputs = {
    ...(rankedDictionaries.userInputs || {}),
    ...userInputsOptions.rankedDictionary,
  }

  rankedDictionariesMaxWordSize.userInputs = Math.max(
    userInputsOptions.rankedDictionaryMaxWordSize,
    rankedDictionariesMaxWordSize.userInputs || 0,
  )

  return {
    rankedDictionaries,
    rankedDictionariesMaxWordSize,
  }
}
