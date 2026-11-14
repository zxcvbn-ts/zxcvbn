import {
  empty,
  extend,
  translate,
  countCharacters,
  toLowerCase,
  isHighSurrogate,
  isSurrogatePairAt,
  isDictionaryNamed,
} from '../../src/utils/helper'
import { LooseObject } from '../../src/types'

describe('utils matching', () => {
  describe('empty', () => {
    it('returns true for an empty array', () => {
      expect(empty([])).toBeTruthy()
    })
    it('returns true for an empty object', () => {
      expect(empty({})).toBeTruthy()
    })

    it('returns false for non-empty objects and arrays', () => {
      const values = [
        [1],
        [1, 2],
        [[]],
        {
          a: 1,
        },
        {
          0: {},
        },
      ]
      values.forEach((value) => {
        expect(empty(value)).toBeFalsy()
      })
    })
  })

  describe('extend', () => {
    it('an empty list with an empty list leaves it empty', () => {
      const lst: any[] = []
      extend(lst, [])
      expect(lst).toEqual([])
    })
    it('an empty list with another makes it equal to the other', () => {
      const lst: number[] = []
      extend(lst, [1])
      expect(lst).toEqual([1])
    })
    it("a list with another adds each of the other's elements", () => {
      const lst: number[] = [1]
      extend(lst, [2, 3])
      expect(lst).toEqual([1, 2, 3])
    })
    it("a list by another doesn't affect the other", () => {
      const lst: number[] = [1]
      const lst2 = [2]
      extend(lst, lst2)
      expect(lst2).toEqual([2])
    })
  })

  describe('translate', () => {
    it('a string to a result with provided charmap', () => {
      const charMap = {
        a: 'A',
        b: 'B',
      }
      const data: [string, LooseObject, string][] = [
        ['a', charMap, 'A'],
        ['c', charMap, 'c'],
        ['ab', charMap, 'AB'],
        ['abc', charMap, 'ABc'],
        ['aa', charMap, 'AA'],
        ['abab', charMap, 'ABAB'],
        ['', charMap, ''],
        ['', {}, ''],
        ['abc', {}, 'abc'],
      ]
      data.forEach(([string, map, result]) => {
        expect(translate(string, map)).toEqual(result)
      })
    })
  })

  describe('countCharacters', () => {
    const data: [string, number][] = [
      ['', 0],
      ['abc', 3],
      ['😀', 1],
      ['a😀b😀', 4],
      // a lone surrogate is still one character
      ['\ud83d', 1],
      ['\ud83da', 2],
      ['\ude00\ud83d', 2],
    ]
    data.forEach(([string, count]) => {
      it(`counts ${JSON.stringify(string)} as ${count} characters`, () => {
        expect(countCharacters(string)).toEqual(count)
      })
    })
  })
  describe('isHighSurrogate', () => {
    const data: [number, boolean][] = [
      [0xd7ff, false],
      [0xd800, true],
      [0xdbff, true],
      [0xdc00, false],
      ['a'.charCodeAt(0), false],
      [Number.NaN, false],
    ]
    data.forEach(([code, expected]) => {
      it(`returns ${expected} for ${code.toString(16)}`, () => {
        expect(isHighSurrogate(code)).toEqual(expected)
      })
    })
  })
  describe('isSurrogatePairAt', () => {
    const data: [string, number, boolean][] = [
      ['a😀', 1, true],
      ['a😀', 0, false],
      // the second half of the pair doesn't start one
      ['a😀', 2, false],
      // lone and reversed surrogates
      ['\ud83d', 0, false],
      ['\ud83da', 0, false],
      ['\ude00\ud83d', 0, false],
      // out of range
      ['😀', 5, false],
      ['😀', -1, false],
    ]
    data.forEach(([string, index, expected]) => {
      it(`returns ${expected} for ${JSON.stringify(string)} at ${index}`, () => {
        expect(isSurrogatePairAt(string, index)).toEqual(expected)
      })
    })
  })
  describe('isDictionaryNamed', () => {
    const data: [string, string, boolean][] = [
      ['diceware', 'diceware', true],
      ['diceware-common', 'diceware', true],
      ['diceware-en', 'diceware', true],
      ['dicewarex', 'diceware', false],
      ['dicewar', 'diceware', false],
      ['passwords-diceware', 'diceware', false],
    ]
    data.forEach(([dictionaryName, name, expected]) => {
      it(`returns ${expected} for ${dictionaryName} named ${name}`, () => {
        expect(isDictionaryNamed(dictionaryName, name)).toEqual(expected)
      })
    })
  })
  describe('toLowerCase', () => {
    const data: [string, string][] = [
      ['', ''],
      ['PassWord', 'password'],
      ['ÄÖÜ', 'äöü'],
      // 'İ' (U+0130) would lowercase to 'i' + U+0307, one code unit longer
      ['İstanbul', 'istanbul'],
      ['aİbİ', 'aibi'],
    ]
    data.forEach(([string, lower]) => {
      it(`lowercases ${JSON.stringify(string)} to ${JSON.stringify(lower)}`, () => {
        expect(toLowerCase(string)).toEqual(lower)
        expect(toLowerCase(string)).toHaveLength(string.length)
      })
    })
  })
})
