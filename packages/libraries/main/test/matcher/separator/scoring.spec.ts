import { SEPARATOR_CHARS, SEPARATOR_CHAR_COUNT } from '../../../src/data/const'
import separatorGuesses from '../../../src/matcher/separator/scoring'

describe('scoring: guesses separator', () => {
  const data = SEPARATOR_CHARS.map((s) => [s, SEPARATOR_CHAR_COUNT])

  data.forEach(([token, guesses]) => {
    const match = {
      token,
    }
    const msg = `the separator pattern '${token}' has guesses of ${guesses}`

    it(msg, () => {
      // @ts-expect-error for testing purposes
      expect(separatorGuesses(match)).toEqual(guesses)
    })
  })
})
