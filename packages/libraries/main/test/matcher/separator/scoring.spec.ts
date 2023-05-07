import { SEPERATOR_CHARS, SEPERATOR_CHAR_COUNT } from '../../../src/data/const'
import separatorGuesses from '../../../src/matcher/separator/scoring'

describe('scoring: guesses separator', () => {
  const data = SEPERATOR_CHARS.map((s) => [s, SEPERATOR_CHAR_COUNT])

  data.forEach(([token, guesses]) => {
    const match = {
      token,
    }
    const msg = `the separator pattern '${token}' has guesses of ${guesses}`

    // eslint-disable-next-line jest/valid-title
    it(msg, () => {
      // @ts-ignore
      expect(separatorGuesses(match)).toEqual(guesses)
    })
  })
})
