import dictionaryGuesses from '../../../src/matcher/dictionary/scoring'
import l33tVariant from '../../../src/matcher/dictionary/variants/scoring/l33t'
import uppercaseVariant from '../../../src/matcher/dictionary/variants/scoring/uppercase'

const baseMatch = {
  pattern: 'dictionary',
  reversed: false,
  l33t: false,
  sub: {},
  rank: 32,
  dictionaryName: 'someDictionary',
}

describe('scoring: guesses dictionary', () => {
  it('base guesses == the rank', () => {
    const match = {
      ...baseMatch,
      token: 'aaaaa',
    }
    const result = 32
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
    const result = 32 * l33tVariant(match)
    // @ts-ignore
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
    // @ts-ignore
    const result = 32 * l33tVariant(match) * uppercaseVariant(match.token)
    // @ts-ignore
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: result,
      l33tVariations: 41,
      uppercaseVariations: 3,
    })
  })

  it('special scoring for diceware findings', () => {
    const match = {
      ...baseMatch,
      dictionaryName: 'diceware',
      token: 'AaA@@@',
    }
    // @ts-ignore
    expect(dictionaryGuesses(match)).toEqual({
      baseGuesses: 32,
      calculation: 3888,
      l33tVariations: 1,
      uppercaseVariations: 3,
    })
  })
})
