import { DictionaryNames, MatchOptions } from '../../types'
import { FindLevenshteinDistanceResult } from '../../utils/levenshtein'

export type DictionaryHit = {
  dictionaryName: DictionaryNames
  rank: number
} & Partial<FindLevenshteinDistanceResult>

export type DictionaryMatchOptions = Pick<
  MatchOptions,
  'password' | 'userInputsOptions'
>
