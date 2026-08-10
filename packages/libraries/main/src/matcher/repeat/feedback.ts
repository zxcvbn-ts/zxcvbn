import Options from '../../Options.ts'
import { MatchEstimated } from '../../types.ts'

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
