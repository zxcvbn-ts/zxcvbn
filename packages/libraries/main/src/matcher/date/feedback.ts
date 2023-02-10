import { zxcvbnOptions } from '../../Options'

export default () => {
  return {
    warning: zxcvbnOptions.translations.warnings.dates,
    suggestions: [zxcvbnOptions.translations.suggestions.dates],
  }
}
