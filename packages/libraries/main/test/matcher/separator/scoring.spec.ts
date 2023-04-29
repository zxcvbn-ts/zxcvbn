import separatorGuesses from '../../../src/matcher/separator/scoring'

describe('scoring: guesses separator', () => {
  const data = [
    [' ', 1],
    ['%', 1],
    ['-', 1],
    ['.', 1],
    ['_', 1],
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
