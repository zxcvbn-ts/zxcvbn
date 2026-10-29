import { distance } from 'fastest-levenshtein'
import { RankedDictionary } from '../types'

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

// Object.keys() on a dictionary with tens of thousands of entries rebuilds the
// whole key array on every call, which is expensive in V8 (Chrome, Node).
// Dictionaries never change after they are built, so compute it once per object.
const dictionaryKeysCache = new WeakMap<RankedDictionary, string[]>()

const getDictionaryKeys = (rankedDictionary: RankedDictionary) => {
  let keys = dictionaryKeysCache.get(rankedDictionary)
  if (!keys) {
    keys = Object.keys(rankedDictionary)
    dictionaryKeysCache.set(rankedDictionary, keys)
  }
  return keys
}

export interface FindLevenshteinDistanceResult {
  levenshteinDistance: number
  levenshteinDistanceEntry: string
}

const findLevenshteinDistance = (
  password: string,
  rankedDictionary: RankedDictionary,
  threshold: number,
): Partial<FindLevenshteinDistanceResult> => {
  let foundDistance = 0
  const found = getDictionaryKeys(rankedDictionary).find((entry) => {
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
