import uppercaseVariant from './variants/scoring/uppercase'
import l33tVariant from './variants/scoring/l33t'
import { MatchEstimated, MatchExtended } from '../../types'

export interface DictionaryReturn {
  baseGuesses: number
  uppercaseVariations: number
  l33tVariations: number
  calculation: number
}

export default ({
  rank,
  reversed,
  l33t,
  subs,
  token,
  dictionaryName,
}: MatchExtended | MatchEstimated): DictionaryReturn => {
  const baseGuesses = rank // keep these as properties for display purposes
  const uppercaseVariations = uppercaseVariant(token)
  const l33tVariations = l33tVariant({ l33t, subs, token })
  const reversedVariations = (reversed && 2) || 1
  let calculation
  if (dictionaryName === 'diceware') {
    // diceware dictionaries are special, so we get a simple scoring of 1/2 of 6^5 (6 digits on 5 dice)
    // to get fix entropy of ~12.9 bits for every entry https://en.wikipedia.org/wiki/Diceware#:~:text=The%20level%20of,bits
    calculation = 6 ** 5 / 2
  } else {
    calculation =
      baseGuesses * uppercaseVariations * l33tVariations * reversedVariations
  }
  return {
    baseGuesses,
    uppercaseVariations,
    l33tVariations,
    calculation,
  }
}
