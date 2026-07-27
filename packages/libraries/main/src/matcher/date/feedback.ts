import Options from '../../Options.ts'

export default (options: Options) => {
  return {
    warning: options.translations.warnings.dates,
    suggestions: [options.translations.suggestions.dates],
  }
}
