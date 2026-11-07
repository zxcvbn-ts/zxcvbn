import { MatchExtended, MatchEstimated } from '../../types'
import {
  WORD_SEQUENCE_LETTER_GAP_OPTIONS,
  WORD_SEQUENCE_SEPARATOR_CHARS,
} from '../../data/const'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

const product = (values: number[]) =>
  values.reduce((result, value) => result * value, 1)

// a gap is made of separators or, for camelCase, a single uppercase letter
const gapOptions = (gap: string) =>
  WORD_SEQUENCE_SEPARATOR_CHARS.has(gap[0])
    ? WORD_SEQUENCE_SEPARATOR_CHARS.size
    : WORD_SEQUENCE_LETTER_GAP_OPTIONS

// picking the gap character, plus how often it is repeated.
// a mixed run like '._' is charged per character
const gapVariations = (gap: string) =>
  new Set(gap).size === 1
    ? gapOptions(gap) * gap.length
    : gapOptions(gap) ** gap.length

// custom matchers registered as wordSequence may not provide separators
const separatorVariations = (separators: string[] = []) => {
  const gaps = separators.filter((gap) => gap !== '')
  if (gaps.length === 0) {
    return 1
  }

  // when only some words are separated, each gap may or may not hold a separator
  const placements =
    gaps.length === separators.length ? 1 : 2 ** separators.length

  // the same separator between every word only has to be guessed once
  if (new Set(gaps).size === 1) {
    return placements * gapVariations(gaps[0])
  }

  // so does a single character, only its run lengths are charged per gap
  if (new Set(gaps.join('')).size === 1) {
    return (
      placements * gapOptions(gaps[0]) * product(gaps.map((gap) => gap.length))
    )
  }

  return placements * product(gaps.map((gap) => gapVariations(gap)))
}

export default (match: MatchExtended | MatchEstimated): number => {
  if (match.pattern !== 'wordSequence') {
    return 0
  }

  // Base guesses: factorial of word count (number of ways to order the words)
  const baseGuesses = factorial(match.wordCount)

  // Additional penalty for longer sequences
  const lengthPenalty = 2 ** (match.wordCount - 2)

  return baseGuesses * lengthPenalty * separatorVariations(match.separators)
}
