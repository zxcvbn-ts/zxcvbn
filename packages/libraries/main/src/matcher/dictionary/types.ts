import { DictionaryMatch, MatchOptions } from '../../types'

export interface DictionaryMatchOptionsLevenshtein extends MatchOptions {
  useLevenshtein?: boolean
}

export type DictionaryMatchOptions = Pick<
  DictionaryMatchOptionsLevenshtein,
  'password' | 'userInputsOptions' | 'useLevenshtein'
>

export type DefaultMatch = (
  options: DictionaryMatchOptions,
) => DictionaryMatch[]
