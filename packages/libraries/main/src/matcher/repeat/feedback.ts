import { zxcvbnOptions } from '../../Options'
import { MatchEstimated } from '../../types'

export default (match: MatchEstimated) => {
  let warning = zxcvbnOptions.translations.warnings.extendedRepeat
  if (match.baseToken.length === 1) {
    warning = zxcvbnOptions.translations.warnings.simpleRepeat
  }

  return {
    warning,
    suggestions: [zxcvbnOptions.translations.suggestions.repeated],
  }
}
