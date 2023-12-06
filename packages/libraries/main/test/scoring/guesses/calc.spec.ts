import estimate from '../../../src/scoring/estimate'
import dateGuesses from '../../../src/matcher/date/scoring'
import { Options } from '../../../src'

describe('scoring', () => {
  const zxcvbnOptions = new Options()
  it('estimate_guesses returns cached guesses when available', () => {
    const match = {
      guesses: 1,
    }
    // @ts-ignore
    expect(estimate(zxcvbnOptions, match, '')).toEqual({
      guesses: 1,
    })
  })

  it('estimate_guesses delegates based on pattern', () => {
    const match = {
      pattern: 'date',
      token: '1977',
      year: 1977,
      month: 7,
      day: 14,
    }
    // @ts-ignore
    expect(estimate(zxcvbnOptions, match, '1977')).toEqual({
      pattern: 'date',
      token: '1977',
      year: 1977,
      month: 7,
      day: 14,
      // @ts-ignore
      guesses: dateGuesses(match),
      guessesLog10: 4.225050696138048,
    })
  })
})
