import MatchL33t, {
  L33T_NARROW_BUDGET,
} from '../../../../../src/matcher/dictionary/variants/matching/l33t'
import WordIndex from '../../../../../src/matcher/dictionary/WordIndex'
import checkMatches from '../../../../helper/checkMatches'
import Options from '../../../../../src/Options'
import sorted from '../../../../helper/sorted'

describe('l33t matching', () => {
  let msg
  const testTable = {
    a: ['4', '@'],
    c: ['(', '{', '[', '<'],
    g: ['6', '9'],
    o: ['0', '()'],
    u: ['|_|'],
    fi: ['ﬁ'],
  }

  const dicts = {
    words: ['aac', 'password', 'paassword', 'asdf0', 'computer', 'pacific'],
    words2: ['cgo'],
  }

  describe('default const', () => {
    const zxcvbnOptions = new Options()
    const matchL33t = new MatchL33t(zxcvbnOptions)
    it("doesn't match single-character l33ted words", () => {
      expect(matchL33t.match({ password: '4 1 @' })).toEqual([])
    })
    it("doesn't match a single l33ted emoji", () => {
      const emojiOptions = new Options({
        dictionary: { words: ['a'] },
        l33tTable: { a: ['😀'] },
      })
      expect(new MatchL33t(emojiOptions).match({ password: '😀' })).toEqual([])
    })
    it("doesn't match a word with 'İ' that has no substitution", () => {
      // the '1' gets substituted, but the match on 'İstanbul' doesn't include it
      const dottedIOptions = new Options({
        dictionary: { words: ['istanbul'] },
      })
      expect(
        new MatchL33t(dottedIOptions).match({ password: 'İstanbul1' }),
      ).toEqual([])
    })
  })

  const zxcvbnOptions = new Options({
    dictionary: dicts,
    l33tTable: testTable,
    l33tMaxSubstitutions: 15,
  })
  const matchL33t = new MatchL33t(zxcvbnOptions)

  describe('main match', () => {
    it("doesn't match ''", () => {
      expect(matchL33t.match({ password: '' })).toEqual([])
    })

    it("doesn't match pure dictionary words", () => {
      expect(matchL33t.match({ password: 'password' })).toEqual([])
    })

    it('should match when multiple l33t substitution are needed for the same letter', () => {
      expect(matchL33t.match({ password: 'p4@ssword' })).toEqual([
        {
          dictionaryName: 'words',
          i: 0,
          j: 8,
          l33t: true,
          matchedWord: 'paassword',
          pattern: 'dictionary',
          rank: 3,
          reversed: false,
          subs: [
            {
              letter: 'a',
              substitution: '4',
            },
            {
              letter: 'a',
              substitution: '@',
            },
          ],
          subDisplay: '4 -> a, @ -> a',
          token: 'p4@ssword',
        },
      ])
    })

    it("doesn't match with subsets of possible l33t substitution", () => {
      expect(matchL33t.match({ password: 'P4$$w0rd' })).toEqual([])
    })
    const data = [
      [
        'p4ssword',
        'p4ssword',
        'password',
        'words',
        2,
        [0, 7],
        [
          {
            letter: 'a',
            substitution: '4',
          },
        ],
      ],
      [
        'p@@ssw0rd',
        'p@@ssw0rd',
        'paassword',
        'words',
        3,
        [0, 8],
        [
          {
            letter: 'a',
            substitution: '@',
          },
          {
            letter: 'o',
            substitution: '0',
          },
        ],
      ],
      [
        '|_|(()mp|_|ter',
        '(()mp|_|ter',
        'computer',
        'words',
        5,
        [3, 13],

        [
          {
            letter: 'c',
            substitution: '(',
          },
          {
            letter: 'o',
            substitution: '()',
          },
          {
            letter: 'u',
            substitution: '|_|',
          },
        ],
      ],
      [
        'ﬁp@ciﬁc',
        'p@ciﬁc',
        'pacific',
        'words',
        6,
        [1, 6],

        [
          {
            letter: 'a',
            substitution: '@',
          },
          {
            letter: 'fi',
            substitution: 'ﬁ',
          },
        ],
      ],
      [
        'aSdfO{G0asDfO',
        '{G0',
        'cgo',
        'words2',
        1,
        [5, 7],
        [
          {
            letter: 'c',
            substitution: '{',
          },
          {
            letter: 'o',
            substitution: '0',
          },
        ],
      ],
    ]

    data.forEach(
      ([password, pattern, word, dictionaryName, rank, ij, subs]) => {
        msg = 'matches against common l33t substitution'
        const dataMatches = matchL33t.match({ password: password as string })

        checkMatches({
          messagePrefix: msg,
          matches: dataMatches,
          patternNames: 'dictionary',
          patterns: [pattern as string],
          ijs: [ij as number[]],
          propsToCheck: {
            l33t: [true],
            subs: [subs],
            matchedWord: [word],
            rank: [rank],
            dictionaryName: [dictionaryName],
          },
        })
      },
    )
    const matches = matchL33t.match({ password: '@a(go{G0' })
    msg = 'matches against overlapping l33t patterns'
    checkMatches({
      messagePrefix: msg,
      matches: sorted(matches),
      patternNames: 'dictionary',
      patterns: ['@a(', '(go', '{G0'],
      ijs: [
        [0, 2],
        [2, 4],
        [5, 7],
      ],
      propsToCheck: {
        l33t: [true, true, true],
        subs: [
          [
            {
              letter: 'a',
              substitution: '@',
            },
            {
              letter: 'c',
              substitution: '(',
            },
          ],
          [
            {
              letter: 'c',
              substitution: '(',
            },
          ],
          [
            {
              letter: 'c',
              substitution: '{',
            },
            {
              letter: 'o',
              substitution: '0',
            },
          ],
        ],
        matchedWord: ['aac', 'cgo', 'cgo'],
        rank: [1, 1, 1],
        dictionaryName: ['words', 'words2', 'words2'],
      },
    })
  })

  describe('walk over the word index', () => {
    it('finds l33t words without any substitution limit', () => {
      const options = new Options({
        dictionary: dicts,
        l33tTable: testTable,
        l33tMaxSubstitutions: 0,
      })
      const matches = new MatchL33t(options).match({ password: 'p4ssw0rd' })
      expect(
        matches.map(({ token, matchedWord }) => [token, matchedWord]),
      ).toEqual([['p4ssw0rd', 'password']])
    })

    it('matches a l33t word that is only a user input', () => {
      const l33tUserInputs = zxcvbnOptions.getUserInputsOptions(['wookie'])
      const l33tMatches = matchL33t.match({
        password: 'xw00kiex',
        userInputsOptions: l33tUserInputs,
      })
      expect(
        l33tMatches.map(({ i, j, matchedWord, dictionaryName }) => [
          i,
          j,
          matchedWord,
          dictionaryName,
        ]),
      ).toEqual([[1, 6, 'wookie', 'userInputs']])
    })

    it('matches a case-sensitive substitution', () => {
      const options = new Options({
        dictionary: { words: ['bell'] },
        l33tTable: { l: ['L'] },
      })
      const matches = new MatchL33t(options).match({ password: 'beLL' })
      // 'L' lowercased is already 'l', so there is no substitution to make
      expect(matches).toEqual([])
      const upperOptions = new Options({
        dictionary: { words: ['bell'] },
        l33tTable: { l: ['I'] },
      })
      const upperMatches = new MatchL33t(upperOptions).match({
        password: 'beII',
      })
      expect(
        upperMatches.map(({ token, matchedWord }) => [token, matchedWord]),
      ).toEqual([['beII', 'bell']])
    })

    it('matches a mixed-case substitution that starts lowercase', () => {
      const options = new Options({
        dictionary: { words: ['password', 'mouse'] },
        l33tTable: { m: ['nN'], a: ['4'] },
      })
      const matches = new MatchL33t(options).match({ password: 'nNouse' })
      expect(
        matches.map(({ token, matchedWord, rank, subDisplay }) => [
          token,
          matchedWord,
          rank,
          subDisplay,
        ]),
      ).toEqual([['nNouse', 'mouse', 2, 'nN -> m']])
    })

    it('finds a word at the end after a start used up its share of the budget', () => {
      class SmallBudgetL33t extends MatchL33t {
        protected narrowBudget = 5000
      }
      const options = new Options({
        dictionary: { words: ['a'.repeat(40), 'password'] },
        l33tTable: { a: ['4'], b: ['4'], o: ['0'] },
      })
      const matches = new SmallBudgetL33t(options).match({
        password: `${'4'.repeat(240)}p4ssw0rd`,
      })
      expect(
        matches.map(({ i, j, matchedWord }) => [i, j, matchedWord]),
      ).toContainEqual([240, 247, 'password'])
    })

    it('finds a word that needs more than its share while budget is left', () => {
      const word = 'l'.repeat(200)
      const options = new Options({ dictionary: { words: [word] } })
      // the 4 makes every position a start, so the share of a start is small
      const matches = new MatchL33t(options).match({
        password: `${'1'.repeat(200)}${'z'.repeat(55)}4`,
      })
      expect(
        matches.map(({ i, j, matchedWord }) => [i, j, matchedWord]),
      ).toEqual([[0, 199, word]])
    })

    it('finds a word when what is left is less than the share of a start', () => {
      class SmallBudgetL33t extends MatchL33t {
        protected narrowBudget = 12000
      }
      const word = 'l'.repeat(100)
      const options = new Options({ dictionary: { words: [word] } })
      const matches = new SmallBudgetL33t(options).match({
        password: `${'1'.repeat(100)}${'z'.repeat(155)}4`,
      })
      expect(
        matches.map(({ i, j, matchedWord }) => [i, j, matchedWord]),
      ).toEqual([[0, 99, word]])
    })

    it('stays within the budget when stopped starts walk again', () => {
      const options = new Options({
        dictionary: { words: ['i'.repeat(256), 'l'.repeat(256)] },
      })
      const { narrow } = WordIndex.prototype
      let narrowCount = 0
      WordIndex.prototype.narrow = function countedNarrow(...args) {
        narrowCount += 1
        narrow.apply(this, args)
      }
      try {
        new MatchL33t(options).match({ password: '1'.repeat(256) })
      } finally {
        WordIndex.prototype.narrow = narrow
      }
      expect(narrowCount).toBeLessThanOrEqual(L33T_NARROW_BUDGET)
      expect(narrowCount).toBeGreaterThan(L33T_NARROW_BUDGET / 2)
    })

    it('stops at the budget and keeps the matches found so far', () => {
      class SmallBudgetL33t extends MatchL33t {
        protected narrowBudget = 1000
      }
      const options = new Options({
        dictionary: { words: ['aac', 'aaa'] },
        l33tTable: { a: ['4'], c: ['4', '('] },
      })
      const password = `4@(${'4'.repeat(250)}`
      const full = new MatchL33t(options).match({ password })
      const limited = new SmallBudgetL33t(options).match({ password })
      expect(full.length).toBeGreaterThan(limited.length)
      expect(limited.length).toBeGreaterThan(0)
      const fullKeys = full.map(
        ({ i, j, matchedWord }) => `${i}-${j}-${matchedWord}`,
      )
      limited.forEach(({ i, j, matchedWord }) => {
        expect(fullKeys).toContain(`${i}-${j}-${matchedWord}`)
      })
    })

    it('handles a password of only ambiguous substitutions in time', () => {
      const options = new Options({
        dictionary: { words: ['ilit', 'liti'] },
        l33tTable: { i: ['!', '1'], l: ['!', '1'], t: ['!', '1'] },
      })
      const start = performance.now()
      new MatchL33t(options).match({ password: '!'.repeat(256) })
      expect(performance.now() - start).toBeLessThan(1000)
    })
  })

  // The variant matcher stopped at the first variant that matched the whole
  // password, so a second word over the whole password was never found. With
  // every language package these passwords scored higher before the walk.
  describe('matches that the first full match used to hide', () => {
    const l33tMatch = (
      password: string,
      words: string[],
      useLevenshteinDistance = false,
    ) =>
      new MatchL33t(
        new Options({ dictionary: { words }, useLevenshteinDistance }),
      ).match({ password })

    it("finds 'lv' next to 'iv' for '1/', the repeated part of '1/1/91' and '1/1/2010'", () => {
      expect(l33tMatch('1/', ['lv', 'iv'])).toContainEqual({
        pattern: 'dictionary',
        i: 0,
        j: 1,
        token: '1/',
        matchedWord: 'lv',
        rank: 1,
        dictionaryName: 'words',
        reversed: false,
        l33t: true,
        subs: [
          { letter: 'l', substitution: '1' },
          { letter: 'v', substitution: '/' },
        ],
        subDisplay: '1 -> l, / -> v',
      })
    })

    it("finds 'lize' next to 'ilze' for '1123'", () => {
      expect(l33tMatch('1123', ['lize', 'ilze'])).toContainEqual({
        pattern: 'dictionary',
        i: 0,
        j: 3,
        token: '1123',
        matchedWord: 'lize',
        rank: 1,
        dictionaryName: 'words',
        reversed: false,
        l33t: true,
        subs: [
          { letter: 'l', substitution: '1' },
          { letter: 'i', substitution: '1' },
          { letter: 'z', substitution: '2' },
          { letter: 'e', substitution: '3' },
        ],
        subDisplay: '1 -> l, 1 -> i, 2 -> z, 3 -> e',
      })
    })

    describe('with levenshtein', () => {
      it("finds the levenshtein match of 'computer' next to its l33t match for '(()mp|_|ter'", () => {
        expect(l33tMatch('(()mp|_|ter', ['computer'], true)).toContainEqual({
          pattern: 'dictionary',
          i: 0,
          j: 10,
          token: '(()mp|_|ter',
          matchedWord: 'cc)mputer',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'computer',
          subs: [
            { letter: 'c', substitution: '(' },
            { letter: 'u', substitution: '|_|' },
          ],
          subDisplay: '( -> c, |_| -> u',
        })
      })

      it("finds 'long' next to 'big' for '1899'", () => {
        expect(l33tMatch('1899', ['long', 'big'], true)).toContainEqual({
          pattern: 'dictionary',
          i: 0,
          j: 3,
          token: '1899',
          matchedWord: 'lbgg',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'long',
          subs: [
            { letter: 'l', substitution: '1' },
            { letter: 'b', substitution: '8' },
            { letter: 'g', substitution: '9' },
          ],
          subDisplay: '1 -> l, 8 -> b, 9 -> g',
        })
      })

      it("finds 'que' next to 'dig' for '999'", () => {
        expect(l33tMatch('999', ['que', 'dig'], true)).toContainEqual({
          pattern: 'dictionary',
          i: 0,
          j: 2,
          token: '999',
          matchedWord: 'qqq',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'que',
          subs: [{ letter: 'q', substitution: '9' }],
          subDisplay: '9 -> q',
        })
      })

      it("finds 'oldani' next to 'ioani' for '101 ani'", () => {
        expect(l33tMatch('101 ani', ['oldani', 'ioani'], true)).toContainEqual({
          pattern: 'dictionary',
          i: 0,
          j: 6,
          token: '101 ani',
          matchedWord: 'lol ani',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'oldani',
          subs: [
            { letter: 'l', substitution: '1' },
            { letter: 'o', substitution: '0' },
          ],
          subDisplay: '1 -> l, 0 -> o',
        })
      })

      it("finds 'ilani' next to 'igani' for '119 ani'", () => {
        expect(l33tMatch('119 ani', ['ilani', 'igani'], true)).toContainEqual({
          pattern: 'dictionary',
          i: 0,
          j: 6,
          token: '119 ani',
          matchedWord: 'ilg ani',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'ilani',
          subs: [
            { letter: 'i', substitution: '1' },
            { letter: 'l', substitution: '1' },
            { letter: 'g', substitution: '9' },
          ],
          subDisplay: '1 -> i, 1 -> l, 9 -> g',
        })
      })
    })
  })
})
