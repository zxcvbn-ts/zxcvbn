import MatchDictionaryReverse from '../../../../../src/matcher/dictionary/variants/matching/reverse'
import MatchDictionary from '../../../../../src/matcher/dictionary/matching'
import checkMatches from '../../../../helper/checkMatches'
import { zxcvbnOptions } from '../../../../../src/Options'

zxcvbnOptions.setOptions()
const dictionaryMatcher = new MatchDictionary()

describe('dictionary reverse matching', () => {
  const testDicts = {
    d1: [123, 321, 456, 654],
  }
  zxcvbnOptions.setOptions({
    dictionary: testDicts,
  })
  const matchDictionaryReverse = new MatchDictionaryReverse(
    dictionaryMatcher.defaultMatch,
  )
  const password = '0123456789'
  const matches = matchDictionaryReverse.match({ password })
  const msg = 'matches against reversed words'
  checkMatches(
    msg,
    matches,
    'dictionary',
    ['456', '123'],
    [
      [4, 6],
      [1, 3],
    ],
    {
      matchedWord: ['654', '321'],
      reversed: [true, true],
      dictionaryName: ['d1', 'd1'],
      rank: [4, 2],
    },
  )
})
