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

  it('applies the single-character minimum to a lone emoji submatch', () => {
    const match = { pattern: 'bruteforce', token: '😀', i: 6, j: 7 }
    const result = estimate(zxcvbnOptions, match, 'abcdef😀')
    // bruteforce: 10 ** 1 = 10, raised to MIN_SUBMATCH_GUESSES_SINGLE_CHAR + 1
    expect(result.guesses).toEqual(11)
  })

  it('writes the estimate onto the given match and reuses it', () => {
    const match = { pattern: 'bruteforce', token: 'abc', i: 0, j: 2 }
    const result = estimate(zxcvbnOptions, match, 'abc')
    expect(result).toBe(match)
    expect(match).toEqual({
      pattern: 'bruteforce',
      token: 'abc',
      i: 0,
      j: 2,
      guesses: 1000,
      guessesLog10: expect.closeTo(3),
    })
    // a cached estimate isn't recalculated, even for another password
    expect(estimate(zxcvbnOptions, match, 'abcdef').guesses).toEqual(1000)
  })
})
