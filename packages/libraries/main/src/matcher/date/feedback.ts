import Options from '../../Options'

export default (options: Options) => {
  return {
    warning: options.translations.warnings.dates,
    suggestions: [options.translations.suggestions.dates],
  }
}
