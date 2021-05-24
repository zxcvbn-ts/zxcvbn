import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (match: MatchEstimated) => {
  let warning = Options.translations.warnings.keyPattern
  if (match.turns === 1) {
    warning = Options.translations.warnings.straightRow
  }
  return {
    warning,
    suggestions: [Options.translations.suggestions.longerKeyboardPattern],
  }
}
