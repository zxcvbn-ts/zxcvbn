import MatchPwned from '~/matching/Pwned'
import Options from '~/Options'

Options.setOptions({
  fetch: jest.fn(() => {
    return {
      text() {
        return `008A205652858375D71117A63004CC75167:5\r\n3EA386688A0147AB736AABCEDE496610382:244`
      },
    }
  }),
})

describe('pwned matching', () => {
  const matchPwned = new MatchPwned()

  it('should return a match', async () => {
    const match = await matchPwned.match('P4$$w0rd')
    expect(match).toEqual([{ pattern: 'pwned', pwnedAmount: 244 }])
  })
})
