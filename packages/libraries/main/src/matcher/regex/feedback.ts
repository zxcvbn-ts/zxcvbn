import Options from '../../Options.ts'
import { MatchEstimated } from '../../types.ts'

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
