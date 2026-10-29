import { distance } from 'fastest-levenshtein'
import { RankedDictionary } from '../types'

const getUsedThreshold = (
  password: string,
  entryLength: number,
  threshold: number,
) => {
  const isPasswordToShort = password.length <= entryLength
  const isThresholdLongerThanPassword = password.length <= threshold
  const shouldUsePasswordLength =
    isPasswordToShort || isThresholdLongerThanPassword

  // if password is too small use the password length divided by 4 while the threshold needs to be at least 1
  return shouldUsePasswordLength ? Math.ceil(password.length / 4) : threshold
}

interface EntriesOfLength {
  entries: string[]
  // index of each entry in Object.keys(rankedDictionary), the order they are checked in
  positions: number[]
}

// An entry can only be within the threshold if its length is close to the
// password's, so group the entries by length and only check those groups.
// Building this means listing every key, which is expensive in V8 (Chrome,
// Node) for large dictionaries. Dictionaries never change after they are
// built, so do it once per object.
const entriesByLengthCache = new WeakMap<
  RankedDictionary,
  Map<number, EntriesOfLength>
>()

const getEntriesByLength = (rankedDictionary: RankedDictionary) => {
  const cached = entriesByLengthCache.get(rankedDictionary)
  if (cached) {
    return cached
  }
  const entriesByLength = new Map<number, EntriesOfLength>()
  Object.keys(rankedDictionary).forEach((entry, position) => {
    let group = entriesByLength.get(entry.length)
    if (!group) {
      group = { entries: [], positions: [] }
      entriesByLength.set(entry.length, group)
    }
    group.entries.push(entry)
    group.positions.push(position)
  })
  entriesByLengthCache.set(rankedDictionary, entriesByLength)
  return entriesByLength
}

interface FoundEntry {
  position: number
  entry: string
  distance: number
}

interface FindInGroupOptions {
  password: string
  group: EntriesOfLength
  usedThreshold: number
  found?: FoundEntry
}

// the first entry in dictionary order wins, so only an entry before the one
// already found in another group can replace it
const findInGroup = ({
  password,
  group: { entries, positions },
  usedThreshold,
  found,
}: FindInGroupOptions) => {
  const foundPosition = found ? found.position : Infinity
  for (
    let index = 0;
    index < entries.length && positions[index] < foundPosition;
    index += 1
  ) {
    const entryDistance = distance(password, entries[index])
    if (entryDistance <= usedThreshold) {
      return {
        position: positions[index],
        entry: entries[index],
        distance: entryDistance,
      }
    }
  }
  return found
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
  const entriesByLength = getEntriesByLength(rankedDictionary)
  const maxUsedThreshold = Math.max(threshold, Math.ceil(password.length / 4))
  let found: FoundEntry | undefined

  for (
    let entryLength = Math.max(0, password.length - maxUsedThreshold);
    entryLength <= password.length + maxUsedThreshold;
    entryLength += 1
  ) {
    const group = entriesByLength.get(entryLength)
    const usedThreshold = getUsedThreshold(password, entryLength, threshold)
    if (group && Math.abs(password.length - entryLength) <= usedThreshold) {
      found = findInGroup({ password, group, usedThreshold, found })
    }
  }
  // an empty entry (eg. from an empty user input) doesn't count as found
  if (found?.entry) {
    return {
      levenshteinDistance: found.distance,
      levenshteinDistanceEntry: found.entry,
    }
  }
  return {}
}

export default findLevenshteinDistance
