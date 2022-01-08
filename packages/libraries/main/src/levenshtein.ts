import { distance } from 'fastest-levenshtein'
import { LooseObject } from './types'

const findLevenshteinDistance = (
  password: string,
  rankedDictionary: LooseObject,
  threshold: number,
) => {
  let foundDistance = 0
  const found = Object.keys(rankedDictionary).find((entry) => {
    const isPasswordToShort = password.length <= entry.length
    const isThresholdLongerThanPassword = password.length <= threshold
    const shouldUsePasswordLength =
      isPasswordToShort || isThresholdLongerThanPassword
    const usedThreshold = shouldUsePasswordLength
      ? Math.ceil(password.length / 4)
      : threshold
    const foundEntryDistance = distance(password, entry)
    const isInThreshold = foundEntryDistance <= usedThreshold
    if (isInThreshold) {
      foundDistance = foundEntryDistance
    }
    return isInThreshold
  })
  if (found) {
    return {
      distance: foundDistance,
      foundEntry: found,
    }
  }
  return undefined
}

export default findLevenshteinDistance
