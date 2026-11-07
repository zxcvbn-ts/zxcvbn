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
    patterns: ['456', '123'],
    ijs: [
      [4, 6],
      [1, 3],
    ],
    propsToCheck: {
      matchedWord: ['654', '321'],
      reversed: [true, true],
      dictionaryName: ['d1', 'd1'],
      rank: [4, 2],
    },
  })
})

describe('dictionary reverse matching with surrogate pairs', () => {
  const testDicts = {
    d1: ['pass😀word'],
  }
  const zxcvbnOptions = new Options({
    dictionary: testDicts,
  })
  const matchDictionaryReverse = new MatchDictionaryReverse(zxcvbnOptions)
  // 'drow😀ssap' read backwards by whole characters is 'pass😀word', the
  // dictionary entry above - but reversing by UTF-16 code unit splits the
  // emoji's surrogate pair apart and corrupts it.
  const password = 'drow😀ssap'
  const matches = matchDictionaryReverse.match({ password })
  const msg = 'matches a reversed word containing a surrogate pair'

  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'dictionary',
    patterns: [password],
    ijs: [[0, password.length - 1]],
    propsToCheck: {
      matchedWord: ['pass😀word'],
      reversed: [true],
      dictionaryName: ['d1'],
      rank: [1],
    },
  })
})
