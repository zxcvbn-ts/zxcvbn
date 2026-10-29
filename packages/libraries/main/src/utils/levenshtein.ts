import { distance } from 'fastest-levenshtein'
import { RankedDictionary } from '../types'
import { countCharacters } from './helper'

// fastest-levenshtein compares UTF-16 code units, which would count a
// character outside the BMP (eg. an emoji) as two edits. Such a character of
// the password is replaced with this one code unit instead, a noncharacter
// that doesn't match anything in an entry without it.
const PLACEHOLDER = '\uffff'

// for an entry with characters outside the BMP, or the placeholder
const codePointDistance = (first: string[], second: string[]) => {
  let previousRow = Array.from(
    { length: second.length + 1 },
    (_, index) => index,
  )
  first.forEach((firstCharacter, firstIndex) => {
    const row = [firstIndex + 1]
    second.forEach((secondCharacter, secondIndex) => {
      row.push(
        Math.min(
          previousRow[secondIndex + 1] + 1,
          row[secondIndex] + 1,
          previousRow[secondIndex] +
            (firstCharacter === secondCharacter ? 0 : 1),
        ),
      )
    })
    previousRow = row
  })
  return previousRow[second.length]
}

// the distance between the password and an entry of entryLength characters
const createGetDistance = (password: string) => {
  const passwordCharacters = Array.from(password)
  const hasSurrogatePairs = password.length !== passwordCharacters.length
  const passwordCodeUnits = hasSurrogatePairs
    ? passwordCharacters
        .map((character) => (character.length > 1 ? PLACEHOLDER : character))
        .join('')
    : password
  return (entry: string, entryLength: number) =>
    entry.length === entryLength &&
    !(hasSurrogatePairs && entry.includes(PLACEHOLDER))
      ? distance(passwordCodeUnits, entry)
      : codePointDistance(passwordCharacters, Array.from(entry))
}

interface EntriesOfLength {
  // sorted by rank, the order they are checked in
  entries: string[]
  ranks: number[]
}

// An entry can only be within the threshold if its length is close to the
// password's, so group the entries by length (in characters, an emoji counts
// as one) and only check those groups.
// Building this means listing every key, which is expensive in V8 (Chrome,
// Node) for large dictionaries. Dictionaries never change after they are
// built, so do it once per object.
const entriesByLengthCache = new WeakMap<
  RankedDictionary,
  Map<number, EntriesOfLength>
>()

// Object.keys lists integer-like keys (eg. '123456') before all others, so the
// entries of a group aren't always in rank order
const sortByRank = (group: EntriesOfLength) => {
  const { entries, ranks } = group
  if (ranks.every((rank, index) => index === 0 || ranks[index - 1] <= rank)) {
    return
  }
  const order = ranks
    .map((_, index) => index)
    .sort((first, second) => ranks[first] - ranks[second])
  group.entries = order.map((index) => entries[index])
  group.ranks = order.map((index) => ranks[index])
}

const getEntriesByLength = (rankedDictionary: RankedDictionary) => {
  const cached = entriesByLengthCache.get(rankedDictionary)
  if (cached) {
    return cached
  }
  const entriesByLength = new Map<number, EntriesOfLength>()
  Object.keys(rankedDictionary).forEach((entry) => {
    // an empty entry (eg. from an empty user input) is never a match
    if (entry === '') {
      return
    }
    const length = countCharacters(entry)
    let group = entriesByLength.get(length)
    if (!group) {
      group = { entries: [], ranks: [] }
      entriesByLength.set(length, group)
    }
    group.entries.push(entry)
    group.ranks.push(rankedDictionary[entry])
  })
  entriesByLength.forEach(sortByRank)
  entriesByLengthCache.set(rankedDictionary, entriesByLength)
  return entriesByLength
}

interface FoundEntry {
  rank: number
  entry: string
  distance: number
}

interface FindInGroupOptions {
  group: EntriesOfLength
  entryLength: number
  threshold: number
  getDistance: (entry: string, entryLength: number) => number
  found?: FoundEntry
}

// the most common entry wins, so only an entry ranked before the one already
// found can replace it
const findInGroup = ({
  group: { entries, ranks },
  entryLength,
  threshold,
  getDistance,
  found,
}: FindInGroupOptions) => {
  const foundRank = found ? found.rank : Infinity
  for (
    let index = 0;
    index < entries.length && ranks[index] < foundRank;
    index += 1
  ) {
    const entryDistance = getDistance(entries[index], entryLength)
    if (entryDistance <= threshold) {
      return {
        rank: ranks[index],
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
  const passwordLength = countCharacters(password)
  const getDistance = createGetDistance(password)
  // the password itself is the match, unless a more common entry is close to it
  let found: FoundEntry | undefined = Object.prototype.hasOwnProperty.call(
    rankedDictionary,
    password,
  )
    ? { rank: rankedDictionary[password], entry: password, distance: 0 }
    : undefined

  const lengthDifference = (entryLength: number) =>
    Math.abs(entryLength - passwordLength)
  // An entry is at least as many edits away as the lengths differ, so only
  // check the lengths within the threshold. Closest first, where a typo most
  // likely is, so a common entry found early lets the others skip more.
  Array.from(entriesByLength.keys())
    .filter((entryLength) => lengthDifference(entryLength) <= threshold)
    .sort((first, second) => lengthDifference(first) - lengthDifference(second))
    .forEach((entryLength) => {
      found = findInGroup({
        group: entriesByLength.get(entryLength)!,
        entryLength,
        threshold,
        getDistance,
        found,
      })
    })
  if (found) {
    return {
      levenshteinDistance: found.distance,
      levenshteinDistanceEntry: found.entry,
    }
  }
  return {}
}

export default findLevenshteinDistance
