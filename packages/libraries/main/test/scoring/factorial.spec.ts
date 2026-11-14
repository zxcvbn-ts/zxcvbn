import utils from '../../src/scoring/utils'

const { factorial } = utils

describe('scoring: utils factorial', () => {
  const data = [
    [0, 1],
    [1, 1],
    [2, 2],
    [5, 120],
    [10, 3628800],
  ]
  data.forEach(([n, result]) => {
    it(`${n}! is ${result}`, () => {
      expect(factorial(n)).toEqual(result)
    })
  })
})
