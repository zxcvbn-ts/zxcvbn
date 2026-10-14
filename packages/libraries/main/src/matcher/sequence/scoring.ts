import { MatchEstimated, MatchExtended } from '../../types'

export default ({ token, ascending }: MatchExtended | MatchEstimated) => {
  const firstChr = token.charAt(0)
  let baseGuesses
  const startingPoints = ['a', 'A', 'z', 'Z', '0', '1', '9']
  // lower guesses for obvious starting points
  if (startingPoints.includes(firstChr)) {
    baseGuesses = 4
  } else if (/\d/.exec(firstChr)) {
    baseGuesses = 10 // digits
  } else {
    // could give a higher base for uppercase,
    // assigning 26 to both upper and lower sequences is more conservative.
    baseGuesses = 26
  }
  // need to try a descending sequence in addition to every ascending sequence ->
  // 2x guesses
  if (!ascending) {
    baseGuesses *= 2
  }
  // count Unicode code points rather than UTF-16 code units, so a surrogate
  // pair (eg. an astral-plane character) counts as one character instead of two
  return baseGuesses * Array.from(token).length
}
