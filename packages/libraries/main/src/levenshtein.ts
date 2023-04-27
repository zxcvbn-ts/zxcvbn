import { distance } from 'fastest-levenshtein'
import { LooseObject } from './types'

const getUsedThreshold = (
  password: string,
  entry: string,
  threshold: number,
) => {
  const isPasswordToShort = password.length <= entry.length
  const isThresholdLongerThanPassword = password.length <= threshold
  const shouldUsePasswordLength =
    isPasswordToShort || isThresholdLongerThanPassword

  // if password is too small use the password length divided by 4 while the threshold needs to be at least 1
  return shouldUsePasswordLength ? Math.ceil(password.length / 4) : threshold
}

export interface FindLevenshteinDistanceResult {
  levenshteinDistance: number
  levenshteinDistanceEntry: string
}

const findLevenshteinDistance = (
  password: string,
  rankedDictionary: LooseObject,
  threshold: number,
): Partial<FindLevenshteinDistanceResult> => {
  let foundDistance = 0
  const found = Object.keys(rankedDictionary).find((entry) => {
    const usedThreshold = getUsedThreshold(password, entry, threshold)
    if (Math.abs(password.length - entry.length) > usedThreshold) {
      return false
    }
    const foundEntryDistance = distance(password, entry)
    const isInThreshold = foundEntryDistance <= usedThreshold

    if (isInThreshold) {
      foundDistance = foundEntryDistance
    }
    return isInThreshold
  })
  if (found) {
    return {
      levenshteinDistance: foundDistance,
      levenshteinDistanceEntry: found,
    }
  }
  return {}
}

export default findLevenshteinDistance
