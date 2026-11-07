import { DictionaryNames, MatchOptions } from '../../types'
import { FindLevenshteinDistanceResult } from '../../utils/levenshtein'

export type DictionaryHit = {
  dictionaryName: DictionaryNames
  rank: number
} & Partial<FindLevenshteinDistanceResult>

export interface DictionaryMatchOptionsLevenshtein extends MatchOptions {
  useLevenshtein?: boolean
}

export type DictionaryMatchOptions = Pick<
  DictionaryMatchOptionsLevenshtein,
  'password' | 'userInputsOptions' | 'useLevenshtein'
>
