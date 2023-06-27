import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, zxcvbnOptions } from '../src'
import { Match, Matcher } from '../src/types'
import { sorted } from '../src/helper'

zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
})

const minLengthMatcher: Matcher = {
  Matching: class MatchMinLength {
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

zxcvbnOptions.addMatcher('minLength', minLengthMatcher)

describe('customMatcher', () => {
  it('should use minLength custom matcher', () => {
    const result = zxcvbn('ep8fkw8ds')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: 'less than a second',
        onlineNoThrottlingXPerSecond: '9 seconds',
        onlineThrottlingXPerHour: '55 minutes',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 9.1e-9,
        offlineSlowHashingXPerSecond: 0.0091,
        onlineNoThrottlingXPerSecond: 9.1,
        onlineThrottlingXPerHour: 3276,
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
