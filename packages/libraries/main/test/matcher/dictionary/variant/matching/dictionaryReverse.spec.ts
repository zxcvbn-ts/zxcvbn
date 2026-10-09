import MatchDictionaryReverse from '../../../../../src/matcher/dictionary/variants/matching/reverse'
import checkMatches from '../../../../helper/checkMatches'
import Options from '../../../../../src/Options'

describe('dictionary reverse matching', () => {
  const testDicts = {
    d1: [123, 321, 456, 654],
  }
  const zxcvbnOptions = new Options({
    dictionary: testDicts,
  })
  const matchDictionaryReverse = new MatchDictionaryReverse(zxcvbnOptions)
  const password = '0123456789'
  const matches = matchDictionaryReverse.match({ password })
  const msg = 'matches against reversed words'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'dictionary',
    patterns: ['123', '456'],
    ijs: [
      [1, 3],
      [4, 6],
    ],
    propsToCheck: {
      matchedWord: ['321', '654'],
      reversed: [true, true],
      dictionaryName: ['d1', 'd1'],
      rank: [2, 4],
    },
  })

  it('finds a Levenshtein fuzzy match against a reversed dictionary word', () => {
    const levenshteinOptions = new Options({
      dictionary: { words: ['elephant'] },
      useLevenshteinDistance: true,
    })
    const levenshteinMatchReverse = new MatchDictionaryReverse(
      levenshteinOptions,
    )
    // 'tnahpala' is 'alaphant' (a typo of 'elephant') spelled backward.
    const matches = levenshteinMatchReverse.match({ password: 'tnahpala' })
    expect(matches).toEqual([
      expect.objectContaining({
        dictionaryName: 'words',
        reversed: true,
        matchedWord: 'tnahpala',
        levenshteinDistance: 2,
        levenshteinDistanceEntry: 'elephant',
      }),
    ])
  })

  it('matches a reversed dictionary word containing an astral (surrogate-pair) character', () => {
    const astralOptions = new Options({
      dictionary: { words: ['𝕒bc'] },
    })
    const astralMatchReverse = new MatchDictionaryReverse(astralOptions)
    expect(astralMatchReverse.match({ password: 'cb𝕒' })).toEqual([
      {
        dictionaryName: 'words',
        i: 0,
        j: 3,
        l33t: false,
        matchedWord: '𝕒bc',
        pattern: 'dictionary',
        rank: 1,
        reversed: true,
        token: 'cb𝕒',
      },
    ])
  })
})
