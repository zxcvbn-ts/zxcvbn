import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (options: Options, match: MatchEstimated) => {
  let warning = options.translations.warnings.extendedRepeat
  if (match.baseToken.length === 1) {
    warning = options.translations.warnings.simpleRepeat
  }

  return {
    warning,
    suggestions: [options.translations.suggestions.repeated],
  }
}
