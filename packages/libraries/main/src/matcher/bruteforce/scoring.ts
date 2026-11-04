import {
  BRUTEFORCE_CARDINALITY,
  MIN_SUBMATCH_GUESSES_SINGLE_CHAR,
  MIN_SUBMATCH_GUESSES_MULTI_CHAR,
} from '../../data/const'
import { MatchEstimated, MatchExtended } from '../../types'
import { countCharacters } from '../../utils/helper'

// guesses for a bruteforce token of tokenLength characters (code points).
// The scoring search calls this directly to rate bruteforce candidates
// without creating a match object for each of them.
export const bruteforceGuesses = (tokenLength: number) => {
  let guesses = BRUTEFORCE_CARDINALITY ** tokenLength
  if (guesses === Number.POSITIVE_INFINITY) {
    guesses = Number.MAX_VALUE
  }
  let minGuesses
  // small detail: make bruteforce matches at minimum one guess bigger than smallest allowed
  // submatch guesses, such that non-bruteforce submatches over the same [i..j] take precedence.
  if (tokenLength === 1) {
    minGuesses = MIN_SUBMATCH_GUESSES_SINGLE_CHAR + 1
  } else {
    minGuesses = MIN_SUBMATCH_GUESSES_MULTI_CHAR + 1
  }

  return Math.max(guesses, minGuesses)
}

export default ({ token }: MatchExtended | MatchEstimated) =>
  bruteforceGuesses(countCharacters(token))
