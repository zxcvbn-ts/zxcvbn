import Options from './Options'
import { FeedbackType, MatchEstimated } from './types'
import matcher from './matcher'

const defaultFeedback = {
  warning: '',
  suggestions: [],
}

/*
 * -------------------------------------------------------------------------------
 *  Generate feedback ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class Feedback {
  defaultFeedback: FeedbackType = {
    warning: '',
    suggestions: [],
  }

  constructor() {
    this.setDefaultSuggestions()
  }

  setDefaultSuggestions() {
    this.defaultFeedback.suggestions.push(
      Options.translations.suggestions.useWords,
      Options.translations.suggestions.noNeed,
    )
  }

  getFeedback(score: number, sequence: MatchEstimated[]) {
    if (sequence.length === 0) {
      return this.defaultFeedback
    }
    if (score > 2) {
      return defaultFeedback
    }
    const extraFeedback = Options.translations.suggestions.anotherWord
    const longestMatch = this.getLongestMatch(sequence)
    let feedback = this.getMatchFeedback(longestMatch, sequence.length === 1)
    if (feedback !== null && feedback !== undefined) {
      feedback.suggestions.unshift(extraFeedback)
      if (feedback.warning == null) {
        feedback.warning = ''
      }
    } else {
      feedback = {
        warning: '',
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

  getMatchFeedback(match: MatchEstimated, isSoleMatch: Boolean) {
    if (
      matcher.matchers[match.pattern] &&
      matcher.matchers[match.pattern].feedback
    ) {
      return (matcher.matchers[match.pattern].feedback as Function)(
        match,
        isSoleMatch,
      )
    }

    return defaultFeedback
  }
}

export default Feedback
