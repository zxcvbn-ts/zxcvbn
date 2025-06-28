import Options from '../../Options'
import { MatchEstimated } from '../../types'

export default (options: Options, match: MatchEstimated) => {
  if (match.pattern !== 'wordSequence') {
    return null
  }

  let warning = null
  const suggestions: string[] = []

  // Warning for common word sequences
  if (match.wordCount >= 3) {
    warning = options.translations.warnings.sequences
  }

  // Suggestions based on sequence characteristics
  if (match.ascending) {
    suggestions.push(options.translations.suggestions.sequences)
  } else {
    suggestions.push(options.translations.suggestions.anotherWord)
  }

  if (match.wordCount > 2) {
    suggestions.push(options.translations.suggestions.useWords)
  }

  return {
    warning,
    suggestions,
  }
}
