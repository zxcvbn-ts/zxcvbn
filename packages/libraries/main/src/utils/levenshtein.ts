import { distance } from 'fastest-levenshtein'

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
  levenshteinDistanceRank: number
}

const findLevenshteinDistance = (
  password: string,
  words: (string | number)[],
  threshold: number,
): Partial<FindLevenshteinDistanceResult> => {
  let foundDistance = 0
  let foundRank = 0
  // Options.buildTrie collapses a word listed more than once to the rank of
  // its LAST occurrence - match that here so a fuzzy match doesn't disagree
  // with the exact-match trie's rank for the same word.
  const rankByEntry = new Map<string, number>()
  words.forEach((wordOrNumber, index) => {
    rankByEntry.set(wordOrNumber.toString(), index + 1)
  })
  const found = words.find((wordOrNumber) => {
    const entry = wordOrNumber.toString()
    const usedThreshold = getUsedThreshold(password, entry, threshold)
    if (Math.abs(password.length - entry.length) > usedThreshold) {
      return false
    }
    const foundEntryDistance = distance(password, entry)
    const isInThreshold = foundEntryDistance <= usedThreshold

    if (isInThreshold) {
      foundDistance = foundEntryDistance
      foundRank = rankByEntry.get(entry)!
    }
    return isInThreshold
  })
  if (found !== undefined) {
    return {
      levenshteinDistance: foundDistance,
      levenshteinDistanceEntry: found.toString(),
      levenshteinDistanceRank: foundRank,
    }
  }
  return {}
}

export default findLevenshteinDistance
