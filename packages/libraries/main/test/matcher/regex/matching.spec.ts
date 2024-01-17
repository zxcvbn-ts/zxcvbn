import MatchRegex from '../../../src/matcher/regex/matching'
import checkMatches from '../../helper/checkMatches'
import Options from '../../../src/Options'

describe('regex matching', () => {
  const data = [
    { pattern: '1922', regexNames: ['recentYear'], ijs: [[0, 3]] },
    { pattern: '2017', regexNames: ['recentYear'], ijs: [[0, 3]] },
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
