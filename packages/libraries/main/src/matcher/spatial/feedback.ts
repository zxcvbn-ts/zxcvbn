import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (options: Options, match: MatchEstimated) => {
  let warning = options.translations.warnings.keyPattern
  if (match.turns === 1) {
    warning = options.translations.warnings.straightRow
  }
  return {
    warning,
    suggestions: [options.translations.suggestions.longerKeyboardPattern],
  }
}
