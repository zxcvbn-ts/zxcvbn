import translationKeys from './data/translationKeys'
import l33tTableDefault from './data/l33tTable'
import { REGEXEN } from './data/const'
import { DictionaryReturn } from './matcher/dictionary/scoring'
import Matching from './Matching'
import { PasswordChanges } from './matcher/dictionary/variants/matching/unmunger/getCleanPasswords'

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
  | 'separator'
  | string

export type DictionaryNames =
  | 'passwords'
  | 'commonWords'
  | 'firstnames'
  | 'lastnames'
  | 'wikipedia'
  | 'userInputs'

export interface Match {
  /**
   * @description The name of the matcher
   */
  pattern: Pattern
  /**
   * @description The start index of the token found in the password
   */
  i: number
  /**
   @description The end index of the token found in the password
   */
  j: number
  /**
   * @description The token found in the password
   */
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
  subs: PasswordChanges[]
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

export interface SeparatorMatch extends Match {
  pattern: 'separator'
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
  | SeparatorMatch
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
  warning: string | null
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
  /**
   * @description Defines an object with a key value match to translate the feedback given by this library. The default values are plain keys so that you can use your own i18n library. Already implemented language can be found with something like @zxcvbn-ts/language-en.
   */
  translations?: TranslationKeys
  /**
   * @description Defines keyboard layouts as an object which are used to find sequences. Already implemented layouts can be found in @zxcvbn-ts/language-common
   */
  graphs?: OptionsGraph
  /**
   * @description Define an object with l33t substitutions. For example that an "a" can be exchanged with a "4" or a "@".
   */
  l33tTable?: OptionsL33tTable
  /**
   * @description Define dictionary that should be used to check against. The matcher will search the dictionaries for similar password with l33t speak and reversed words. The recommended sets are found in @zxcvbn-ts/language-common and @zxcvbn-ts/language-en.
   */
  dictionary?: OptionsDictionary
  /**
   * @description Defines if the levenshtein algorithm should be used. This will be only used on the complete password and not on parts of it. This will decrease the calcTime a bit but will significantly improve the password check. The recommended sets are found in @zxcvbn-ts/language-common and @zxcvbn-ts/language-en.
   * @default false
   */
  useLevenshteinDistance?: boolean
  /**
   * @description Defines how many characters can be different to match a dictionary word with the levenshtein algorithm.
   * @default 2
   */
  levenshteinThreshold?: number
  /**
   * @description The l33t matcher will check how many characters can be exchanged with the l33t table. If they are to many it will decrease the calcTime significantly. So we cap it at a reasonable value by default which will probably already seems like a strong password anyway.
   * @default 100
   */
  l33tMaxSubstitutions?: number
  /**
   * @description Defines how many character of the password are checked. A password longer than the default are considered strong anyway, but it can be increased as pleased. Be aware that this could open some attack vectors.
   * @default 256
   */
  maxLength?: number
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
  /**
   * @description This is the original Matcher so that one can use other matchers to define a baseGuess. An usage example is the repeat matcher
   */
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
