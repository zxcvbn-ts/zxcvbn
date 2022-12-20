import { DictionaryMatch } from '../../types'

export interface DictionaryMatchOptions {
  password: string
}

export type DefaultMatch = (
  options: DictionaryMatchOptions,
) => DictionaryMatch[]
