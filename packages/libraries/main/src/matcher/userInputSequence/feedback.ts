import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (options: Options, match: MatchEstimated) => {
  if (match.pattern !== 'userInputSequence') {
    return null
  }

  return {
    warning: options.translations.warnings.userInputs,
    suggestions: [options.translations.suggestions.useWords],
  }
}
