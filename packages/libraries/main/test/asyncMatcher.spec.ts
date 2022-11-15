import zxcvbnCommonPackage from '../../../languages/common/src'
import zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, zxcvbnAsync, zxcvbnOptions } from '../src'
import { Matcher, MatchExtended } from '../src/types'

zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
})

const asyncMatcher: Matcher = {
  Matching: class MatchAsync {
    match({ password }: { password: string }): Promise<MatchExtended[]> {
      // eslint-disable-next-line compat/compat
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              pattern: 'asyncMatch',
              token: password,
              i: 0,
              j: password.length - 1,
            },
          ])
        }, 2000)
      })
    }
  },
  feedback() {
    return {
      warning: 'So async',
      suggestions: [],
    }
  },
  scoring(match) {
    return match.token.length * 10
  },
}

zxcvbnOptions.addMatcher('minLength', asyncMatcher)

describe('asyncMatcher', () => {
  it('should use async matcher as a promise', async () => {
    const promiseResult = zxcvbnAsync('ep8fkw8ds')
    expect(promiseResult instanceof Promise).toBe(true)

    const result = await promiseResult
    expect(result.calcTime).toBeDefined()
  })

  it('should throw an error for wrong function usage', async () => {
    expect(() => {
      zxcvbn('ep8fkw8ds')
    }).toThrow(
      'You are using a Promised matcher, please use `zxcvbnAsync` for it.',
    )
  })
})
