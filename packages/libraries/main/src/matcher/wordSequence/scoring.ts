import { MatchExtended, MatchEstimated } from '../../types'
import { VALID_SEPARATORS } from './matching'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// picking the separator character, plus how often it is repeated.
// a mixed run like '._' is charged per character
const gapVariations = (separator: string) => {
  const isRepeatedChar = Array.from(separator).every(
    (char) => char === separator[0],
  )

  return isRepeatedChar
    ? VALID_SEPARATORS.size * separator.length
    : VALID_SEPARATORS.size ** separator.length
}

// the same separator between every word only has to be guessed once
const separatorVariations = (separators: string[] = []) => {
  if (separators.length === 0) {
    return 1
  }

  const isSingleSeparator = separators.every(
    (separator) => separator === separators[0],
  )

  return isSingleSeparator
    ? gapVariations(separators[0])
    : separators.reduce(
        (variations, separator) => variations * gapVariations(separator),
        1,
      )
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
