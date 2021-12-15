import { zxcvbn, ZxcvbnOptions } from '../../main/src'
import matcherPwnedFactory from '../src'

const fetch = jest.fn(() => ({
  text() {
    return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
  },
}))

describe('main', () => {
  beforeAll(() => {
    const matcherPwned = matcherPwnedFactory(fetch)
    ZxcvbnOptions.addMatcher('pwned', matcherPwned)
  })

  it('should use pwned matcher', async () => {
    const result = await zxcvbn('P4$$w0rd')

    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      password: 'P4$$w0rd',
      calcTime: 0,
      guesses: 2,
      guessesLog10: 0.30102999566398114,
      sequence: [
        {
          guesses: 1,
          guessesLog10: 0,
          i: 0,
          j: 7,
          pattern: 'pwned',
          pwnedAmount: 244,
          token: 'P4$$w0rd',
        },
      ],
      crackTimesSeconds: {
        offlineFastHashing1e10PerSecond: 2e-10,
        offlineSlowHashing1e4PerSecond: 0.0002,
        onlineNoThrottling10PerSecond: 0.2,
        onlineThrottling100PerHour: 72,
      },
      crackTimesDisplay: {
        offlineFastHashing1e10PerSecond: 'ltSecond',
        offlineSlowHashing1e4PerSecond: 'ltSecond',
        onlineNoThrottling10PerSecond: 'ltSecond',
        onlineThrottling100PerHour: 'minute',
      },
      score: 0,
      feedback: {
        warning: 'pwned',
        suggestions: ['anotherWord', 'pwned'],
      },
    })
  })
})
