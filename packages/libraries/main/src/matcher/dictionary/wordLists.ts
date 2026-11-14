import { UserInputsOptions } from '../../types'
import { toLowerCase } from '../../utils/helper'
import WordIndex from './WordIndex'

// the rank of each word, from 1. A duplicate word keeps its last rank.
export const buildRankedDictionary = (list: (string | number)[]) => {
  const result: Record<string, number> = {}
  list.forEach((word, index) => {
    result[word] = index + 1
  })
  return result
}

export const getMaxWordSize = (list: (string | number)[]) => {
  // do not use Math.max(...data) because it can result in max stack size error because every entry will be used as an argument
  return list.reduce<number>(
    (max, word) => Math.max(max, word.toString().length),
    0,
  )
}

const sanitizeUserInputs = (list: (string | number)[]) => {
  const sanitizedInputs: string[] = []

  list.forEach((input: string | number | boolean) => {
    const inputType = typeof input
    if (
      inputType === 'string' ||
      inputType === 'number' ||
      inputType === 'boolean'
    ) {
      sanitizedInputs.push(toLowerCase(input.toString()))
    }
  })

  return sanitizedInputs
}

export const createUserInputsOptions = (
  dictionary: (string | number)[] | undefined,
): Required<UserInputsOptions> => {
  const sanitizedInputs = dictionary ? sanitizeUserInputs(dictionary) : []
  // of the inputs as given, like it always was
  const maxWordSize = dictionary ? getMaxWordSize(dictionary) : 0
  let rankedDictionary: Record<string, number> | undefined
  return {
    wordIndex: new WordIndex([{ name: 'userInputs', words: sanitizedInputs }]),
    get rankedDictionary() {
      rankedDictionary ??= buildRankedDictionary(sanitizedInputs)
      return rankedDictionary
    },
    rankedDictionaryMaxWordSize: maxWordSize,
  }
}
