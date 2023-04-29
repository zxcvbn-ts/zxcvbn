import { SPECIAL_CHAR_COUNT } from '../../../src/data/const'
import separatorGuesses from '../../../src/matcher/separator/scoring'

describe('scoring: guesses separator', () => {
  const data = [
    [' ', SPECIAL_CHAR_COUNT],
    ['%', SPECIAL_CHAR_COUNT],
    ['-', SPECIAL_CHAR_COUNT],
    ['.', SPECIAL_CHAR_COUNT],
    ['_', SPECIAL_CHAR_COUNT],
  ]

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
