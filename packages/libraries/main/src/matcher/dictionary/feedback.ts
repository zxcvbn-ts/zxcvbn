import Options from '../../Options'
import { MatchEstimated } from '../../types'
import { ALL_UPPER_INVERTED, START_UPPER } from '../../data/const'

const getDictionaryWarningPassword = (
  match: MatchEstimated,
  isSoleMatch?: Boolean,
) => {
  let warning = ''
  if (isSoleMatch && !match.l33t && !match.reversed) {
    if (match.rank <= 10) {
      warning = Options.translations.warnings.topTen
    } else if (match.rank <= 100) {
      warning = Options.translations.warnings.topHundred
    } else {
      warning = Options.translations.warnings.common
    }
  } else if (match.guessesLog10 <= 4) {
    warning = Options.translations.warnings.similarToCommon
  }
  return warning
}

const getDictionaryWarningWikipedia = (
  match: MatchEstimated,
  isSoleMatch?: Boolean,
) => {
  let warning = ''
  if (isSoleMatch) {
    warning = Options.translations.warnings.wordByItself
  }
  return warning
}

const getDictionaryWarningNames = (
  match: MatchEstimated,
  isSoleMatch?: Boolean,
) => {
  if (isSoleMatch) {
    return Options.translations.warnings.namesByThemselves
  }
  return Options.translations.warnings.commonNames
}

const getDictionaryWarning = (match: MatchEstimated, isSoleMatch?: Boolean) => {
  let warning = ''
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
    warning = Options.translations.warnings.userInputs
  }
  return warning
}

export default (match: MatchEstimated, isSoleMatch?: Boolean) => {
  const warning = getDictionaryWarning(match, isSoleMatch)
  const suggestions: string[] = []
  const word = match.token

  if (word.match(START_UPPER)) {
    suggestions.push(Options.translations.suggestions.capitalization)
  } else if (word.match(ALL_UPPER_INVERTED) && word.toLowerCase() !== word) {
    suggestions.push(Options.translations.suggestions.allUppercase)
  }
  if (match.reversed && match.token.length >= 4) {
    suggestions.push(Options.translations.suggestions.reverseWords)
  }
  if (match.l33t) {
    suggestions.push(Options.translations.suggestions.l33t)
  }
  return {
    warning,
    suggestions,
  }
}
