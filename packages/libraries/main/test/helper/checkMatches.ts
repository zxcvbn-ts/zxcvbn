import { LooseObject, MatchExtended } from '../../src/types'

// eslint-disable-next-line jest/no-export
export interface CheckMatchesOptions {
  messagePrefix: string
  matches: MatchExtended[]
  patternNames: string
  patterns: string[]
  ijs: number[][]
  propsToCheck: LooseObject
}

// eslint-disable-next-line jest/no-export
export default function checkMatches({
  messagePrefix,
  matches,
  patternNames,
  patterns,
  ijs,
  propsToCheck,
}: CheckMatchesOptions) {
  const usedPatternNames = patterns.map(() => patternNames)
  let isEqualLenArgs =
    usedPatternNames.length === patterns.length &&
    patterns.length === ijs.length

  Object.keys(propsToCheck).forEach((prop) => {
    const lst = propsToCheck[prop]
    isEqualLenArgs = isEqualLenArgs && lst.length === patterns.length
  })

  if (!isEqualLenArgs) {
    throw Error('unequal argument lists to check_matches')
  }

  it(`${messagePrefix}: matches.length == ${patterns.length}`, () => {
    expect(matches.length).toEqual(patterns.length)
  })

  for (let k = 0; k < patterns.length; k += 1) {
    const match = matches[k]
    const patternName = usedPatternNames[k]
    const pattern = patterns[k]
    const [i, j] = ijs[k]

    it(`${messagePrefix}: matches[${k}].pattern == '${usedPatternNames}'`, () => {
      expect(match.pattern).toEqual(patternName)
    })
    it(`${messagePrefix}: matches[${k}] should have [i, j] of [${i}, ${j}]`, () => {
      expect([match.i, match.j]).toEqual([i, j])
    })
    it(`${messagePrefix}: matches[${k}].token == '${pattern}'`, () => {
      expect(match.token).toEqual(pattern)
    })

    Object.keys(propsToCheck).forEach((propName) => {
      const propList = propsToCheck[propName]
      let propMsg = propList[k]
      if (typeof propMsg === 'string') {
        propMsg = `'${propMsg}'`
      }
      it(`${messagePrefix}: matches[${k}].${propName} == ${propMsg}`, () => {
        // @ts-ignore
        expect(match[propName]).toEqual(propList[k])
      })
    })
  }
}
