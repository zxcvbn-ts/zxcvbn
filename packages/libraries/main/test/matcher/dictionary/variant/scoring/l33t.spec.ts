import l33t from '../../../../../src/matcher/dictionary/variants/scoring/l33t'
import utils from '../../../../../src/scoring/utils'
import { empty } from '../../../../../src/helper'
import { LooseObject } from '../../../../../src/types'

const { nCk } = utils

describe('scoring: variant l33t', () => {
  const data = [
    ['', 1, {}],
    ['a', 1, {}],
    [
      '4',
      2,
      [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    ],
    [
      '4pple',
      2,
      [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    ],
    ['abcet', 1, {}],
    [
      '4bcet',
      2,
      [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    ],
    [
      'a8cet',
      2,
      [
        {
          letter: 'b',
          substitution: '8',
        },
      ],
    ],
    [
      'abce+',
      2,
      [
        {
          letter: 't',
          substitution: '+',
        },
      ],
    ],
    [
      '48cet',
      4,
      [
        {
          letter: 'a',
          substitution: '4',
        },
        {
          letter: 'b',
          substitution: '8',
        },
      ],
    ],
    [
      'a4a4aa',
      nCk(6, 2) + nCk(6, 1),
      [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    ],
    [
      '4a4a44',
      nCk(6, 2) + nCk(6, 1),
      [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    ],
    [
      'a44att+',
      (nCk(4, 2) + nCk(4, 1)) * nCk(3, 1),
      [
        {
          letter: 'a',
          substitution: '4',
        },
        {
          letter: 't',
          substitution: '+',
        },
      ],
    ],
  ]

  data.forEach(([word, variants, subs]) => {
    it(`extra l33t guesses of ${word} is ${variants}`, () => {
      const match = {
        token: word,
        subs,
        l33t: !empty(subs as LooseObject),
      }
      // @ts-ignore
      expect(l33t(match)).toEqual(variants)
    })
  })

  it("capitalization doesn't affect extra l33t guesses calc", () => {
    const match = {
      token: 'Aa44aA',
      l33t: true,
      subs: [
        {
          letter: 'a',
          substitution: '4',
        },
      ],
    }
    const variants = nCk(6, 2) + nCk(6, 1)
    // @ts-ignore
    expect(l33t(match)).toEqual(variants)
  })
})
