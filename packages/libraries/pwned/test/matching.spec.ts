import { matcherPwnedFactory } from '../src'
import Options from '../../main/src/Options'

// eslint-disable-next-line @typescript-eslint/require-await
const fetch = jest.fn(async () => ({
  text() {
    return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
  },
}))

describe('pwned matching', () => {
  const options = new Options()
  // @ts-expect-error for testing purposes
  const matcherPwned = matcherPwnedFactory(fetch)
  it('should return a match', async () => {
    // @ts-expect-error for testing purposes
    const matchPwned = new matcherPwned.Matching(options)
    // @ts-expect-error for testing purposes
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
    // @ts-expect-error for testing purposes
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const match = await matcherPwned.scoring({
      pattern: 'pwned',
      pwnedAmount: 244,
    })
    expect(match).toEqual(1)
  })
})
