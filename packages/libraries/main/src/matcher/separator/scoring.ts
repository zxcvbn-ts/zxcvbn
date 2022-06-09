import { VALID_SEPARATORS } from '../../data/const'
import { MatchEstimated, MatchExtended } from '../../types'

const validSeparatorsLength = VALID_SEPARATORS.length

export default ({ token }: MatchExtended | MatchEstimated) => {
  return validSeparatorsLength * token.length
}
