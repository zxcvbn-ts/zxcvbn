import { ZxcvbnFactory } from '../../main/src'
import { matcherPwnedFactory } from '../src'

describe('main', () => {
  it('should use pwned matcher', async () => {
    const fetch = jest.fn(async () => ({
      text() {
        return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
      },
    }))
    const zxcvbn = new ZxcvbnFactory(
      {},
      {
        // @ts-ignore
        pwned: matcherPwnedFactory(fetch),
      },
    )
    const result = await zxcvbn.checkAsync('P4$$w0rd')

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
        offlineFastHashingXPerSecond: 2e-10,
        offlineSlowHashingXPerSecond: 0.0002,
        onlineNoThrottlingXPerSecond: 0.2,
        onlineThrottlingXPerHour: 72,
      },
      crackTimesBase: {
        offlineFastHashingXPerSecond: null,
        offlineSlowHashingXPerSecond: null,
        onlineNoThrottlingXPerSecond: null,
        onlineThrottlingXPerHour: 1,
      },

      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'ltSecond',
        offlineSlowHashingXPerSecond: 'ltSecond',
        onlineNoThrottlingXPerSecond: 'ltSecond',
        onlineThrottlingXPerHour: 'minute',
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
    const zxcvbn = new ZxcvbnFactory(
      {},
      {
        // @ts-ignore
        pwned: matcherPwnedFactory(fetch),
      },
    )
    const result = await zxcvbn.checkAsync('P4$$w0rd')
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
      crackTimesBase: {
        offlineFastHashingXPerSecond: null,
        offlineSlowHashingXPerSecond: 3,
        onlineNoThrottlingXPerSecond: 4,
        onlineThrottlingXPerHour: null,
      },
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'ltSecond',
        offlineSlowHashingXPerSecond: 'hours',
        onlineNoThrottlingXPerSecond: 'months',
        onlineThrottlingXPerHour: 'centuries',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 0.0100000001,
        offlineSlowHashingXPerSecond: 10000.0001,
        onlineNoThrottlingXPerSecond: 10000000.1,
        onlineThrottlingXPerHour: 3600000036,
      },
      score: 2,
      feedback: {
        suggestions: ['anotherWord'],
        warning: null,
      },
    })
  })
})
