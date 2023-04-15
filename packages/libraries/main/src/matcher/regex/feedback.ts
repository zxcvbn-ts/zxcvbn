import { zxcvbnOptions } from '../../Options'
import { MatchEstimated } from '../../types'

export default (match: MatchEstimated) => {
  if (match.regexName === 'recentYear') {
    return {
      warning: zxcvbnOptions.translations.warnings.recentYears,
      suggestions: [
        zxcvbnOptions.translations.suggestions.recentYears,
        zxcvbnOptions.translations.suggestions.associatedYears,
      ],
    }
  }
  return {
    warning: null,
    suggestions: [],
  }
}
