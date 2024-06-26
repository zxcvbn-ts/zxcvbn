import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { ZxcvbnFactory } from '../src'
import { Match, Matcher } from '../src/types'
import { sorted } from '../src/utils/helper'
import Options from '../src/Options'

const minLengthMatcher: Matcher = {
  Matching: class MatchMinLength {
    constructor(private options: Options) {}

    minLength = 10

    match({ password }: { password: string }) {
      const matches: Match[] = []
      if (password.length <= this.minLength) {
        matches.push({
          pattern: 'minLength',
          token: password,
          i: 0,
          j: password.length - 1,
        })
      }
      return sorted(matches)
    }
  },
  feedback() {
    return {
      warning: 'You password is not long enough',
      suggestions: [],
    }
  },
  scoring(match) {
    return match.token.length * 10
  },
}
describe('customMatcher', () => {
  const zxcvbn = new ZxcvbnFactory(
    {
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    },
    {
      minLength: minLengthMatcher,
    },
  )
  it('should use minLength custom matcher', () => {
    const result = zxcvbn.check('ep8fkw8ds')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 9.1e-9,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.0091,
        },
        onlineNoThrottlingXPerSecond: {
          base: 9,
          display: '9 seconds',
          seconds: 9.1,
        },
        onlineThrottlingXPerHour: {
          base: 55,
          display: '55 minutes',
          seconds: 3276,
        },
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'You password is not long enough',
      },
      guesses: 91,
      guessesLog10: 1.9590413923210932,
      password: 'ep8fkw8ds',
      score: 0,
      sequence: [
        {
          guesses: 90,
          guessesLog10: 1.9542425094393248,
          i: 0,
          j: 8,
          pattern: 'minLength',
          token: 'ep8fkw8ds',
        },
      ],
    })
  })
})
