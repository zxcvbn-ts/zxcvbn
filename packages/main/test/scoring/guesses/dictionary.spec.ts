import dictionaryGuesses from '../../../src/scoring/guesses/dictionary'
import l33tVariant from '../../../src/scoring/variant/l33t'
import uppercaseVariant from '../../../src/scoring/variant/uppercase'

const baseMatch = {
  reversed: false,
  l33t: false,
  sub: {},
  rank: 32,
}

describe('scoring: guesses dictionary', () => {
  it('base guesses == the rank', () => {
    const match = {
      ...baseMatch,
      token: 'aaaaa',
    }
    const result = 32
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 1,
      uppercaseVariations: 1,
    })
  })

  it('extra guesses are added for capitalization', () => {
    const match = {
      ...baseMatch,
      token: 'AAAaaa',
    }
    const result = 32 * uppercaseVariant(match.token)
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 1,
      uppercaseVariations: 41,
    })
  })

  it('guesses are doubled when word is reversed', () => {
    const match = {
      ...baseMatch,
      token: 'aaa',
      reversed: true,
    }
    const result = 32 * 2
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 1,
      uppercaseVariations: 1,
    })
  })

  it('extra guesses are added for common l33t substitutions', () => {
    const match = {
      ...baseMatch,
      token: 'aaa@@@',
      l33t: true,
      sub: {
        '@': 'a',
      },
    }
    const result = 32 * l33tVariant(match)
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 41,
      uppercaseVariations: 1,
    })
  })

  it('extra guesses are added for both capitalization and common l33t substitutions', () => {
    const match = {
      ...baseMatch,
      token: 'AaA@@@',
      l33t: true,
      sub: {
        '@': 'a',
      },
    }
    const result = 32 * l33tVariant(match) * uppercaseVariant(match.token)
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 41,
      uppercaseVariations: 3,
    })
  })
})
