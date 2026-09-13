import { SEPERATOR_CHAR_COUNT } from '../../data/const'
import { MatchEstimated, MatchExtended } from '../../types'
import uppercaseVariations from '../dictionary/variants/scoring/uppercase'

// ordered selections of wordCount entries out of a pool of poolSize user inputs
const orderedSelections = (poolSize: number, wordCount: number) => {
  if (wordCount > poolSize) {
    return poolSize ** wordCount
  }

  let selections = 1
  for (let i = 0; i < wordCount; i += 1) {
    selections *= poolSize - i
  }
  return selections
}

// picking the separator character, plus how often it is repeated
const gapVariations = (separator: string) => {
  const isRepeatedChar = separator
    .split('')
    .every((char) => char === separator[0])

  return isRepeatedChar
    ? SEPERATOR_CHAR_COUNT * separator.length
    : SEPERATOR_CHAR_COUNT ** separator.length
}

const separatorVariations = (separators: string[]) => {
  if (separators.length === 0) {
    return 1
  }

  const isSingleSeparator = separators.every(
    (separator) => separator === separators[0],
  )

  return isSingleSeparator
    ? gapVariations(separators[0])
    : separators.reduce(
        (variations, separator) => variations * gapVariations(separator),
        1,
      )
}

export default (match: MatchExtended | MatchEstimated): number => {
  if (match.pattern !== 'userInputSequence') {
    return 0
  }

  const casingVariations = match.words.reduce(
    (variations: number, word: string) =>
      variations * uppercaseVariations(word),
    1,
  )

  return (
    orderedSelections(match.userInputCount, match.wordCount) *
    casingVariations *
    separatorVariations(match.separators)
  )
}
