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
  sub,
  token,
}: MatchExtended | MatchEstimated): DictionaryReturn => {
  const baseGuesses = rank // keep these as properties for display purposes
  const uppercaseVariations = uppercaseVariant(token)
  const l33tVariations = l33tVariant({ l33t, sub, token })
  const reversedVariations = (reversed && 2) || 1
  const calculation =
    baseGuesses * uppercaseVariations * l33tVariations * reversedVariations
  return {
    baseGuesses,
    uppercaseVariations,
    l33tVariations,
    calculation,
  }
}
