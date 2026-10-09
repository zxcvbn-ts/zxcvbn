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

// mod implementation that works for negative numbers
export const mod = (n: number, m: number) => ((n % m) + m) % m

// sort on i primary, j secondary
export const sorted = (matches: MatchExtended[]) =>
  matches.sort((m1, m2) => m1.i - m2.i || m1.j - m2.j)
