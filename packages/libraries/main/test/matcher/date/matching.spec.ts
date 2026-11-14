import MatchDate from '../../../src/matcher/date/matching'
import checkMatches from '../../helper/checkMatches'
import genpws from '../../helper/genpws'
import Options from '../../../src/Options'

describe('date matching', () => {
  const zxcvbnOptions = new Options()
  const matchDate = new MatchDate(zxcvbnOptions)
  let password
  let matches
  let msg
  let data = ['', ' ', '-', '/', '\\', '_', '.']
  data.forEach((sep) => {
    password = `13${sep}2${sep}1921`
    matches = matchDate.match({ password })
    msg = `matches dates that use '${sep}' as a separator`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'date',
      patterns: [password],
      ijs: [[0, password.length - 1]],
      propsToCheck: {
        separator: [sep],
        year: [1921],
        month: [2],
        day: [13],
      },
    })
  })

  data = ['mdy', 'dmy', 'ymd', 'ydm']
  data.forEach((order) => {
    const [d, m, y] = [8, 8, 88]
    password = order
      .replace('y', `${y}`)
      .replace('m', `${m}`)
      .replace('d', `${d}`)
    matches = matchDate.match({ password })
    msg = `matches dates with '${order}' format`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'date',
      patterns: [password],
      ijs: [[0, password.length - 1]],
      propsToCheck: {
        separator: [''],
        year: [1988],
        month: [8],
        day: [8],
      },
    })
  })

  password = '111504'
  matches = matchDate.match({ password })
  msg = 'matches the date with year closest to REFERENCE_YEAR when ambiguous'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'date',
    patterns: [password],
    ijs: [[0, password.length - 1]],
    propsToCheck: {
      separator: [''],
      year: [2004],
      month: [11],
      day: [15],
    },
  })

  const numberData = [
    [1, 1, 1999],
    [11, 8, 2000],
    [9, 12, 2005],
    [14, 3, 2075],
    [28, 2, 2099],
    [22, 11, 1551],
  ]
  numberData.forEach(([day, month, year]) => {
    password = `${year}${month}${day}`
    matches = matchDate.match({ password })
    msg = `matches ${password}`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'date',
      patterns: [password],
      ijs: [[0, password.length - 1]],
      propsToCheck: {
        separator: [''],
        year: [year],
      },
    })
    password = `${year}.${month}.${day}`
    matches = matchDate.match({ password })
    msg = `matches ${password}`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'date',
      patterns: [password],
      ijs: [[0, password.length - 1]],
      propsToCheck: {
        separator: ['.'],
        year: [year],
      },
    })
  })

  password = '02/02/02'
  matches = matchDate.match({ password })
  msg = 'matches zero-padded dates'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'date',
    patterns: [password],
    ijs: [[0, password.length - 1]],
    propsToCheck: {
      separator: ['/'],
      year: [2002],
      month: [2],
      day: [2],
    },
  })

  const prefixes = ['a', 'ab']
  const suffixes = ['!']
  const pattern = '1/1/91'
  const generatedPws = genpws(pattern, prefixes, suffixes)

  generatedPws.forEach(([dataPassword, i, j]) => {
    matches = matchDate.match({ password: dataPassword })
    msg = 'matches embedded dates'
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'date',
      patterns: [pattern],
      ijs: [[i, j]],
      propsToCheck: {
        year: [1991],
        month: [1],
        day: [1],
      },
    })
  })

  matches = matchDate.match({ password: '12/20/1991.12.20' })
  msg = 'matches overlapping dates'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'date',
    patterns: ['12/20/1991', '1991.12.20'],
    ijs: [
      [0, 9],
      [6, 15],
    ],
    propsToCheck: {
      separator: ['/', '.'],
      year: [1991, 1991],
      month: [12, 12],
      day: [20, 20],
    },
  })

  matches = matchDate.match({ password: '912/20/919' })
  msg = 'matches dates padded by non-ambiguous digits'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'date',
    patterns: ['12/20/91'],
    ijs: [[1, 8]],
    propsToCheck: {
      separator: ['/'],
      year: [1991],
      month: [12],
      day: [20],
    },
  })
})

describe('date matching out of range years', () => {
  const matchDate = new MatchDate(new Options())

  it.each(['2100.3.14', '14.3.2100', '21000314'])(
    'does not match %s with the year 2100',
    (password) => {
      const years = matchDate.match({ password }).map((match) => match.year)
      expect(years).not.toContain(2100)
    },
  )
})

describe('date matching noise filter', () => {
  const matchDate = new MatchDate(new Options())
  const date = (i: number, j: number, year: number) => ({
    pattern: 'date' as const,
    token: 'x'.repeat(j - i + 1),
    i,
    j,
    separator: '',
    year,
    month: 1,
    day: 1,
  })

  it('keeps one of two matches with the same span', () => {
    const result = matchDate.filterNoise([date(0, 7, 1991), date(0, 7, 1919)])
    expect(result).toHaveLength(1)
    expect([result[0].i, result[0].j]).toEqual([0, 7])
  })

  it('removes matches inside another match', () => {
    const result = matchDate.filterNoise([
      date(2, 5, 1991),
      date(0, 7, 1991),
      date(0, 5, 1991),
      date(2, 7, 1991),
    ])
    expect(result.map(({ i, j }) => [i, j])).toEqual([[0, 7]])
  })

  it('keeps overlapping matches that are not inside each other', () => {
    const result = matchDate.filterNoise([date(3, 9, 1991), date(0, 5, 1991)])
    expect(result.map(({ i, j }) => [i, j])).toEqual([
      [0, 5],
      [3, 9],
    ])
  })

  it('keeps one match for a repeated full date', () => {
    const matches = matchDate.match({ password: '11111111' })
    const spans = matches.map(({ i, j }) => `${i}-${j}`)
    expect(new Set(spans).size).toEqual(spans.length)
    expect(spans).toContain('0-7')
  })
})
