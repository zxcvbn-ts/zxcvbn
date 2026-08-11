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
})
