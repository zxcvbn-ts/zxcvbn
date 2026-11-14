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

it('scoring: utils factorial extends its table for a larger n', () => {
  expect(factorial(20)).toEqual(2432902008176640000)
  expect(factorial(3)).toEqual(6)
})
