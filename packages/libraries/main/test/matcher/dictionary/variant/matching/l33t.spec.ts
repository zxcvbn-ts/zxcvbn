import MatchL33t from '../../../../../src/matcher/dictionary/variants/matching/l33t'
import MatchDictionary from '../../../../../src/matcher/dictionary/matching'
import checkMatches from '../../../../helper/checkMatches'
import * as helperApi from '../../../../../src/helper'
import Options from '../../../../../src/Options'
import { LooseObject } from '../../../../../src/types'

Options.setOptions()
const dictionaryMatcher = new MatchDictionary()
const spyTranslate = jest.spyOn(helperApi, 'translate')

describe('l33t matching', () => {
  let msg
  const testTable = {
    a: ['4', '@'],
    c: ['(', '{', '[', '<'],
    g: ['6', '9'],
    o: ['0'],
  }

  const dicts = {
    words: ['aac', 'password', 'paassword', 'asdf0'],
    words2: ['cgo'],
  }

  describe('default const', () => {
    const matchL33t = new MatchL33t(dictionaryMatcher.defaultMatch)
    it("doesn't match single-character l33ted words", () => {
      expect(matchL33t.match({ password: '4 1 @' })).toEqual([])
    })
  })

  Options.setOptions({
    dictionary: dicts,
    l33tTable: testTable,
    l33tMaxSubstitutions: 15,
  })
  const matchL33t = new MatchL33t(dictionaryMatcher.defaultMatch)

  describe('main match', () => {
    it("doesn't match ''", () => {
      expect(matchL33t.match({ password: '' })).toEqual([])
    })

    it('should not go over max substitutions', () => {
      // this password has 16 substitutions with the custom dictionary
      matchL33t.match({ password: '4@8({[</369&#!1/|0$5' })
      expect(spyTranslate).toHaveBeenCalledTimes(15)
    })

    it("doesn't match pure dictionary words", () => {
      expect(matchL33t.match({ password: 'password' })).toEqual([])
    })

    it("doesn't match when multiple l33t substitutions are needed for the same letter", () => {
      expect(matchL33t.match({ password: 'p4@ssword' })).toEqual([])
    })

    it("doesn't match with subsets of possible l33t substitutions", () => {
      expect(matchL33t.match({ password: '4sdf0' })).toEqual([])
    })
    const data = [
      [
        'p4ssword',
        'p4ssword',
        'password',
        'words',
        3,
        [0, 7],
        {
          4: 'a',
        },
      ],
      [
        'p@ssw0rd',
        'p@ssw0rd',
        'password',
        'words',
        3,
        [0, 7],
        {
          '@': 'a',
          '0': 'o',
        },
      ],
      [
        'aSdfO{G0asDfO',
        '{G0',
        'cgo',
        'words2',
        1,
        [5, 7],
        {
          '{': 'c',
          '0': 'o',
        },
      ],
    ]

    data.forEach(([password, pattern, word, dictionaryName, rank, ij, sub]) => {
      msg = 'matches against common l33t substitutions'
      checkMatches(
        msg,
        // @ts-ignore
        matchL33t.match({ password }),
        'dictionary',
        [pattern as string],
        [ij as number[]],
        {
          l33t: [true],
          sub: [sub],
          matchedWord: [word],
          rank: [rank],
          dictionaryName: [dictionaryName],
        },
      )
    })
    const matches = matchL33t.match({ password: '@a(go{G0' })
    msg = 'matches against overlapping l33t patterns'
    checkMatches(
      msg,
      matches,
      'dictionary',
      ['@a(', '(go', '{G0'],
      [
        [0, 2],
        [2, 4],
        [5, 7],
      ],
      {
        l33t: [true, true, true],
        sub: [
          {
            '@': 'a',
            '(': 'c',
          },
          {
            '(': 'c',
          },
          {
            '{': 'c',
            '0': 'o',
          },
        ],
        matchedWord: ['aac', 'cgo', 'cgo'],
        rank: [1, 1, 1],
        dictionaryName: ['words', 'words2', 'words2'],
      },
    )
  })

  describe('helpers', () => {
    it('reduces l33t table to only the substitutions that a password might be employing', () => {
      const data: [string, LooseObject][] = [
        ['', {}],
        ['abcdefgo123578!#$&*)]}>', {}],
        ['a', {}],
        [
          '4',
          {
            a: ['4'],
          },
        ],
        [
          '4@',
          {
            a: ['4', '@'],
          },
        ],
        [
          '4({60',
          {
            a: ['4'],
            c: ['(', '{'],
            g: ['6'],
            o: ['0'],
          },
        ],
      ]

      data.forEach(([pw, expected]) => {
        expect(matchL33t.relevantL33tSubtable(pw, testTable)).toEqual(expected)
      })
    })

    it('enumerates the different sets of l33t substitutions a password might be using', () => {
      const data = [
        [{}, [{}]],
        [
          {
            a: ['@'],
          },
          [
            {
              '@': 'a',
            },
          ],
        ],
        [
          {
            a: ['@', '4'],
          },
          [
            {
              '@': 'a',
            },
            {
              4: 'a',
            },
          ],
        ],
        [
          {
            a: ['@', '4'],
            c: ['('],
          },
          [
            {
              '@': 'a',
              '(': 'c',
            },
            {
              '4': 'a',
              '(': 'c',
            },
          ],
        ],
      ]

      data.forEach(([table, subs]) => {
        // @ts-ignore
        expect(matchL33t.enumerateL33tSubs(table)).toEqual(subs)
      })
    })
  })
})
