import { zxcvbnOptions } from '../../Options'
import { MatchEstimated } from '../../types'

export default (match: MatchEstimated) => {
  let warning = zxcvbnOptions.translations.warnings.keyPattern
  if (match.turns === 1) {
    warning = zxcvbnOptions.translations.warnings.straightRow
  }
  return {
    warning,
    suggestions: [zxcvbnOptions.translations.suggestions.longerKeyboardPattern],
  }
}
