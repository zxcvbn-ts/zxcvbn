import Options from './Options'
import { DefaultFeedbackFunction, FeedbackType, MatchEstimated } from './types'
import bruteforceMatcher from './matcher/bruteforce/feedback'
import dateMatcher from './matcher/date/feedback'
import dictionaryMatcher from './matcher/dictionary/feedback'
import regexMatcher from './matcher/regex/feedback'
import repeatMatcher from './matcher/repeat/feedback'
import sequenceMatcher from './matcher/sequence/feedback'
import spatialMatcher from './matcher/spatial/feedback'
import separatorMatcher from './matcher/separator/feedback'
import wordSequenceMatcher from './matcher/wordSequence/feedback'

const defaultFeedback = {
  warning: null,
  suggestions: [],
}

type Matchers = Record<string, DefaultFeedbackFunction>
/*
 * -------------------------------------------------------------------------------
 *  Generate feedback ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class Feedback {
  private matchers: Matchers = {}

  private defaultFeedback: FeedbackType = {
    warning: null,
    suggestions: [],
  }

  constructor(private options: Options) {
    this.setDefaultSuggestions()
    this.matchers = {
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

    Object.entries(this.options.matchers).forEach(([key, matcher]) => {
      if (matcher.feedback) {
        this.matchers[key] = matcher.feedback
      }
    })
  }

  private setDefaultSuggestions() {
    this.defaultFeedback.suggestions.push(
      this.options.translations.suggestions.useWords,
      this.options.translations.suggestions.noNeed,
    )
  }

  public getFeedback(score: number, sequence: MatchEstimated[]) {
    if (sequence.length === 0) {
      return this.defaultFeedback
    }
    if (score > 2) {
      return defaultFeedback
    }
    const extraFeedback = this.options.translations.suggestions.anotherWord
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

  private getLongestMatch(sequence: MatchEstimated[]) {
    let longestMatch = sequence[0]
    // ignore first entry
    for (let i = 1; i < sequence.length; i += 1) {
      const match = sequence[i]
      if (match.token.length > longestMatch.token.length) {
        longestMatch = match
      }
    }
    return longestMatch
  }

  private getMatchFeedback(match: MatchEstimated, isSoleMatch: boolean) {
    if (this.matchers[match.pattern]) {
      return this.matchers[match.pattern](this.options, match, isSoleMatch)
    }
    return defaultFeedback
  }
}

export default Feedback
