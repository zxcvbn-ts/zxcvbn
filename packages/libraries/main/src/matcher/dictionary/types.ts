import { DictionaryMatch } from '../../types'

export interface DictionaryMatchOptions {
  password: string
  useLevenshtein?: boolean
}

export type DefaultMatch = (
  options: DictionaryMatchOptions,
) => DictionaryMatch[]
