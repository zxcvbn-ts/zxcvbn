import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (options: Options, match: MatchEstimated) => {
  if (match.regexName === 'recentYear') {
    return {
      warning: options.translations.warnings.recentYears,
      suggestions: [
        options.translations.suggestions.recentYears,
        options.translations.suggestions.associatedYears,
      ],
    }
  }
  return {
    warning: null,
    suggestions: [],
  }
}
