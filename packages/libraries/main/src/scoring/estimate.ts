import {
  MIN_SUBMATCH_GUESSES_SINGLE_CHAR,
  MIN_SUBMATCH_GUESSES_MULTI_CHAR,
} from '../data/const'
import utils from './utils'
import { LooseObject, MatchEstimated, MatchExtended } from '../types'
import matcher from '../matcher'
import { DictionaryReturn } from '../matcher/dictionary/scoring'

export const defaultScoringFunction = (
  _match: MatchExtended | MatchEstimated,
): number | DictionaryReturn => 0

const getMinGuesses = (
  match: MatchExtended | MatchEstimated,
  password: string,
) => {
  let minGuesses = 1
  if (match.token.length < password.length) {
    if (match.token.length === 1) {
      minGuesses = MIN_SUBMATCH_GUESSES_SINGLE_CHAR
    } else {
      minGuesses = MIN_SUBMATCH_GUESSES_MULTI_CHAR
    }
  }
  return minGuesses
}

// ------------------------------------------------------------------------------
// guess estimation -- one function per match pattern ---------------------------
// ------------------------------------------------------------------------------
export default (match: MatchExtended | MatchEstimated, password: string) => {
  const extraData: LooseObject = {}
  // a match's guess estimate doesn't change. cache it.
  if ('guesses' in match && match.guesses != null) {
    return match
  }

  const minGuesses = getMinGuesses(match, password)

  const estimationResult = matcher.matchers[match.pattern].scoring(match)
  let guesses = 0
  if (typeof estimationResult === 'number') {
    guesses = estimationResult
  } else if (match.pattern === 'dictionary') {
    guesses = estimationResult.calculation
    extraData.baseGuesses = estimationResult.baseGuesses
    extraData.uppercaseVariations = estimationResult.uppercaseVariations
    extraData.l33tVariations = estimationResult.l33tVariations
  }

  const matchGuesses = Math.max(guesses, minGuesses)
  return {
    ...match,
    ...extraData,
    guesses: matchGuesses,
    guessesLog10: utils.log10(matchGuesses),
  }
}
