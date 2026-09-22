import MatchWordSequence from '../../../src/matcher/wordSequence/matching'
import Options from '../../../src/Options'
import { DictionaryMatch } from '../../../src/types'

const options = new Options()
const matcher = new MatchWordSequence(options)

const baseMatch = (overrides: Partial<DictionaryMatch>): DictionaryMatch => ({
  pattern: 'dictionary',
  i: 0,
  j: 5,
  token: 'sample',
  matchedWord: 'sample',
  rank: 1,
  dictionaryName: 'commonWords',
  reversed: false,
  l33t: false,
  ...overrides,
})

const filterDictionaryMatches = (
  matches: DictionaryMatch[],
): DictionaryMatch[] => (matcher as any).filterDictionaryMatches(matches)

describe('MatchWordSequence', () => {
  it('should return no sequences when matches is omitted', () => {
    expect(matcher.match({ password: 'password' } as any)).toEqual([])
  })

  describe('filterDictionaryMatches tie-breaking', () => {
    it('should keep the match with the smaller end index when start indexes tie', () => {
      const shorter = baseMatch({ j: 2 })
      const longer = baseMatch({ j: 5 })

      expect(filterDictionaryMatches([longer, shorter])).toEqual([shorter])
      expect(filterDictionaryMatches([shorter, longer])).toEqual([shorter])
    })

    it('should prefer a forward match over a reversed one when start/end tie', () => {
      const forward = baseMatch({ reversed: false })
      const reversed = baseMatch({ reversed: true })

      expect(filterDictionaryMatches([forward, reversed])).toEqual([forward])
      expect(filterDictionaryMatches([reversed, forward])).toEqual([forward])
    })

    it('should prefer a non-l33t match over an l33t one when start/end/reversed tie', () => {
      const plain = baseMatch({ l33t: false })
      const l33t = baseMatch({ l33t: true })

      expect(filterDictionaryMatches([plain, l33t])).toEqual([plain])
      expect(filterDictionaryMatches([l33t, plain])).toEqual([plain])
    })

    it('should prefer the better rank when start/end/reversed/l33t all tie', () => {
      const betterRank = baseMatch({ rank: 1 })
      const worseRank = baseMatch({ rank: 9 })

      expect(filterDictionaryMatches([worseRank, betterRank])).toEqual([
        betterRank,
      ])
    })
  })

  describe('getMostCommon', () => {
    it('should return null for an empty array', () => {
      expect((matcher as any).getMostCommon([])).toBeNull()
    })
  })

  describe('isValidWordSequence separators', () => {
    const isValid = (
      currentSequence: DictionaryMatch[],
      nextMatch: DictionaryMatch,
      password: string,
    ): boolean =>
      (matcher as any).isValidWordSequence(currentSequence, nextMatch, password)

    it('accepts simple concatenation with no separator', () => {
      const first = baseMatch({ i: 0, j: 2, token: 'one' })
      const second = baseMatch({ i: 3, j: 5, token: 'two' })
      expect(isValid([first], second, 'onetwo')).toBe(true)
    })

    it('accepts a valid separator character', () => {
      const first = baseMatch({ i: 0, j: 2, token: 'one' })
      const second = baseMatch({ i: 4, j: 6, token: 'two' })
      expect(isValid([first], second, 'one_two')).toBe(true)
    })

    it('rejects an invalid separator character', () => {
      const first = baseMatch({ i: 0, j: 2, token: 'one' })
      const second = baseMatch({ i: 4, j: 6, token: 'two' })
      expect(isValid([first], second, 'one9two')).toBe(false)
    })

    it('accepts camelCase (single uppercase letter, no separator)', () => {
      const first = baseMatch({ i: 0, j: 2, token: 'one' })
      const second = baseMatch({ i: 3, j: 5, token: 'Two' })
      expect(isValid([first], second, 'oneTwo')).toBe(true)
    })
  })
})
