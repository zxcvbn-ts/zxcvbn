import zxcvbnOptions from '../../Options'

export default () => {
  return {
    warning: zxcvbnOptions.translations.warnings.separators,
    suggestions: [zxcvbnOptions.translations.suggestions.separators],
  }
}
