import zxcvbnCommonPackage from '../../../languages/common/src'
import zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, ZxcvbnOptions } from '../src'
import { Matcher, MatchExtended } from '../src/types'

ZxcvbnOptions.setOptions({
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

ZxcvbnOptions.addMatcher('minLength', asyncMatcher)

describe('asyncMatcher', () => {
  it('should use async matcher as a promise', async () => {
    let result = zxcvbn('ep8fkw8ds')
    expect(result instanceof Promise).toBe(true)
    result = await result
    expect(result.calcTime).toBeDefined()
  })
})
