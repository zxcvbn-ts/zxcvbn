import {
  MIN_SUBMATCH_GUESSES_SINGLE_CHAR,
  MIN_SUBMATCH_GUESSES_MULTI_CHAR,
} from '../data/const'
import utils from './utils'
import { countCharacters } from '../utils/helper'
import Options from '../Options'
import {
  DefaultScoringFunction,
  DictionaryScoringExtras,
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
import wordSequenceMatcher from '../matcher/wordSequence/scoring'

const getMinGuesses = (
  match: MatchExtended | MatchEstimated,
  password: string,
) => {
  let minGuesses = 1
  if (match.token.length < password.length) {
    // a single character is at most 2 UTF-16 code units (eg. an emoji).
    // Check the length first, this runs for every bruteforce candidate
    if (match.token.length <= 2 && countCharacters(match.token) === 1) {
      minGuesses = MIN_SUBMATCH_GUESSES_SINGLE_CHAR
    } else {
      minGuesses = MIN_SUBMATCH_GUESSES_MULTI_CHAR
    }
  }
  return minGuesses
}

type Matchers = Record<string, DefaultScoringFunction>

const matchers: Matchers = {
  bruteforce: bruteforceMatcher,
  date: dateMatcher,
  dictionary: dictionaryMatcher,
  regex: regexMatcher,
  repeat: repeatMatcher,
  sequence: sequenceMatcher,
  spatial: spatialMatcher,
  separator: separatorMatcher,
  wordSequence: wordSequenceMatcher,
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

type EstimatedMatch = MatchEstimated & Partial<DictionaryScoringExtras>

// the floor the guesses of a match were estimated with, only kept for
// estimates that a floor can have changed
const estimatedFloors = new WeakMap<object, number>()

// the guesses of a match by its pattern. A dictionary match also gets the
// numbers they are calculated from.
const getGuesses = (options: Options, match: EstimatedMatch) => {
  const estimationResult = getScoring(options, match.pattern, match)
  if (typeof estimationResult === 'number') {
    return estimationResult
  }
  if (match.pattern === 'dictionary') {
    match.baseGuesses = estimationResult.baseGuesses
    match.uppercaseVariations = estimationResult.uppercaseVariations
    match.l33tVariations = estimationResult.l33tVariations
    return estimationResult.calculation
  }
  return 0
}

// ------------------------------------------------------------------------------
// guess estimation -- one function per match pattern ---------------------------
// ------------------------------------------------------------------------------

export default (
  options: Options,
  match: MatchExtended | MatchEstimated,
  password: string,
): MatchEstimated => {
  // a match's guess estimate doesn't change. cache it. Guesses set by the
  // caller are kept as they are. Ours include the floor of the password they
  // were estimated for, which only matters when they are at most the highest
  // floor: then they are estimated again for another floor.
  if ('guesses' in match && match.guesses != null) {
    const estimatedFloor =
      match.guesses > MIN_SUBMATCH_GUESSES_MULTI_CHAR
        ? undefined
        : estimatedFloors.get(match)
    if (
      estimatedFloor === undefined ||
      estimatedFloor === getMinGuesses(match, password)
    ) {
      return match as MatchEstimated
    }
  }

  const minGuesses = getMinGuesses(match, password)

  // The estimate is written onto the match itself instead of a copy, this
  // runs for every match of every check. Matching copies the matches of
  // custom matchers, so the match is new for this check.
  const estimated = match as EstimatedMatch
  const matchGuesses = Math.max(getGuesses(options, estimated), minGuesses)
  estimated.guesses = matchGuesses
  if (matchGuesses <= MIN_SUBMATCH_GUESSES_MULTI_CHAR) {
    estimatedFloors.set(estimated, minGuesses)
  }
  estimated.guessesLog10 = utils.log10(matchGuesses)
  return estimated
}
