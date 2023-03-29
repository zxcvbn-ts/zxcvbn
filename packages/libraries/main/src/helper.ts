import { LooseObject, MatchExtended } from './types'

export const empty = (obj: LooseObject) => Object.keys(obj).length === 0

export const extend = (listToExtend: any[], list: any[]) =>
  // eslint-disable-next-line prefer-spread
  listToExtend.push.apply(listToExtend, list)

export const translate = (string: string, chrMap: LooseObject) => {
  let newString = string
  Object.entries(chrMap).forEach(([key, value]) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedKey, 'g')
    newString = newString.replace(regex, value)
  })

  return newString
}

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
