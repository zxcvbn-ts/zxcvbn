import Options from '../../Options'
import { RepeatMatch } from '../../types'

export default (match: RepeatMatch) => {
  let warning = Options.translations.warnings.extendedRepeat
  if (match.baseToken.length === 1) {
    warning = Options.translations.warnings.simpleRepeat
  }

  return {
    warning,
    suggestions: [Options.translations.suggestions.repeated],
  }
}
