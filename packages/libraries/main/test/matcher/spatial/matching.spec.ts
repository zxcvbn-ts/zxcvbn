import MatchSpatial from '../../../src/matcher/spatial/matching'
import checkMatches from '../../helper/checkMatches'
import * as zxcvbnCommonPackage from '../../../../../languages/common/src'
import { zxcvbnOptions } from '../../../src/Options'
import { LooseObject } from '../../../src/types'

const { adjacencyGraphs } = zxcvbnCommonPackage

describe('spatial matching', () => {
  it("doesn't match 1- and 2-character spatial patterns", () => {
    const matchSpatial = new MatchSpatial()
    const data = ['', '/', 'qw', '*/']
    data.forEach((password) => {
      expect(matchSpatial.match({ password })).toEqual([])
    })
  })
  const graphs: LooseObject = {
    qwerty: adjacencyGraphs.qwerty,
  }
  zxcvbnOptions.setOptions({
    graphs,
  })
  const matchSpatial = new MatchSpatial()
  const pattern = '6tfGHJ'
  const matches = matchSpatial.match({ password: `rz!${pattern}%z` })
  const msg =
    'matches against spatial patterns surrounded by non-spatial patterns'

  checkMatches({
    messagePrefix: msg,
    matches,
    patternNames: 'spatial',
    patterns: [pattern],
    ijs: [[3, 3 + pattern.length - 1]],
    propsToCheck: {
      graph: ['qwerty'],
      turns: [2],
      shiftedCount: [3],
    },
  })
})

describe('spatial matching specific patterns vs keyboards', () => {
  const data: [string, string, number, number][] = [
    ['12345', 'qwerty', 1, 0],
    ['@WSX', 'qwerty', 1, 4],
    ['6tfGHJ', 'qwerty', 2, 3],
    ['hGFd', 'qwerty', 1, 2],
    ['/;p09876yhn', 'qwerty', 3, 0],
    ['Xdr%', 'qwerty', 1, 2],
    ['159-', 'keypad', 1, 0],
    ['*84', 'keypad', 1, 0],
    ['/8520', 'keypad', 1, 0],
    ['369', 'keypad', 1, 0],
    ['/963.', 'keypadMac', 1, 0],
    ['*-632.0214', 'keypadMac', 9, 0],
    ['aoEP%yIxkjq:', 'dvorak', 4, 5],
    [';qoaOQ:Aoq;a', 'dvorak', 11, 4],
  ]
  data.forEach(([pattern, keyboard, turns, shifts]) => {
    const graphs: any = {}
    graphs[keyboard] = adjacencyGraphs[keyboard as keyof typeof adjacencyGraphs]
    zxcvbnOptions.setOptions({
      graphs,
    })
    const matchSpatial = new MatchSpatial()
    const matches = matchSpatial.match({ password: pattern })
    const msg = `matches '${pattern}' as a ${keyboard} pattern`

    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'spatial',
      patterns: [pattern],
      ijs: [[0, pattern.length - 1]],
      propsToCheck: {
        graph: [keyboard],
        turns: [turns],
        shiftedCount: [shifts],
      },
    })
  })
})
