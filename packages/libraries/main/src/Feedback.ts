import { zxcvbnOptions } from './Options'
import { DefaultFeedbackFunction, FeedbackType, MatchEstimated } from './types'
import bruteforceMatcher from './matcher/bruteforce/feedback'
import dateMatcher from './matcher/date/feedback'
import dictionaryMatcher from './matcher/dictionary/feedback'
import regexMatcher from './matcher/regex/feedback'
import repeatMatcher from './matcher/repeat/feedback'
import sequenceMatcher from './matcher/sequence/feedback'
import spatialMatcher from './matcher/spatial/feedback'
import separatorMatcher from './matcher/separator/feedback'

const defaultFeedback = {
  warning: null,
  suggestions: [],
}

type Matchers = {
  [key: string]: DefaultFeedbackFunction
}
/*
 * -------------------------------------------------------------------------------
 *  Generate feedback ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class Feedback {
  readonly matchers: Matchers = {
    bruteforce: bruteforceMatcher,
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
    separator: separatorMatcher,
  }

  defaultFeedback: FeedbackType = {
    warning: null,
    suggestions: [],
  }

  constructor() {
    this.setDefaultSuggestions()
  }

  setDefaultSuggestions() {
    this.defaultFeedback.suggestions.push(
      zxcvbnOptions.translations.suggestions.useWords,
      zxcvbnOptions.translations.suggestions.noNeed,
    )
  }

  getFeedback(score: number, sequence: MatchEstimated[]) {
    if (sequence.length === 0) {
      return this.defaultFeedback
    }
    if (score > 2) {
      return defaultFeedback
    }
    const extraFeedback = zxcvbnOptions.translations.suggestions.anotherWord
    const longestMatch = this.getLongestMatch(sequence)
    let feedback = this.getMatchFeedback(longestMatch, sequence.length === 1)
    if (feedback !== null && feedback !== undefined) {
      feedback.suggestions.unshift(extraFeedback)
    } else {
      feedback = {
        warning: null,
        suggestions: [extraFeedback],
      }
    }
    return feedback
  }

  getLongestMatch(sequence: MatchEstimated[]) {
    let longestMatch = sequence[0]
    const slicedSequence = sequence.slice(1)
    slicedSequence.forEach((match: MatchEstimated) => {
      if (match.token.length > longestMatch.token.length) {
        longestMatch = match
      }
    })
    return longestMatch
  }

  getMatchFeedback(match: MatchEstimated, isSoleMatch: boolean) {
    if (this.matchers[match.pattern]) {
      return this.matchers[match.pattern](match, isSoleMatch)
    }
    if (
      zxcvbnOptions.matchers[match.pattern] &&
      'feedback' in zxcvbnOptions.matchers[match.pattern]
    ) {
      return zxcvbnOptions.matchers[match.pattern].feedback(match, isSoleMatch)
    }
    return defaultFeedback
  }
}

export default Feedback
