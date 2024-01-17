import * as zxcvbnCommonPackage from '../../../../../languages/common/src'
import spatialGuesses from '../../../src/matcher/spatial/scoring'
import Options from '../../../src/Options'

describe('scoring: guesses spatial', () => {
  const zxcvbnOptions = new Options({
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  })
  it('with no turns or shifts, guesses is starts * degree * (len-1)', () => {
    const match = {
      token: 'zxcvbn',
      graph: 'qwerty',
      turns: 1,
      shiftedCount: 0,
    }

    // @ts-ignore
    expect(spatialGuesses(match, zxcvbnOptions)).toEqual(2160)
  })

  it('guesses is added for shifted keys, similar to capitals in dictionary matching', () => {
    const match = {
      token: 'ZxCvbn',
      graph: 'qwerty',
      turns: 1,
      shiftedCount: 2,
      guesses: null,
    }

    // @ts-ignore
    expect(spatialGuesses(match, zxcvbnOptions)).toEqual(45360)
  })

  it('when everything is shifted, guesses are doubled', () => {
    const match = {
      token: 'ZXCVBN',
      graph: 'qwerty',
      turns: 1,
      shiftedCount: 6,
      guesses: null,
    }
    // @ts-ignore
    expect(spatialGuesses(match, zxcvbnOptions)).toEqual(4320)
  })

  it('spatial guesses accounts for turn positions, directions and starting keys', () => {
    const match = {
      token: 'zxcft6yh',
      graph: 'qwerty',
      turns: 3,
      shiftedCount: 0,
    }

    // @ts-ignore
    expect(spatialGuesses(match, zxcvbnOptions)).toEqual(558461)
  })
})
