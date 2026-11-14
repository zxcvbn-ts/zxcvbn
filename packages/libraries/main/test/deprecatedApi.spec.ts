/* eslint-disable @typescript-eslint/no-deprecated -- tests the deprecated API */
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { MatcherBaseClass, ZxcvbnFactory } from '../src'
import type {
  Match,
  MatchExtended,
  MatchOptions,
  Matcher,
  Optimal,
  RankedDictionaries,
  RankedDictionary,
  UserInputsOptions,
} from '../src'

// Custom matchers written against 4.2, they only use what is exported and
// what MatchOptions and this.options gave them back then.
const createMatcher = (
  match: (this: MatcherBaseClass, options: MatchOptions) => Match[],
): Matcher => ({
  Matching: class extends MatcherBaseClass {
    match(options: MatchOptions) {
      return match.call(this, options)
    }
  },
  feedback: () => null,
  scoring: () => 1,
})

describe('deprecated API', () => {
  it('gives a custom matcher the ranked dictionaries while checking', () => {
    const seen: {
      rankedDictionaries: RankedDictionaries
      rankedDictionariesMaxWordSize: Record<string, number>
      rankedDictionary: RankedDictionary
      rankedDictionaryMaxWordSize: number
    }[] = []
    const zxcvbn = new ZxcvbnFactory(
      {
        translations: zxcvbnEnPackage.translations,
        dictionary: { companyNames: ['acme', 'initech', 'umbrella'] },
      },
      {
        reader: createMatcher(function read({ userInputsOptions }) {
          // as a matcher of 4.2 read it, without checking for undefined
          const userInputs = userInputsOptions!
          seen.push({
            rankedDictionaries: this.options.rankedDictionaries,
            rankedDictionariesMaxWordSize:
              this.options.rankedDictionariesMaxWordSize,
            rankedDictionary: userInputs.rankedDictionary,
            rankedDictionaryMaxWordSize: userInputs.rankedDictionaryMaxWordSize,
          })
          return []
        }),
      },
    )

    zxcvbn.check('initech2024', ['Peter', 'Gibbons', 1999])

    expect(seen[0]).toEqual({
      rankedDictionaries: {
        companyNames: { acme: 1, initech: 2, umbrella: 3 },
      },
      rankedDictionariesMaxWordSize: { companyNames: 8 },
      rankedDictionary: { peter: 1, gibbons: 2, 1999: 3 },
      rankedDictionaryMaxWordSize: 7,
    })
  })

  it('matches the user inputs of an object built by hand for omniMatch', () => {
    const found: MatchExtended[] = []
    // omniMatch runs this matcher again, it only checks the first time
    let checking = false
    const zxcvbn = new ZxcvbnFactory(
      { translations: zxcvbnEnPackage.translations },
      {
        builder: createMatcher(function build({ password, omniMatch }) {
          if (checking) {
            return []
          }
          checking = true
          // the shape of 4.2, without wordIndex
          const userInputsOptions: UserInputsOptions = {
            rankedDictionary: { wendydarling: 1, peterpan: 2 },
            rankedDictionaryMaxWordSize: 12,
          }
          const matches = omniMatch.match(
            password,
            userInputsOptions,
          ) as MatchExtended[]
          found.push(
            ...matches.filter(
              (match) =>
                match.pattern === 'dictionary' &&
                match.dictionaryName === 'userInputs',
            ),
          )
          return []
        }),
      },
    )

    zxcvbn.check('p3terp4n')

    expect(
      found.map(({ token, matchedWord, rank, l33t }) => ({
        token,
        matchedWord,
        rank,
        l33t,
      })),
    ).toEqual([
      { token: 'p3terp4n', matchedWord: 'peterpan', rank: 2, l33t: true },
    ])
  })

  it('still exports the removed types', () => {
    const optimal: Optimal = {
      bestMatches: [],
      guessesProduct: [],
      totalGuesses: [],
    }
    const rankedDictionaries: RankedDictionaries = { words: { word: 1 } }
    expect([optimal, rankedDictionaries]).toBeDefined()
  })
})
