import Options from '../../Options'
import { MatchEstimated } from '../../types'
import { countCharacters } from '../../utils/helper'

export default (options: Options, match: MatchEstimated) => {
  let warning = options.translations.warnings.extendedRepeat
  if (countCharacters(match.baseToken) === 1) {
    warning = options.translations.warnings.simpleRepeat
  }

  return {
    warning,
    suggestions: [options.translations.suggestions.repeated],
  }
}
