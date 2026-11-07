import { DictionaryMatch, DictionaryNames, MatchOptions } from '../../types'
import { FindLevenshteinDistanceResult } from '../../utils/levenshtein'

export type DictionaryHit = {
  dictionaryName: DictionaryNames
  rank: number
} & Partial<FindLevenshteinDistanceResult>

export interface DictionaryMatchOptionsLevenshtein extends MatchOptions {
  useLevenshtein?: boolean
  // per start index i, the smallest j worth checking; windows [i, j] that end
  // before it are skipped
  minWindowEnds?: number[]
  // dictionary hits per lowercased word, to share between calls that use the
  // same dictionaries and userInputsOptions
  lookupCache?: Map<string, DictionaryHit[]>
}

export type DictionaryMatchOptions = Pick<
  DictionaryMatchOptionsLevenshtein,
  | 'password'
  | 'userInputsOptions'
  | 'useLevenshtein'
  | 'minWindowEnds'
  | 'lookupCache'
>

export type DefaultMatch = (
  options: DictionaryMatchOptions,
) => DictionaryMatch[]
