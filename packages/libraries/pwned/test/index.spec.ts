import { zxcvbnAsync, zxcvbnOptions } from '../../main/src'
import matcherPwnedFactory from '../src'

describe('main', () => {
  it('should use pwned matcher', async () => {
    const fetch = jest.fn(async () => ({
      text() {
        return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
      },
    }))
    // @ts-ignore
    zxcvbnOptions.matchers.pwned = matcherPwnedFactory(fetch, zxcvbnOptions)
    const result = await zxcvbnAsync('P4$$w0rd')

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

  it('should ignore pwned matcher on fetch error', async () => {
    const fetch = jest.fn(async () => {
      throw new Error('Some Network error')
    })
    zxcvbnOptions.matchers.pwned = matcherPwnedFactory(fetch, zxcvbnOptions)
    const result = await zxcvbnAsync('P4$$w0rd')

    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      password: 'P4$$w0rd',
      calcTime: 0,
      guesses: 100000001,
      guessesLog10: 8.000000004342944,
      sequence: [
        {
          guesses: 100000000,
          guessesLog10: 8,
          i: 0,
          j: 7,
          pattern: 'bruteforce',
          token: 'P4$$w0rd',
        },
      ],
      crackTimesDisplay: {
        offlineFastHashing1e10PerSecond: 'ltSecond',
        offlineSlowHashing1e4PerSecond: 'hours',
        onlineNoThrottling10PerSecond: 'months',
        onlineThrottling100PerHour: 'centuries',
      },
      crackTimesSeconds: {
        offlineFastHashing1e10PerSecond: 0.0100000001,
        offlineSlowHashing1e4PerSecond: 10000.0001,
        onlineNoThrottling10PerSecond: 10000000.1,
        onlineThrottling100PerHour: 3600000036,
      },
      score: 2,
      feedback: {
        suggestions: ['anotherWord'],
        warning: '',
      },
    })
  })
})
