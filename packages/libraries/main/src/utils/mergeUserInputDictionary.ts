import { OptionsDictionary, UserInputsOptions } from '../types'

const mergeMinWordSize = (
  staticList: (string | number)[],
  staticMinWordSize: number,
  dynamicList: (string | number)[],
  dynamicMinWordSize: number,
) => {
  if (staticList.length === 0) {
    return dynamicMinWordSize
  }
  if (dynamicList.length === 0) {
    return staticMinWordSize
  }
  return Math.min(staticMinWordSize, dynamicMinWordSize)
}

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

  const staticUserInputs = optionsDictionaries.userInputs ?? []

  return {
    dictionaries: {
      ...optionsDictionaries,
      userInputs: [
        ...new Set([...staticUserInputs, ...userInputsOptions.dictionary]),
      ],
    },
    dictionaryMaxWordSize: {
      ...optionsDictionaryMaxWordSize,
      userInputs: Math.max(
        userInputsOptions.dictionaryMaxWordSize,
        optionsDictionaryMaxWordSize.userInputs ?? 0,
      ),
    },
    dictionaryMinWordSize: {
      ...optionsDictionaryMinWordSize,
      userInputs: mergeMinWordSize(
        staticUserInputs,
        optionsDictionaryMinWordSize.userInputs ?? 0,
        userInputsOptions.dictionary,
        userInputsOptions.dictionaryMinWordSize,
      ),
    },
  }
}
