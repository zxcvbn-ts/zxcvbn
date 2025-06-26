import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import MatchOmni from '../src/Matching'
import Options from '../src/Options'
import { MatchExtended } from '../src/types'

const zxcvbnOptions = new Options({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
})

describe('omnimatch matching', () => {
  const omniMatch = new MatchOmni(zxcvbnOptions)

  it("doesn't match ''", () => {
    expect(omniMatch.match('')).toEqual([])
  })

  const password = 'r0sebudmaelstrom11/20/91aaaa'
  const matches = omniMatch.match(password) as MatchExtended[]
  const data: [string, [number, number]][] = [
    ['dictionary', [0, 6]],
    ['dictionary', [7, 14]],
    ['date', [16, 23]],
    ['repeat', [24, 27]],
  ]

  data.forEach(([patternName, [i, j]]) => {
    let included = false
    matches.forEach((match) => {
      if (match.i === i && match.j === j && match.pattern === patternName) {
        included = true
      }
    })
    const msg = `for ${password}, matches a ${patternName} pattern at [${i}, ${j}]`

    it(msg, () => {
      expect(included).toBeTruthy()
    })
  })
})
