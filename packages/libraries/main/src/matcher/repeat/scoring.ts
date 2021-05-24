import { MatchEstimated, MatchExtended } from '../../types'

export default ({ baseGuesses, repeatCount }: MatchExtended | MatchEstimated) =>
  baseGuesses * repeatCount
