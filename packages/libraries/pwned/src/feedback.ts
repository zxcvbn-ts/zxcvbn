// @ts-ignore
import { Options } from '@zxcvbn-ts/core'

export default (options: Options) => {
  return () => {
    return {
      warning: options.translations.warnings.pwned,
      suggestions: [options.translations.suggestions.pwned],
    }
  }
}
