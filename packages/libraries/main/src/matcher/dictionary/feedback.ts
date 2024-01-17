import Options from '../../Options'
import { MatchEstimated } from '../../types'
import { ALL_UPPER_INVERTED, START_UPPER } from '../../data/const'

const getDictionaryWarningPassword = (
  options: Options,
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  let warning: string | null = null
  if (isSoleMatch && !match.l33t && !match.reversed) {
    if (match.rank <= 10) {
      warning = options.translations.warnings.topTen
    } else if (match.rank <= 100) {
      warning = options.translations.warnings.topHundred
    } else {
      warning = options.translations.warnings.common
    }
  } else if (match.guessesLog10 <= 4) {
    warning = options.translations.warnings.similarToCommon
  }
  return warning
}

const getDictionaryWarningWikipedia = (
  options: Options,
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  let warning: string | null = null
  if (isSoleMatch) {
    warning = options.translations.warnings.wordByItself
  }
  return warning
}

const getDictionaryWarningNames = (
  options: Options,
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  if (isSoleMatch) {
    return options.translations.warnings.namesByThemselves
  }
  return options.translations.warnings.commonNames
}

const getDictionaryWarning = (
  options: Options,
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  let warning: string | null = null
  const dictName = match.dictionaryName
  const isAName =
    dictName === 'lastnames' || dictName.toLowerCase().includes('firstnames')
  if (dictName === 'passwords') {
    warning = getDictionaryWarningPassword(options, match, isSoleMatch)
  } else if (dictName.includes('wikipedia')) {
    warning = getDictionaryWarningWikipedia(options, match, isSoleMatch)
  } else if (isAName) {
    warning = getDictionaryWarningNames(options, match, isSoleMatch)
  } else if (dictName === 'userInputs') {
    warning = options.translations.warnings.userInputs
  }
  return warning
}

export default (
  options: Options,
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  const warning = getDictionaryWarning(options, match, isSoleMatch)
  const suggestions: string[] = []
  const word = match.token

  if (word.match(START_UPPER)) {
    suggestions.push(options.translations.suggestions.capitalization)
  } else if (word.match(ALL_UPPER_INVERTED) && word.toLowerCase() !== word) {
    suggestions.push(options.translations.suggestions.allUppercase)
  }
  if (match.reversed && match.token.length >= 4) {
    suggestions.push(options.translations.suggestions.reverseWords)
  }
  if (match.l33t) {
    suggestions.push(options.translations.suggestions.l33t)
  }
  return {
    warning,
    suggestions,
  }
}
