import pwned, {
  PWNED_PASSWORD_AMOUNT,
} from '../../../src/matcher/pwned/scoring'

describe.skip('scoring: guesses date', () => {
  it('should score low for highest used password', () => {
    const match = {
      pwnedAmount: 1,
    }
    // @ts-ignore
    expect(pwned(match)).toEqual(198)
  })

  it('should score high for lowest used password', () => {
    const match = {
      pwnedAmount: PWNED_PASSWORD_AMOUNT,
    }
    // @ts-ignore
    expect(pwned(match)).toEqual(39594)
  })
})
