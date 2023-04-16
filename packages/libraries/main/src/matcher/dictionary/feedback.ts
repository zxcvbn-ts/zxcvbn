import { zxcvbnOptions } from '../../Options'
import { MatchEstimated } from '../../types'
import { ALL_UPPER_INVERTED, START_UPPER } from '../../data/const'

const getDictionaryWarningPassword = (
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  let warning: string | null = null
  if (isSoleMatch && !match.l33t && !match.reversed) {
    if (match.rank <= 10) {
      warning = zxcvbnOptions.translations.warnings.topTen
    } else if (match.rank <= 100) {
      warning = zxcvbnOptions.translations.warnings.topHundred
    } else {
      warning = zxcvbnOptions.translations.warnings.common
    }
  } else if (match.guessesLog10 <= 4) {
    warning = zxcvbnOptions.translations.warnings.similarToCommon
  }
  return warning
}

const getDictionaryWarningWikipedia = (
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  let warning: string | null = null
  if (isSoleMatch) {
    warning = zxcvbnOptions.translations.warnings.wordByItself
  }
  return warning
}

const getDictionaryWarningNames = (
  match: MatchEstimated,
  isSoleMatch?: boolean,
) => {
  if (isSoleMatch) {
    return zxcvbnOptions.translations.warnings.namesByThemselves
  }
  return zxcvbnOptions.translations.warnings.commonNames
}

const getDictionaryWarning = (match: MatchEstimated, isSoleMatch?: boolean) => {
  let warning: string | null = null
  const dictName = match.dictionaryName
  const isAName =
    dictName === 'lastnames' || dictName.toLowerCase().includes('firstnames')
  if (dictName === 'passwords') {
    warning = getDictionaryWarningPassword(match, isSoleMatch)
  } else if (dictName.includes('wikipedia')) {
    warning = getDictionaryWarningWikipedia(match, isSoleMatch)
  } else if (isAName) {
    warning = getDictionaryWarningNames(match, isSoleMatch)
  } else if (dictName === 'userInputs') {
    warning = zxcvbnOptions.translations.warnings.userInputs
  }
  return warning
}

export default (match: MatchEstimated, isSoleMatch?: boolean) => {
  const warning = getDictionaryWarning(match, isSoleMatch)
  const suggestions: string[] = []
  const word = match.token

  if (word.match(START_UPPER)) {
    suggestions.push(zxcvbnOptions.translations.suggestions.capitalization)
  } else if (word.match(ALL_UPPER_INVERTED) && word.toLowerCase() !== word) {
    suggestions.push(zxcvbnOptions.translations.suggestions.allUppercase)
  }
  if (match.reversed && match.token.length >= 4) {
    suggestions.push(zxcvbnOptions.translations.suggestions.reverseWords)
  }
  if (match.l33t) {
    suggestions.push(zxcvbnOptions.translations.suggestions.l33t)
  }
  return {
    warning,
    suggestions,
  }
}
