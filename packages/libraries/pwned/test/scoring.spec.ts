import pwned from '../src/scoring'

describe('scoring: guesses pwned', () => {
  it('should score low for highest used password', () => {
    const match = {
      pwnedAmount: 1,
    }
    // @ts-ignore
    expect(pwned(match)).toEqual(1)
  })
})
