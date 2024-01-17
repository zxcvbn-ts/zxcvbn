import Options from '../../Options'

export default (options: Options) => {
  return {
    warning: options.translations.warnings.sequences,
    suggestions: [options.translations.suggestions.sequences],
  }
}
