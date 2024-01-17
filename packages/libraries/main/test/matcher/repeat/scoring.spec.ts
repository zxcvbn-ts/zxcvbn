import repeatGuesses from '../../../src/matcher/repeat/scoring'
import Scoring from '../../../src/scoring'
import MatchOmni from '../../../src/Matching'
import Options from '../../../src/Options'
import { MatchExtended } from '../../../src/types'

const zxcvbnOptions = new Options()
const omniMatch = new MatchOmni(zxcvbnOptions)
describe('scoring guesses repeated', () => {
  const scoring = new Scoring(zxcvbnOptions)
  const data: [string, string, number][] = [
    ['aa', 'a', 2],
    ['999', '9', 3],
    ['$$$$', '$', 4],
    ['abab', 'ab', 2],
    ['batterystaplebatterystaplebatterystaple', 'batterystaple', 3],
  ]

  data.forEach(([token, baseToken, repeatCount]) => {
    const baseGuesses = scoring.mostGuessableMatchSequence(
      baseToken,
      omniMatch.match(baseToken) as MatchExtended[],
    ).guesses
    const match = {
      token,
      baseToken,
      baseGuesses,
      repeatCount,
    }

    const expectedGuesses = baseGuesses * repeatCount
    const msg = `the repeat pattern '${token}' has guesses of ${expectedGuesses}`

    // eslint-disable-next-line jest/valid-title
    it(msg, () => {
      // @ts-ignore
      expect(repeatGuesses(match)).toEqual(expectedGuesses)
    })
  })
})
