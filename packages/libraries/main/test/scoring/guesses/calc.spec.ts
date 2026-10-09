import estimate from '../../../src/scoring/estimate'
import dateGuesses from '../../../src/matcher/date/scoring'
import Options from '../../../src/Options'
import { MatcherBaseClass } from '../../../src/types'

describe('scoring', () => {
  const zxcvbnOptions = new Options()
  it('estimate_guesses returns cached guesses when available', () => {
    const match = {
      guesses: 1,
    }
    // @ts-expect-error for testing purposes
    expect(estimate(zxcvbnOptions, match, '')).toEqual({
      guesses: 1,
    })
  })

  it('falls back to zero base guesses for a custom pattern with a non-numeric scoring result', () => {
    const customOptions = new Options(
      {},
      {
        custom: {
          Matching: class extends MatcherBaseClass {
            match() {
              return []
            }
          },
          feedback: () => ({ warning: null, suggestions: [] }),
          scoring: () => ({ notANumber: true }) as unknown as number,
        },
      },
    )
    const match = { pattern: 'custom', token: 'abcdefgh' }
    // @ts-expect-error for testing purposes
    const result = estimate(customOptions, match, 'abcdefgh')
    expect(result.guesses).toEqual(1)
  })

  it('estimate_guesses delegates based on pattern', () => {
    const usedYear = new Date().getFullYear() - 46
    const match = {
      pattern: 'date',
      token: usedYear.toString(),
      year: usedYear,
      month: 7,
      day: 14,
    }
    // @ts-expect-error for testing purposes
    expect(estimate(zxcvbnOptions, match, '1977')).toEqual({
      pattern: 'date',
      token: usedYear.toString(),
      year: usedYear,
      month: 7,
      day: 14,
      // @ts-expect-error for testing purposes
      guesses: dateGuesses(match),
      guessesLog10: 4.225050696138048,
    })
  })
})
