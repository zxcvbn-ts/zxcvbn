import dateSplits from './dateSplits'

export const DATE_MAX_YEAR = 2099
export const DATE_MIN_YEAR = 1000
export const DATE_SPLITS = dateSplits
export const BRUTEFORCE_CARDINALITY = 10
export const MIN_GUESSES_BEFORE_GROWING_SEQUENCE = 10000
export const MIN_SUBMATCH_GUESSES_SINGLE_CHAR = 10
export const MIN_SUBMATCH_GUESSES_MULTI_CHAR = 50
export const MIN_YEAR_SPACE = 21
// \xbf-\xdf is a range for almost all special uppercase letter like Ä and so on
export const START_UPPER = /^[A-Z\xbf-\xdf][^A-Z\xbf-\xdf]+$/
export const END_UPPER = /^[^A-Z\xbf-\xdf]+[A-Z\xbf-\xdf]$/
// \xdf-\xff is a range for almost all special lowercase letter like ä and so on
export const ALL_UPPER = /^[A-Z\xbf-\xdf]+$/
export const ALL_UPPER_INVERTED = /^[^a-z\xdf-\xff]+$/
export const ALL_LOWER = /^[a-z\xdf-\xff]+$/
export const ALL_LOWER_INVERTED = /^[^A-Z\xbf-\xdf]+$/
export const ONE_LOWER = /[a-z\xdf-\xff]/
export const ONE_UPPER = /[A-Z\xbf-\xdf]/
export const ALPHA_INVERTED = /[^A-Za-z\xbf-\xdf]/gi
export const ALL_DIGIT = /^\d+$/
export const REFERENCE_YEAR = new Date().getFullYear()
export const REGEXEN = { recentYear: /19\d\d|20\d\d/g }
/* Separators */
// what the separator matcher splits a password at, eg. 'pass;word|123'.
// Its length is what a separator match is charged
export const SEPARATOR_CHARS = [
  ' ',
  ',',
  ';',
  ':',
  '|',
  '/',
  '\\',
  '_',
  '.',
  '-',
]
export const SEPARATOR_CHAR_COUNT = SEPARATOR_CHARS.length
/* Word sequences */
// the subset of SEPARATOR_CHARS that joins words into one name or phrase:
// 'one two', 'one-two', 'one_two', 'one.two'. Its size is what each gap of a
// word sequence is charged, so adding a character here raises those guesses
export const WORD_SEQUENCE_SEPARATOR_CHARS = new Set([' ', '-', '_', '.'])
export const WORD_SEQUENCE_LETTER_GAP_OPTIONS = 26
export const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g
