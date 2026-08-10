import Options from './Options.ts'
import {
  DefaultFeedbackFunction,
  FeedbackType,
  MatchEstimated,
} from './types.ts'
import bruteforceMatcher from './matcher/bruteforce/feedback.ts'
import dateMatcher from './matcher/date/feedback.ts'
import dictionaryMatcher from './matcher/dictionary/feedback.ts'
import regexMatcher from './matcher/regex/feedback.ts'
import repeatMatcher from './matcher/repeat/feedback.ts'
import sequenceMatcher from './matcher/sequence/feedback.ts'
import spatialMatcher from './matcher/spatial/feedback.ts'
import separatorMatcher from './matcher/separator/feedback.ts'
import wordSequenceMatcher from './matcher/wordSequence/feedback.ts'

const createFeedback = (
  suggestions?: FeedbackType['suggestions'],
): FeedbackType => ({
  warning: null,
  suggestions: suggestions ?? [],
})

type Matchers = Record<string, DefaultFeedbackFunction>
/*
 * -------------------------------------------------------------------------------
 *  Generate feedback ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class Feedback {
  private matchers: Matchers = {}

  constructor(private options: Options) {
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

  public getFeedback(score: number, sequence: MatchEstimated[]) {
    if (sequence.length === 0) {
      return createFeedback([
        this.options.translations.suggestions.useWords,
        this.options.translations.suggestions.noNeed,
      ])
    }
    if (score > 2) {
      return createFeedback()
    }
    const extraFeedback = this.options.translations.suggestions.anotherWord
    const longestMatch = this.getLongestMatch(sequence)
    let feedback = this.getMatchFeedback(longestMatch, sequence.length === 1)
    if (feedback !== null && feedback !== undefined) {
      feedback.suggestions.unshift(extraFeedback)
    } else {
      feedback = createFeedback([extraFeedback])
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
    return createFeedback()
  }
}

export default Feedback
