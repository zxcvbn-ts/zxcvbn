import { DefaultScoringFunction } from '@zxcvbn-ts/core'

// TODO make some more appropriated guesses logic?
const scoring: DefaultScoringFunction = () => {
  return 1
}

export default scoring
