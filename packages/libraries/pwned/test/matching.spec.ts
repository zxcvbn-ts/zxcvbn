import { matcherPwnedFactory } from '../src/index.ts'
import Options from '../../main/src/Options.ts'

// eslint-disable-next-line @typescript-eslint/require-await
const fetch = jest.fn(async () => ({
  text() {
    return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
  },
}))

describe('pwned matching', () => {
  const options = new Options()
  const matcherPwned = matcherPwnedFactory(fetch as any)
  it('should return a match', async () => {
    const matchPwned = new matcherPwned.Matching(options)
    const match = await matchPwned.match({
      password: 'P4$$w0rd',
      omniMatch: jest.fn as any,
    })
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

  it('should return a scoring', () => {
    const match = matcherPwned.scoring(
      {
        pattern: 'pwned',
        pwnedAmount: 244,
        i: 0,
        j: 10,
        token: 'qwertzuiop',
      },
      options,
    )
    expect(match).toEqual(1)
  })
})
