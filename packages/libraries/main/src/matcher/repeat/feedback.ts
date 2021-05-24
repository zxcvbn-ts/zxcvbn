import Options from '../../Options'
import { MatchEstimated, MatchExtended } from '../../types'

export default (match: MatchExtended | MatchEstimated) => {
  let warning = Options.translations.warnings.extendedRepeat
  if (match.baseToken.length === 1) {
    warning = Options.translations.warnings.simpleRepeat
  }

  return {
    warning,
    suggestions: [Options.translations.suggestions.repeated],
  }
}
