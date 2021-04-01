import Options from '../../Options'
import { RegexMatch } from '../../types'

export default (match: RegexMatch) => {
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
