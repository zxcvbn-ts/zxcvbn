import {
  MIN_SUBMATCH_GUESSES_SINGLE_CHAR,
  MIN_SUBMATCH_GUESSES_MULTI_CHAR,
} from '../data/const'
import utils from './utils'
import Options from '../Options'
import {
  DefaultScoringFunction,
  LooseObject,
  MatchEstimated,
  MatchExtended,
} from '../types'
import bruteforceMatcher from '../matcher/bruteforce/scoring'
import dateMatcher from '../matcher/date/scoring'
import dictionaryMatcher from '../matcher/dictionary/scoring'
import regexMatcher from '../matcher/regex/scoring'
import repeatMatcher from '../matcher/repeat/scoring'
import sequenceMatcher from '../matcher/sequence/scoring'
import spatialMatcher from '../matcher/spatial/scoring'
import separatorMatcher from '../matcher/separator/scoring'

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

type Matchers = {
  [key: string]: DefaultScoringFunction
}

const matchers: Matchers = {
  bruteforce: bruteforceMatcher,
  date: dateMatcher,
  dictionary: dictionaryMatcher,
  regex: regexMatcher,
  repeat: repeatMatcher,
  sequence: sequenceMatcher,
  spatial: spatialMatcher,
  separator: separatorMatcher,
}

const getScoring = (
  options: Options,
  name: string,
  match: MatchExtended | MatchEstimated,
) => {
  if (matchers[name]) {
    return matchers[name](match, options)
  }
  if (options.matchers[name] && 'scoring' in options.matchers[name]) {
    return options.matchers[name].scoring(match, options)
  }
  return 0
}

// ------------------------------------------------------------------------------
// guess estimation -- one function per match pattern ---------------------------
// ------------------------------------------------------------------------------
// eslint-disable-next-line complexity, max-statements
export default (
  options: Options,
  match: MatchExtended | MatchEstimated,
  password: string,
) => {
  const extraData: LooseObject = {}
  // a match's guess estimate doesn't change. cache it.
  if ('guesses' in match && match.guesses != null) {
    return match
  }

  const minGuesses = getMinGuesses(match, password)

  const estimationResult = getScoring(options, match.pattern, match)
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
