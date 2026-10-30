import { LooseObject, MatchExtended } from '../types'

export const empty = (obj: LooseObject) => Object.keys(obj).length === 0

export const extend = (listToExtend: any[], list: any[]) => {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < list.length; i += 1) {
    listToExtend.push(list[i])
  }
}

export const translate = (string: string, chrMap: LooseObject) => {
  const keys = Object.keys(chrMap)
  if (keys.length === 0) {
    return string
  }
  const pattern = keys
    .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const regex = new RegExp(pattern, 'g')

  return string.replace(regex, (matched) => chrMap[matched])
}

const SURROGATE_PAIR = /[\ud800-\udbff][\udc00-\udfff]/g

// count characters by Unicode code point rather than UTF-16 code unit, so a
// surrogate pair (eg. an emoji) counts as one character instead of two.
// Same result as Array.from(string).length without building the array.
// Match indices [i, j] stay in UTF-16 code units, this is only for counting.
export const countCharacters = (string: string) =>
  string.length - (string.match(SURROGATE_PAIR)?.length ?? 0)

// lowercase without changing the length, so match indices [i, j] point at the
// same characters in the password and its lowercase form.
// 'İ' (U+0130) is the only character whose lowercase form is longer ('i' plus
// a combining dot), so map it to 'i' like the dictionaries spell it.
// Use this everywhere text is lowercased to be compared with dictionary words.
export const toLowerCase = (string: string) =>
  string.replace(/İ/g, 'i').toLowerCase()

// mod implementation that works for negative numbers
export const mod = (n: number, m: number) => ((n % m) + m) % m

// sort on i primary, j secondary
export const sorted = (matches: MatchExtended[]) =>
  matches.sort((m1, m2) => m1.i - m2.i || m1.j - m2.j)

export const buildRankedDictionary = (orderedList: any[]) => {
  const result: LooseObject = {}
  let counter = 1 // rank starts at 1, not 0
  orderedList.forEach((word) => {
    result[word] = counter
    counter += 1
  })
  return result
}
