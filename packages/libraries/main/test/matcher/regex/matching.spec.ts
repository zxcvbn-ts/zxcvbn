import MatchRegex from '../../../src/matcher/regex/matching.ts'
import checkMatches from '../../helper/checkMatches.ts'
import Options from '../../../src/Options.ts'

describe('regex matching', () => {
  const data = [
    { pattern: '1922', regexNames: ['recentYear'], ijs: [[0, 3]] },
    { pattern: '2017', regexNames: ['recentYear'], ijs: [[0, 3]] },
    { pattern: '2030', regexNames: ['recentYear'], ijs: [[0, 3]] },
    { pattern: '2099', regexNames: ['recentYear'], ijs: [[0, 3]] },
    {
      pattern: '2016-2015',
      regexNames: ['recentYear', 'recentYear'],
      ijs: [
        [0, 3],
        [5, 8],
      ],
    },
  ]

  const zxcvbnOptions = new Options()
  const matchRegex = new MatchRegex(zxcvbnOptions)
  data.forEach(({ pattern, regexNames, ijs }) => {
    const matches = matchRegex.match({ password: pattern })
    const msg = `matches ${pattern} as a ${regexNames[0]} pattern`
    const patterns = pattern.split('-')

    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'regex',
      patterns,
      ijs,
      propsToCheck: {
        regexName: regexNames,
      },
    })
  })
})

describe('regex matching out of range years', () => {
  const matchRegex = new MatchRegex(new Options())

  it.each(['1899', '2100'])('does not match %s as a recentYear', (password) => {
    expect(matchRegex.match({ password })).toEqual([])
  })
})
