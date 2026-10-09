import MatchSequence from '../../../src/matcher/sequence/matching'
import checkMatches from '../../helper/checkMatches'
import genpws from '../../helper/genpws'
import Options from '../../../src/Options'

describe('sequence matching', () => {
  const zxcvbnOptions = new Options()
  const matchSequence = new MatchSequence(zxcvbnOptions)

  it("doesn't match length sequences", () => {
    const data = ['', 'a', '1']

    data.forEach((password) => {
      expect(matchSequence.match({ password })).toEqual([])
    })
  })

  let matches = matchSequence.match({ password: 'abcbabc' })
  let msg = 'matches overlapping patterns'

  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'sequence',
    patterns: ['abc', 'cba', 'abc'],
    ijs: [
      [0, 2],
      [2, 4],
      [4, 6],
    ],
    propsToCheck: {
      ascending: [true, false, true],
    },
  })

  const prefixes = ['!', '22']
  const suffixes = ['!', '22']
  const pattern = 'jihg'
  const generatedGenPws = genpws(pattern, prefixes, suffixes)

  generatedGenPws.forEach(([password, i, j]) => {
    matches = matchSequence.match({ password })
    msg = `matches embedded sequence patterns ${password}`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'sequence',
      patterns: [pattern],
      ijs: [[i, j]],
      propsToCheck: {
        sequenceName: ['lower'],
        ascending: [false],
      },
    })
  })

  const data: [string, string, boolean][] = [
    ['ABC', 'upper', true],
    ['CBA', 'upper', false],
    ['PQR', 'upper', true],
    ['RQP', 'upper', false],
    ['XYZ', 'upper', true],
    ['ZYX', 'upper', false],
    ['abcd', 'lower', true],
    ['dcba', 'lower', false],
    ['jihg', 'lower', false],
    ['wxyz', 'lower', true],
    ['zxvt', 'lower', false],
    ['0369', 'digits', true],
    ['97531', 'digits', false],
  ]

  data.forEach(([dataPattern, name, isAscending]) => {
    matches = matchSequence.match({ password: dataPattern })
    msg = `matches '${dataPattern}' as a '${name}' sequence`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'sequence',
      patterns: [dataPattern],
      ijs: [[0, dataPattern.length - 1]],
      propsToCheck: {
        sequenceName: [name],
        ascending: [isAscending],
      },
    })
  })

  // the file header comment claims codepoint deltas "also match some extended
  // unicode sequences such as Greek and Cyrillic alphabets" - verify that for
  // characters outside the Roman alphabet (still within the BMP, so no
  // surrogate pairs are involved).
  const extendedUnicodeData: [string, boolean][] = [
    ['абвг', true], // Cyrillic, ascending
    ['гвба', false], // Cyrillic, descending
    ['αβγδ', true], // Greek, ascending
    ['δγβα', false], // Greek, descending
  ]

  extendedUnicodeData.forEach(([dataPattern, isAscending]) => {
    matches = matchSequence.match({ password: dataPattern })
    msg = `matches '${dataPattern}' as a 'unicode' sequence`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'sequence',
      patterns: [dataPattern],
      ijs: [[0, dataPattern.length - 1]],
      propsToCheck: {
        sequenceName: ['unicode'],
        ascending: [isAscending],
      },
    })
  })

  // Mathematical Bold Capital A-D (U+1D400..U+1D403): each character is a
  // surrogate pair, so this only reads as a sequence if deltas are computed
  // on code points rather than UTF-16 code units.
  const astralAscending = '𝐀𝐁𝐂𝐃'
  const astralDescending = '𝐃𝐂𝐁𝐀'

  ;[
    [astralAscending, true],
    [astralDescending, false],
  ].forEach(([dataPattern, isAscending]) => {
    matches = matchSequence.match({ password: dataPattern as string })
    msg = `matches '${dataPattern}' (surrogate pairs) as a 'unicode' sequence`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'sequence',
      patterns: [dataPattern as string],
      ijs: [[0, (dataPattern as string).length - 1]],
      propsToCheck: {
        sequenceName: ['unicode'],
        ascending: [isAscending],
      },
    })
  })

  const astralPrefixes = ['!', '22']
  const astralSuffixes = ['!', '22']
  const generatedAstralGenPws = genpws(
    astralAscending,
    astralPrefixes,
    astralSuffixes,
  )

  generatedAstralGenPws.forEach(([password, i, j]) => {
    matches = matchSequence.match({ password })
    msg = `matches embedded surrogate-pair sequence patterns ${password}`
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'sequence',
      patterns: [astralAscending],
      ijs: [[i, j]],
      propsToCheck: {
        sequenceName: ['unicode'],
        ascending: [true],
      },
    })
  })
})
