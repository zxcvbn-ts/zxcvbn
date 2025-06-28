import { MatchExtended, MatchEstimated } from '../../types'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

export default (match: MatchExtended | MatchEstimated): number => {
  if (match.pattern !== 'wordSequence') {
    return 0
  }

  // Base guesses: factorial of word count (number of ways to order the words)
  const baseGuesses = factorial(match.wordCount)

  // Additional penalty for longer sequences
  const lengthPenalty = 2 ** (match.wordCount - 2)

  return baseGuesses * lengthPenalty
}
