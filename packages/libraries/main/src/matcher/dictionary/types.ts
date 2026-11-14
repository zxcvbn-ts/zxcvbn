import { DictionaryNames, MatchOptions } from '../../types.ts'
import { FindLevenshteinDistanceResult } from '../../utils/levenshtein.ts'

export type DictionaryHit = {
  dictionaryName: DictionaryNames
  rank: number
} & Partial<FindLevenshteinDistanceResult>

export type DictionaryMatchOptions = Pick<
  MatchOptions,
  'password' | 'userInputsOptions'
>
