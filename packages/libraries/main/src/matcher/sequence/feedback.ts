import { zxcvbnOptions } from '../../Options'

export default () => {
  return {
    warning: zxcvbnOptions.translations.warnings.sequences,
    suggestions: [zxcvbnOptions.translations.suggestions.sequences],
  }
}
