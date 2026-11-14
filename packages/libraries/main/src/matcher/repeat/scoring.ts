import { MatchEstimated, MatchExtended } from '../../types.ts'

export default ({ baseGuesses, repeatCount }: MatchExtended | MatchEstimated) =>
  baseGuesses * repeatCount
