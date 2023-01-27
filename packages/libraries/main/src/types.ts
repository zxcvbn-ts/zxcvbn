import translationKeys from './data/translationKeys'
import l33tTableDefault from './data/l33tTable'
import { REGEXEN } from './data/const'
import { DictionaryReturn } from './matcher/dictionary/scoring'
import Matching from './Matching'

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
  | string

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
  [key: string]: any
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
  | Match

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

export type OptionsL33tTable =
  | L33tTableDefault
  | {
      [key: string]: string[]
    }

export type OptionsDictionary = {
  [key: string]: (string | number)[]
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
  useLevenshteinDistance?: boolean
  levenshteinThreshold?: number
  l33tMaxSubstitutions?: number
}

export interface RankedDictionary {
  [key: string]: number
}

export interface RankedDictionaries {
  [key: string]: RankedDictionary
}

export type DefaultFeedbackFunction = (
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => FeedbackType | null

export type DefaultScoringFunction = (
  match: MatchExtended | MatchEstimated,
) => number | DictionaryReturn

export interface MatchOptions {
  password: string
  omniMatch: Matching
}

export type MatchingType = new () => {
  match({
    password,
    omniMatch,
  }: MatchOptions): MatchExtended[] | Promise<MatchExtended[]>
}

export interface Matcher {
  feedback: DefaultFeedbackFunction
  scoring: DefaultScoringFunction
  Matching: MatchingType
}

export interface Matchers {
  [key: string]: Matcher
}

export type Score = 0 | 1 | 2 | 3 | 4

export interface ZxcvbnResult {
  feedback: FeedbackType
  crackTimesSeconds: CrackTimesSeconds
  crackTimesDisplay: CrackTimesDisplay
  score: Score
  password: string
  guesses: number
  guessesLog10: number
  sequence: MatchExtended[]
  calcTime: number
}
