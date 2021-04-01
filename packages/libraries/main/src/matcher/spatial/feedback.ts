import Options from '../../Options'
import { SpatialMatch } from '../../types'

export default (match: SpatialMatch) => {
  let warning = Options.translations.warnings.keyPattern
  if (match.turns === 1) {
    warning = Options.translations.warnings.straightRow
  }
  return {
    warning,
    suggestions: [Options.translations.suggestions.longerKeyboardPattern],
  }
}
