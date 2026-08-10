import Options from '../../Options.ts'

export default (options: Options) => {
  return {
    warning: options.translations.warnings.sequences,
    suggestions: [options.translations.suggestions.sequences],
  }
}
