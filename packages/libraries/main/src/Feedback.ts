import Options from './Options'
import { FeedbackType, MatchEstimated } from './types'

export interface FeedbackReturnValue {
  warning: string
  suggestions: string[]
}

const defaultFeedback = {
  warning: '',
  suggestions: [],
}

export const defaultFeedbackFunction = (
  _match: MatchEstimated,
  _isSoleMatch?: Boolean,
): FeedbackReturnValue | null => defaultFeedback

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
      Options.matchers[match.pattern] &&
      Options.matchers[match.pattern].feedback
    ) {
      return (Options.matchers[match.pattern].feedback as Function)(
        match,
        isSoleMatch,
      )
    }

    return defaultFeedback
  }
}

export default Feedback
