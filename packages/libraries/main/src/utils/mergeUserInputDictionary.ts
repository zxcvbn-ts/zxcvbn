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

  if (rankedDictionaries.userInputs) {
    const isWordSizeBigger =
      rankedDictionariesMaxWordSize.userInputs <
      userInputsOptions.rankedDictionaryMaxWordSize

    rankedDictionaries.userInputs = {
      ...rankedDictionaries.userInputs,
      ...userInputsOptions.rankedDictionary,
    }

    rankedDictionariesMaxWordSize.userInputs = isWordSizeBigger
      ? userInputsOptions.rankedDictionaryMaxWordSize
      : rankedDictionariesMaxWordSize.userInputs
  } else {
    rankedDictionaries.userInputs = userInputsOptions.rankedDictionary
    rankedDictionariesMaxWordSize.userInputs =
      userInputsOptions.rankedDictionaryMaxWordSize
  }

  return {
    rankedDictionaries,
    rankedDictionariesMaxWordSize,
  }
}
