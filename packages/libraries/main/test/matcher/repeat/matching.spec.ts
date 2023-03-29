import MatchRepeat from '../../../src/matcher/repeat/matching'
import checkMatches from '../../helper/checkMatches'
import genpws from '../../helper/genpws'
import MatchOmni from '../../../src/Matching'
import { zxcvbnOptions } from '../../../src/Options'
import { RepeatMatch } from '../../../src/types'

zxcvbnOptions.setOptions()
const omniMatch = new MatchOmni()
describe('repeat matching', () => {
  const matchRepeat = new MatchRepeat()

  it("doesn't match length repeat patterns", () => {
    const data = ['', '#']
    data.forEach((password) => {
      expect(matchRepeat.match({ password, omniMatch })).toEqual([])
    })
  })

  const prefixes = ['@', 'y4@']
  const suffixes = ['u', 'u%7']
  let pattern = '&&&&&'
  const generatedGenPws = genpws(pattern, prefixes, suffixes)

  generatedGenPws.forEach(([password, i, j]) => {
    const matches = matchRepeat.match({ password, omniMatch }) as RepeatMatch[]
    const msg = 'matches embedded repeat patterns'
    checkMatches(msg, matches, 'repeat', [pattern], [[i, j]], {
      baseToken: ['&'],
    })
  })

  const ref1 = [3, 12]
  const ref2 = ['a', 'Z', '4', '&']
  ref1.forEach((length) => {
    ref2.forEach((chr) => {
      const patternChr = Array(length + 1).join(chr)
      const matches = matchRepeat.match({
        password: patternChr,
        omniMatch,
      }) as RepeatMatch[]
      const msg = `matches repeats with base character '${chr}'`
      checkMatches(
        msg,
        matches,
        'repeat',
        [patternChr],
        [[0, patternChr.length - 1]],
        {
          baseToken: [chr],
        },
      )
    })
  })

  let matches = matchRepeat.match({
    password: 'BBB1111aaaaa@@@@@@',
    omniMatch,
  }) as RepeatMatch[]
  const patterns = ['BBB', '1111', 'aaaaa', '@@@@@@']
  let msg = 'matches multiple adjacent repeats'
  checkMatches(
    msg,
    matches,
    'repeat',
    patterns,
    [
      [0, 2],
      [3, 6],
      [7, 11],
      [12, 17],
    ],
    {
      baseToken: ['B', '1', 'a', '@'],
    },
  )
  matches = matchRepeat.match({
    password: '2818BBBbzsdf1111@*&@!aaaaaEUDA@@@@@@1729',
    omniMatch,
  }) as RepeatMatch[]
  msg = 'matches multiple repeats with non-repeats in-between'
  checkMatches(
    msg,
    matches,
    'repeat',
    patterns,
    [
      [4, 6],
      [12, 15],
      [21, 25],
      [30, 35],
    ],
    {
      baseToken: ['B', '1', 'a', '@'],
    },
  )
  pattern = 'abab'
  matches = matchRepeat.match({ password: pattern, omniMatch }) as RepeatMatch[]
  msg = 'matches multi-character repeat pattern'
  checkMatches(msg, matches, 'repeat', [pattern], [[0, pattern.length - 1]], {
    baseToken: ['ab'],
  })
  pattern = 'aabaab'
  matches = matchRepeat.match({ password: pattern, omniMatch }) as RepeatMatch[]
  msg = 'matches aabaab as a repeat instead of the aa prefix'
  checkMatches(msg, matches, 'repeat', [pattern], [[0, pattern.length - 1]], {
    baseToken: ['aab'],
  })
  pattern = 'abababab'
  matches = matchRepeat.match({ password: pattern, omniMatch }) as RepeatMatch[]
  msg = 'identifies ab as repeat string, even though abab is also repeated'
  checkMatches(msg, matches, 'repeat', [pattern], [[0, pattern.length - 1]], {
    baseToken: ['ab'],
  })
})
