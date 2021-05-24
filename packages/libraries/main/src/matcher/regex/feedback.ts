import Options from '../../Options'
import { MatchEstimated, MatchExtended } from '../../types'

export default (match: MatchExtended | MatchEstimated) => {
  if (match.regexName === 'recentYear') {
    return {
      warning: Options.translations.warnings.recentYears,
      suggestions: [
        Options.translations.suggestions.recentYears,
        Options.translations.suggestions.associatedYears,
      ],
    }
  }
  return {
    warning: '',
    suggestions: [],
  }
}
