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
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'ltSecond',
          seconds: 2e-10,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'ltSecond',
          seconds: 0.0002,
        },
        onlineNoThrottlingXPerSecond: {
          base: null,
          display: 'ltSecond',
          seconds: 0.2,
        },
        onlineThrottlingXPerHour: {
          base: 1,
          display: 'minute',
          seconds: 72,
        },
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
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'ltSecond',
          seconds: 0.0100000001,
        },
        offlineSlowHashingXPerSecond: {
          base: 3,
          display: 'hours',
          seconds: 10000.0001,
        },
        onlineNoThrottlingXPerSecond: {
          base: 4,
          display: 'months',
          seconds: 10000000.1,
        },
        onlineThrottlingXPerHour: {
          base: null,
          display: 'centuries',
          seconds: 3600000036,
        },
      },
      score: 2,
      feedback: {
        suggestions: ['anotherWord'],
        warning: null,
      },
    })
  })
})
