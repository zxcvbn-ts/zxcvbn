import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import MatchOmni from '../src/Matching'
import Options from '../src/Options'
import { Matcher, MatcherBaseClass, MatchExtended } from '../src/types'

const zxcvbnOptions = new Options({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
})

describe('omnimatch matching', () => {
  const omniMatch = new MatchOmni(zxcvbnOptions)

  it("doesn't match ''", () => {
    expect(omniMatch.match('')).toEqual([])
  })

  const password = 'r0sebudmaelstrom11/20/91aaaa'
  const matches = omniMatch.match(password) as MatchExtended[]
  const data: [string, [number, number]][] = [
    ['dictionary', [0, 6]],
    ['dictionary', [7, 14]],
    ['date', [16, 23]],
    ['repeat', [24, 27]],
  ]

  data.forEach(([patternName, [i, j]]) => {
    let included = false
    matches.forEach((match) => {
      if (match.i === i && match.j === j && match.pattern === patternName) {
        included = true
      }
    })
    const msg = `for ${password}, matches a ${patternName} pattern at [${i}, ${j}]`

    it(msg, () => {
      expect(included).toBeTruthy()
    })
  })

  it('should not throw when the wordSequence matcher has been removed from matchers', () => {
    const bareOmniMatch = new MatchOmni(zxcvbnOptions)
    delete bareOmniMatch.matchers.wordSequence

    expect(() => bareOmniMatch.match('password')).not.toThrow()
  })
})

describe('wordSequence ordering with async matchers', () => {
  it('should build word sequences from dictionary matches produced by an async matcher', async () => {
    const asyncDictionaryMatcher: Matcher = {
      Matching: class extends MatcherBaseClass {
        match({ password }: { password: string }): Promise<MatchExtended[]> {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve([
                {
                  pattern: 'dictionary',
                  token: password.slice(0, 6),
                  i: 0,
                  j: 5,
                  matchedWord: 'monday',
                  rank: 1,
                  dictionaryName: 'daysOfWeek',
                  reversed: false,
                  l33t: false,
                },
                {
                  pattern: 'dictionary',
                  token: password.slice(6),
                  i: 6,
                  j: password.length - 1,
                  matchedWord: 'tuesday',
                  rank: 2,
                  dictionaryName: 'daysOfWeek',
                  reversed: false,
                  l33t: false,
                },
              ])
            }, 0)
          })
        }
      },
      feedback: () => ({ warning: null, suggestions: [] }),
      scoring: () => 0,
    }

    const options = new Options(
      { translations: zxcvbnEnPackage.translations },
      { dictionary: asyncDictionaryMatcher },
    )
    const omniMatch = new MatchOmni(options)

    const result = omniMatch.match('mondaytuesday')
    expect(result).toBeInstanceOf(Promise)

    const matches = await result
    const wordSequenceMatch = matches.find(
      (match) => match.pattern === 'wordSequence',
    )
    expect(wordSequenceMatch?.wordCount).toBe(2)
  })

  // Registered via Options.matchers, so this also runs on the shorter
  // substrings RepeatMatcher recursively re-scores internally - the returned
  // match must fit within whatever password it's actually given.
  const makeAsyncWordSequenceMatch = (password: string): MatchExtended[] =>
    password.length === 0
      ? []
      : [
          {
            pattern: 'wordSequence',
            token: password,
            i: 0,
            j: password.length - 1,
            words: [password],
            wordCount: 1,
            dictionaryName: 'commonWords',
            ascending: true,
          },
        ]

  it('should resolve when only the wordSequence matcher itself is async', async () => {
    const asyncWordSequenceMatcher: Matcher = {
      Matching: class extends MatcherBaseClass {
        match({ password }: { password: string }): Promise<MatchExtended[]> {
          return Promise.resolve(makeAsyncWordSequenceMatch(password))
        }
      },
      feedback: () => ({ warning: null, suggestions: [] }),
      scoring: () => 0,
    }

    const options = new Options(
      { translations: zxcvbnEnPackage.translations },
      { wordSequence: asyncWordSequenceMatcher },
    )
    const omniMatch = new MatchOmni(options)

    const result = omniMatch.match('password')
    expect(result).toBeInstanceOf(Promise)

    const matches = await result
    expect(matches.some((match) => match.pattern === 'wordSequence')).toBe(true)
  })

  it('should resolve when the wordSequence matcher is async alongside another async matcher', async () => {
    const asyncMatcher: Matcher = {
      Matching: class extends MatcherBaseClass {
        match(): Promise<MatchExtended[]> {
          return Promise.resolve([])
        }
      },
      feedback: () => ({ warning: null, suggestions: [] }),
      scoring: () => 0,
    }
    const asyncWordSequenceMatcher: Matcher = {
      Matching: class extends MatcherBaseClass {
        match({ password }: { password: string }): Promise<MatchExtended[]> {
          return Promise.resolve(makeAsyncWordSequenceMatch(password))
        }
      },
      feedback: () => ({ warning: null, suggestions: [] }),
      scoring: () => 0,
    }

    const options = new Options(
      { translations: zxcvbnEnPackage.translations },
      { minLength: asyncMatcher, wordSequence: asyncWordSequenceMatcher },
    )
    const omniMatch = new MatchOmni(options)

    const result = omniMatch.match('password')
    expect(result).toBeInstanceOf(Promise)

    const matches = await result
    expect(matches.some((match) => match.pattern === 'wordSequence')).toBe(true)
  })
})
