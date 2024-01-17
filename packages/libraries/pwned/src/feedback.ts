// @ts-ignore
import { DefaultFeedbackFunction } from '@zxcvbn-ts/core'

const pwnedFeedback: DefaultFeedbackFunction = (options) => {
  return {
    warning: options.translations.warnings.pwned,
    suggestions: [options.translations.suggestions.pwned],
  }
}

export default pwnedFeedback
