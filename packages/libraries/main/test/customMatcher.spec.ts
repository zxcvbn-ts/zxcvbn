import zxcvbnCommonPackage from '../../../languages/common/src'
import zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, ZxcvbnOptions } from '../src'
import { Match } from '../src/types'
import { sorted } from '../src/helper'

ZxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
})

ZxcvbnOptions.matchers.minLength = {
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
  scoring() {
    return 100
  },
}

describe('customMatcher', () => {
  it('should check without userInputs', () => {
    const result = zxcvbn('ep8fkw8ds')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimesDisplay: {
        offlineFastHashing1e10PerSecond: 'less than a second',
        offlineSlowHashing1e4PerSecond: 'less than a second',
        onlineNoThrottling10PerSecond: '10 seconds',
        onlineThrottling100PerHour: '1 hour',
      },
      crackTimesSeconds: {
        offlineFastHashing1e10PerSecond: 1.01e-8,
        offlineSlowHashing1e4PerSecond: 0.0101,
        onlineNoThrottling10PerSecond: 10.1,
        onlineThrottling100PerHour: 3636,
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'You password is not long enough',
      },
      guesses: 101,
      guessesLog10: 2.0043213737826426,
      password: 'ep8fkw8ds',
      score: 0,
      sequence: [
        {
          guesses: 100,
          guessesLog10: 2,
          i: 0,
          j: 8,
          pattern: 'minLength',
          token: 'ep8fkw8ds',
        },
      ],
    })
  })
})
