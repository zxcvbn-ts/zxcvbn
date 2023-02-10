import { zxcvbnOptions } from '@zxcvbn-ts/core/src'
import { matcherPwnedFactory } from '../src'

const fetch = jest.fn(async () => ({
  text() {
    return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
  },
}))

describe('pwned matching', () => {
  // @ts-ignore
  const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
  it('should return a match', async () => {
    const matchPwned = new matcherPwned.Matching()
    // @ts-ignore
    const match = await matchPwned.match({ password: 'P4$$w0rd' })
    expect(match).toEqual([
      {
        i: 0,
        j: 7,
        pattern: 'pwned',
        pwnedAmount: 244,
        token: 'P4$$w0rd',
      },
    ])
  })

  it('should return a scoring', async () => {
    // @ts-ignore
    const match = await matcherPwned.scoring({
      pattern: 'pwned',
      pwnedAmount: 244,
    })
    expect(match).toEqual(1)
  })
})
