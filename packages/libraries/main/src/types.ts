import translationKeys from './data/translationKeys'
import l33tTableDefault from './data/l33tTable'
import { REGEXEN } from './data/const'

export type TranslationKeys = typeof translationKeys
export type L33tTableDefault = typeof l33tTableDefault

export interface LooseObject {
  [key: string]: any
}

export type Pattern =
  | 'dictionary'
  | 'spatial'
  | 'repeat'
  | 'sequence'
  | 'regex'
  | 'date'
  | 'bruteforce'

export type DictionaryNames =
  | 'passwords'
  | 'commonWords'
  | 'firstnames'
  | 'lastnames'
  | 'wikipedia'
  | 'userInputs'

export interface Match {
  pattern: Pattern
  i: number
  j: number
  token: string
}

export interface DictionaryMatch extends Match {
  pattern: 'dictionary'
  matchedWord: string
  rank: number
  dictionaryName: DictionaryNames
  reversed: boolean
  l33t: boolean
}

export interface L33tMatch extends DictionaryMatch {
  sub: LooseObject
  subDisplay: string
}

export interface SpatialMatch extends Match {
  pattern: 'spatial'
  graph: string
  turns: number
  shiftedCount: number
}

export interface RepeatMatch extends Match {
  pattern: 'repeat'
  baseToken: string | string[]
  baseGuesses: number
  repeatCount: number
}

export interface SequenceMatch extends Match {
  pattern: 'sequence'
  sequenceName: string
  sequenceSpace: number
  ascending: boolean
}

export interface RegexMatch extends Match {
  pattern: 'regex'
  regexName: keyof typeof REGEXEN
  regexMatch: string[]
}

export interface DateMatch extends Match {
  pattern: 'date'
  separator: string
  year: number
  month: number
  day: number
}
export interface BruteForceMatch extends Match {
  pattern: 'bruteforce'
}

export type MatchExtended =
  | DictionaryMatch
  | L33tMatch
  | SpatialMatch
  | RepeatMatch
  | SequenceMatch
  | RegexMatch
  | DateMatch
  | BruteForceMatch

export interface Estimate {
  guesses: number
  guessesLog10: number
  baseGuesses?: number
  uppercaseVariations?: number
  l33tVariations?: number
}

export type MatchEstimated = MatchExtended & Estimate

export interface Optimal {
  m: Match
  pi: Match
  g: Match
}

export interface CrackTimesSeconds {
  onlineThrottling100PerHour: number
  onlineNoThrottling10PerSecond: number
  offlineSlowHashing1e4PerSecond: number
  offlineFastHashing1e10PerSecond: number
}

export interface CrackTimesDisplay {
  onlineThrottling100PerHour: string
  onlineNoThrottling10PerSecond: string
  offlineSlowHashing1e4PerSecond: string
  offlineFastHashing1e10PerSecond: string
}

export interface FeedbackType {
  warning: string
  suggestions: string[]
}

export type MatchingMatcherParams =
  | 'userInputs'
  | 'dictionary'
  | 'l33tTable'
  | 'graphs'

export type MatchingMatcherNames =
  | 'dictionary'
  | 'dictionaryReverse'
  | 'l33t'
  | 'spatial'
  | 'repeat'
  | 'sequence'
  | 'regex'
  | 'date'

export type OptionsL33tTable =
  | L33tTableDefault
  | {
      [key: string]: string[]
    }

export type OptionsDictionary = {
  [key: string]: string[] | number[]
}

export interface OptionsGraphEntry {
  [key: string]: (string | null)[]
}

export interface OptionsGraph {
  [key: string]: OptionsGraphEntry
}

export interface OptionsType {
  translations?: TranslationKeys
  graphs?: OptionsGraph
  l33tTable?: OptionsL33tTable
  dictionary?: OptionsDictionary
}

export interface RankedDictionaries {
  [key: string]: {
    [key: string]: number
  }
}
