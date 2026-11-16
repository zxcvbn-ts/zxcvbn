import { distance } from 'fastest-levenshtein'
import { countCharacters, isHighSurrogate } from './helper'

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

// A bit for each character (code point) a string contains, several characters
// share a bit. Each character only one of two strings contains takes an edit,
// so comparing their masks rules out most entries without the distance.
// 30 bits keep the values small integers, with 32 V8 runs the bit operations
// slower than the distance itself.
const getCharacterMask = (string: string) => {
  let mask = 0
  for (let index = 0; index < string.length; index += 1) {
    const code = string.charCodeAt(index)
    // skip the high surrogate, so an emoji only sets the bit of its low one
    if (!isHighSurrogate(code)) {
      mask |= 1 << (code % 30)
    }
  }
  return mask
}

// more than limit bits of value are set
const hasMoreBits = (value: number, limit: number) => {
  let rest = value
  for (let count = 0; count < limit; count += 1) {
    // clear the lowest set bit
    rest &= rest - 1
  }
  return rest !== 0
}

interface EntriesOfLength {
  // sorted by rank, the order they are checked in
  entries: string[]
  ranks: number[]
  // the character mask of each entry
  masks: Int32Array
}

// A dictionary for findLevenshteinEntry
export interface LevenshteinDictionary {
  // every entry once with its rank, in any order
  getEntries: () => { entries: string[]; ranks: number[] }
  getRank: (entry: string) => number | undefined
}

// An entry can only be within the threshold if its length is close to the
// password's, so group the entries by length (in characters, an emoji counts
// as one) and only check those groups.
// Building this means listing every entry, which is expensive for large
// dictionaries. Dictionaries never change after they are built, so do it once
// per object.
const entriesByLengthCache = new WeakMap<
  LevenshteinDictionary,
  Map<number, EntriesOfLength>
>()

// a dictionary lists its entries in any order, so the entries of a group
// aren't always in rank order
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

const getEntriesByLength = (dictionary: LevenshteinDictionary) => {
  const cached = entriesByLengthCache.get(dictionary)
  if (cached) {
    return cached
  }
  const entriesByLength = new Map<number, EntriesOfLength>()
  const { entries, ranks } = dictionary.getEntries()
  entries.forEach((entry, index) => {
    // an empty entry (eg. from an empty user input) is never a match
    if (entry === '') {
      return
    }
    const length = countCharacters(entry)
    let group = entriesByLength.get(length)
    if (!group) {
      group = { entries: [], ranks: [], masks: new Int32Array(0) }
      entriesByLength.set(length, group)
    }
    group.entries.push(entry)
    group.ranks.push(ranks[index])
  })
  entriesByLength.forEach((group) => {
    sortByRank(group)
    group.masks = Int32Array.from(group.entries, getCharacterMask)
  })
  entriesByLengthCache.set(dictionary, entriesByLength)
  return entriesByLength
}

export interface FoundEntry {
  rank: number
  entry: string
  distance: number
}

interface FindInGroupOptions {
  group: EntriesOfLength
  entryLength: number
  threshold: number
  getDistance: (entry: string, entryLength: number) => number
  passwordMask: number
  found?: FoundEntry
}

// the most common entry wins, so only an entry ranked before the one already
// found can replace it
const findInGroup = ({
  group: { entries, ranks, masks },
  entryLength,
  threshold,
  getDistance,
  passwordMask,
  found,
}: FindInGroupOptions) => {
  // a larger threshold than the bits of a mask can't rule out an entry
  const maxDifferentCharacters = Math.min(Math.floor(threshold), 30)
  const foundRank = found ? found.rank : Infinity
  for (
    let index = 0;
    index < entries.length && ranks[index] < foundRank;
    index += 1
  ) {
    const mask = masks[index]
    if (
      hasMoreBits(mask & ~passwordMask, maxDifferentCharacters) ||
      hasMoreBits(passwordMask & ~mask, maxDifferentCharacters)
    ) {
      continue
    }
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

// The most common entry within the threshold, the password itself (with
// passwordRank, its rank in the dictionary) unless a more common entry is
// close to it
export const findLevenshteinEntry = (
  password: string,
  dictionary: LevenshteinDictionary,
  threshold: number,
  passwordRank: number | undefined,
  // eslint-disable-next-line max-params
): FoundEntry | undefined => {
  const entriesByLength = getEntriesByLength(dictionary)
  const passwordLength = countCharacters(password)
  const getDistance = createGetDistance(password)
  const passwordMask = getCharacterMask(password)
  let found: FoundEntry | undefined =
    passwordRank === undefined
      ? undefined
      : { rank: passwordRank, entry: password, distance: 0 }

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
        passwordMask,
        found,
      })
    })
  return found
}

// a findLevenshteinEntry of findLevenshteinEntries
interface Search {
  length: number
  mask: number
  getDistance: (entry: string, entryLength: number) => number
  found?: FoundEntry
  // where the group of found is in the order findLevenshteinEntry checks the
  // groups in, -1 for the password itself
  foundOrder: number
}

interface FindInGroupForEachOptions {
  group: EntriesOfLength
  entryLength: number
  // the position of the group in entriesByLength, and the number of groups
  groupIndex: number
  groupCount: number
  searches: Search[]
  threshold: number
}

