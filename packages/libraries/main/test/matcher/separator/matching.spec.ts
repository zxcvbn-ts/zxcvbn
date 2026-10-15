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

  it('treats separators as single characters wherever they are in the list', () => {
    jest.isolateModules(() => {
      jest.doMock('../../../src/data/const', () => {
        const actual = jest.requireActual('../../../src/data/const')
        // '-' is no longer the last separator, so if it isn't treated as a
        // literal it would turn '.-~' into a range covering letters and digits
        return { ...actual, SEPERATOR_CHARS: [...actual.SEPERATOR_CHARS, '~'] }
      })
      // requireActual only bypasses a mock of the separator module itself,
      // its import of the constants above still gets the mocked list
      const { default: IsolatedMatchSeparator } = jest.requireActual<{
        default: typeof MatchSeparator
      }>('../../../src/matcher/separator/matching')

      expect(IsolatedMatchSeparator.getMostUsedSeparatorChar('aa11')).toBe(
        undefined,
      )
      expect(IsolatedMatchSeparator.getMostUsedSeparatorChar('a~b~c')).toBe('~')
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

  matches = matchSeparator.match({ password: 'first.second.third' })
  msg = 'matches with different potential separators'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'separator',
    patterns: ['.', '.'],
    ijs: [
      [5, 5],
      [12, 12],
    ],
    propsToCheck: {},
  })

  matches = matchSeparator.match({ password: 'first\\second\\third' })
  msg = 'matches backslash separators'
  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'separator',
    patterns: ['\\', '\\'],
    ijs: [
      [5, 5],
      [12, 12],
    ],
    propsToCheck: {},
  })
})
