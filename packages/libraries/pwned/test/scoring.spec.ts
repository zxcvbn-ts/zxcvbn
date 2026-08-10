import pwned from '../src/scoring.ts'

describe('scoring: guesses pwned', () => {
  it('should score low for highest used password', () => {
    const match = {
      pwnedAmount: 1,
    }
    expect(pwned(match as any, {} as any)).toEqual(1)
  })
})
