import MatchL33t from '../../../../../src/matcher/dictionary/variants/matching/l33t'
import MatchDictionary from '../../../../../src/matcher/dictionary/matching'
import checkMatches from '../../../../helper/checkMatches'
import { zxcvbnOptions } from '../../../../../src/Options'
import { sorted } from '../../../../../src/helper'

zxcvbnOptions.setOptions()
const dictionaryMatcher = new MatchDictionary()

describe('l33t matching', () => {
  let msg
  const testTable = {
    a: ['4', '@'],
    c: ['(', '{', '[', '<'],
    g: ['6', '9'],
    o: ['0', '()'],
    u: ['|_|'],
  }

  const dicts = {
    words: ['aac', 'password', 'paassword', 'asdf0', 'computer'],
    words2: ['cgo'],
  }

  describe('default const', () => {
    const matchL33t = new MatchL33t(dictionaryMatcher.defaultMatch)
    it("doesn't match single-character l33ted words", () => {
      expect(matchL33t.match({ password: '4 1 @' })).toEqual([])
    })
  })

  zxcvbnOptions.setOptions({
    dictionary: dicts,
    l33tTable: testTable,
    l33tMaxSubstitutions: 15,
  })
  const matchL33t = new MatchL33t(dictionaryMatcher.defaultMatch)

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
        '(()mp|_|ter',
        '(()mp|_|',
        'computer',
        'words',
        5,
        [0, 7],

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
        checkMatches(
          msg,
          // @ts-ignore
          matchL33t.match({ password }),
          'dictionary',
          [pattern as string],
          [ij as number[]],
          {
            l33t: [true],
            subs: [subs],
            matchedWord: [word],
            rank: [rank],
            dictionaryName: [dictionaryName],
          },
        )
      },
    )
    const matches = matchL33t.match({ password: '@a(go{G0' })
    msg = 'matches against overlapping l33t patterns'
    checkMatches(
      msg,
      sorted(matches),
      'dictionary',
      ['@a(', '(go', '{G0'],
      [
        [0, 2],
        [2, 4],
        [5, 7],
      ],
      {
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
    )
  })
})
