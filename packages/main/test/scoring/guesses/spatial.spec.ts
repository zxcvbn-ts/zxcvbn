import spatialGuesses from '../../../src/scoring/guesses/spatial'
import Options from '../../../src/Options'

Options.setOptions()

describe('scoring: guesses spatial', () => {
  it('with no turns or shifts, guesses is starts * degree * (len-1)', () => {
    const match = {
      token: 'zxcvbn',
      graph: 'qwerty',
      turns: 1,
      shiftedCount: 0,
    }

    // @ts-ignore
    expect(spatialGuesses(match)).toEqual(2155)
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
    expect(spatialGuesses(match)).toEqual(45255)
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
    expect(spatialGuesses(match)).toEqual(4310)
  })

  it('spatial guesses accounts for turn positions, directions and starting keys', () => {
    const match = {
      token: 'zxcft6yh',
      graph: 'qwerty',
      turns: 3,
      shiftedCount: 0,
    }

    // @ts-ignore
    expect(spatialGuesses(match)).toEqual(206109803)
  })
})
