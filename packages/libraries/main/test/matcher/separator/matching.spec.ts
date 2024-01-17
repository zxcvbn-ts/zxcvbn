import MatchSeparator from '../../../src/matcher/separator/matching'
import checkMatches from '../../helper/checkMatches'
import Options from '../../../src/Options'

describe('separator matching', () => {
  const zxcvbnOptions = new Options()
  const matchSeparator = new MatchSeparator(zxcvbnOptions)

  it("doesn't match length separators", () => {
    const data = ['']

    data.forEach((password) => {
      expect(matchSeparator.match({ password })).toEqual([])
    })
  })

  let matches = matchSeparator.match({ password: 'first second third' })
  let msg = 'matches same separators'

  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'separator',
    patterns: [' ', ' '],
    ijs: [
      [5, 5],
      [12, 12],
    ],
    propsToCheck: {},
  })

  matches = matchSeparator.match({ password: 'first-second-third,&' })
  msg = 'matches with different potential separators'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'separator',
    patterns: ['-', '-'],
    ijs: [
      [5, 5],
      [12, 12],
    ],
    propsToCheck: {},
  })
})
