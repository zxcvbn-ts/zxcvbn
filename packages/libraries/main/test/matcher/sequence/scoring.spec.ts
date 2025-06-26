import sequenceGuesses from '../../../src/matcher/sequence/scoring'

describe('scoring: guesses sequence', () => {
  const data = [
    ['ab', true, 4 * 2], // obvious start * len-2
    ['XYZ', true, 26 * 3], // base26 * len-3
    ['4567', true, 10 * 4], // base10 * len-4
    ['7654', false, 10 * 4 * 2], // base10 * len 4 * descending
    ['ZYX', false, 4 * 3 * 2], // obvious start * len-3 * descending
  ]

  data.forEach(([token, ascending, guesses]) => {
    const match = {
      token,
      ascending,
    }
    const msg = `the sequence pattern '${token}' has guesses of ${guesses}`

    it(msg, () => {
      // @ts-expect-error for testing purposes
      expect(sequenceGuesses(match)).toEqual(guesses)
    })
  })
})
