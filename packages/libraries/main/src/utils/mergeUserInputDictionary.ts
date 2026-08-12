import { OptionsDictionary, UserInputsOptions } from '../types'

export default (
  optionsDictionaries: OptionsDictionary,
  optionsDictionaryMaxWordSize: Record<string, number>,
  optionsDictionaryMinWordSize: Record<string, number>,
  userInputsOptions?: UserInputsOptions,
) => {
  if (!userInputsOptions) {
    return {
      dictionaries: optionsDictionaries,
      dictionaryMaxWordSize: optionsDictionaryMaxWordSize,
      dictionaryMinWordSize: optionsDictionaryMinWordSize,
    }
  }
  return {
    dictionaries: {
      ...optionsDictionaries,
      userInputs: userInputsOptions.dictionary,
    },
    dictionaryMaxWordSize: {
      ...optionsDictionaryMaxWordSize,
      userInputs: userInputsOptions.dictionaryMaxWordSize,
    },
    dictionaryMinWordSize: {
      ...optionsDictionaryMinWordSize,
      userInputs: userInputsOptions.dictionaryMinWordSize,
    },
  }
}