// the rank an entry has to be before to be found by a search: that of the
// least common entry found, Infinity while a search has found nothing
const getStopRank = (searches: Search[]) =>
  searches.reduce(
    (stopRank, { found }) => Math.max(stopRank, found ? found.rank : Infinity),
    -Infinity,
  )

// the characters of at least one password, and those of every password
const getSharedMasks = (searches: Search[]) =>
  searches.reduce(
    ({ anyMask, everyMask }, { mask }) => ({
      anyMask: anyMask | mask,
      everyMask: everyMask & mask,
    }),
    { anyMask: 0, everyMask: -1 },
  )

interface FindEntryForEachOptions {
  searches: Search[]
  entry: string
  entryLength: number
  rank: number
  mask: number
  threshold: number
  maxDifferentCharacters: number
  // where the group of the entry is in the order findLevenshteinEntry checks
  // the groups in for the search
  getOrder: (search: Search) => number
}

// The most common entry wins, and of two with the same rank the one
// findLevenshteinEntry finds first, in the group it checks first.
const beatsFound = (search: Search, rank: number, order: number) =>
  !search.found ||
  rank < search.found.rank ||
  (rank === search.found.rank && order < search.foundOrder)

// checks the entry for each search, true if one of them found it
const findEntryForEach = ({
  searches,
  entry,
  entryLength,
  rank,
  mask,
  threshold,
  maxDifferentCharacters,
  getOrder,
}: FindEntryForEachOptions) => {
  let foundAny = false
  for (const search of searches) {
    const order = getOrder(search)
    if (
      beatsFound(search, rank, order) &&
      !hasMoreBits(mask & ~search.mask, maxDifferentCharacters) &&
      !hasMoreBits(search.mask & ~mask, maxDifferentCharacters)
    ) {
      const entryDistance = search.getDistance(entry, entryLength)
      if (entryDistance <= threshold) {
        search.found = { rank, entry, distance: entryDistance }
        search.foundOrder = order
        foundAny = true
      }
    }
  }
  return foundAny
}

// findInGroup for several passwords at once. An entry with more characters
// than allowed that no password has, or without more than allowed that every
// password has, is too far from all of them, so most entries are ruled out
// once instead of once per password.
const findInGroupForEach = ({
  group: { entries, ranks, masks },
  entryLength,
  groupIndex,
  groupCount,
  searches,
  threshold,
}: FindInGroupForEachOptions) => {
  // a larger threshold than the bits of a mask can't rule out an entry
  const maxDifferentCharacters = Math.min(Math.floor(threshold), 30)
  const { anyMask, everyMask } = getSharedMasks(searches)
  // findLevenshteinEntry checks the groups closest length first, in
  // entriesByLength order for the same difference
  const getOrder = ({ length }: Search) =>
    Math.abs(entryLength - length) * groupCount + groupIndex
  let stopRank = getStopRank(searches)
  for (
    let index = 0;
    index < entries.length && ranks[index] <= stopRank;
    index += 1
  ) {
    const mask = masks[index]
    if (
      hasMoreBits(mask & ~anyMask, maxDifferentCharacters) ||
      hasMoreBits(everyMask & ~mask, maxDifferentCharacters)
    ) {
      continue
    }
    const foundAny = findEntryForEach({
      searches,
      entry: entries[index],
      entryLength,
      rank: ranks[index],
      mask,
      threshold,
      maxDifferentCharacters,
      getOrder,
    })
    // only this loop reads it, so once per entry is enough
    if (foundAny) {
      stopRank = getStopRank(searches)
    }
  }
}

// findLevenshteinEntry of each password, searched together: much faster for
// many similar passwords, like the l33t variants of one password
export const findLevenshteinEntries = (
  passwords: string[],
  dictionary: LevenshteinDictionary,
  threshold: number,
  passwordRanks: (number | undefined)[],
  // eslint-disable-next-line max-params
): (FoundEntry | undefined)[] => {
  // nothing to search, and indexing the dictionary would be wasted
  if (passwords.length === 0) {
    return []
  }
  const entriesByLength = getEntriesByLength(dictionary)
  const searches: Search[] = passwords.map((password, index) => {
    const passwordRank = passwordRanks[index]
    return {
      length: countCharacters(password),
      mask: getCharacterMask(password),
      getDistance: createGetDistance(password),
      found:
        passwordRank === undefined
          ? undefined
          : { rank: passwordRank, entry: password, distance: 0 },
      foundOrder: -1,
    }
  })
  // an entry is at least as many edits away as the lengths differ
  const lengthDifference = (entryLength: number) =>
    Math.min(...searches.map(({ length }) => Math.abs(entryLength - length)))
  const groupCount = entriesByLength.size
  // Closest lengths first, like findLevenshteinEntry, so a common entry
  // found early lets the other groups stop sooner. Ties still go by the
  // position in entriesByLength.
  Array.from(entriesByLength.entries(), ([entryLength, group], groupIndex) => ({
    entryLength,
    group,
    groupIndex,
    difference: lengthDifference(entryLength),
  }))
    .filter(({ difference }) => difference <= threshold)
    .sort((first, second) => first.difference - second.difference)
    .forEach(({ entryLength, group, groupIndex }) => {
      findInGroupForEach({
        group,
        entryLength,
        groupIndex,
        groupCount,
        searches: searches.filter(
          ({ length }) => Math.abs(entryLength - length) <= threshold,
        ),
        threshold,
      })
    })
  return searches.map(({ found }) => found)
}
