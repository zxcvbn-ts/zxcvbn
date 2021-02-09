import MatchOmni from '../../src/Matching'
import Options from '../../src/Options'
import zxcvbnCommonPackage from '../../../common/src/index'
import zxcvbnEnPackage from '../../../en/src/index'
import { ExtendedMatch } from '../../src/types'

Options.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
})

describe('omnimatch matching', () => {
  const omniMatch = new MatchOmni()

  it("doesn't match ''", () => {
    const matches = omniMatch.match('')
    expect(matches).toEqual([])
  })

  const password = 'r0sebudmaelstrom11/20/91aaaa'
  const matches = omniMatch.match(password)
  const data = [
    ['dictionary', [0, 6]],
    ['dictionary', [7, 14]],
    ['date', [16, 23]],
    ['repeat', [24, 27]],
  ]

  data.forEach(([patternName, [i, j]]) => {
    let included = false
    matches.forEach((match: ExtendedMatch) => {
      if (match.i === i && match.j === j && match.pattern === patternName) {
        included = true
      }
    })
    const msg = `for ${password}, matches a ${patternName} pattern at [${i}, ${j}]`
    // eslint-disable-next-line jest/valid-title
    it(msg, () => {
      expect(included).toBeTruthy()
    })
  })
})
