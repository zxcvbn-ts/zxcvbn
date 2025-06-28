import { extend, sorted } from './utils/helper'
import { MatchExtended, MatchingType, UserInputsOptions } from './types'
import dateMatcher from './matcher/date/matching'
import dictionaryMatcher from './matcher/dictionary/matching'
import regexMatcher from './matcher/regex/matching'
import repeatMatcher from './matcher/repeat/matching'
import sequenceMatcher from './matcher/sequence/matching'
import spatialMatcher from './matcher/spatial/matching'
import separatorMatcher from './matcher/separator/matching'
import wordSequenceMatcher from './matcher/wordSequence/matching'
import Options from './Options'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

type Matchers = Record<string, MatchingType>

class Matching {
  private readonly matchers: Matchers = {
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
    separator: separatorMatcher,
    wordSequence: wordSequenceMatcher,
  }

  constructor(private options: Options) {}

  private matcherFactory(name: string) {
    if (!this.matchers[name] && !this.options.matchers[name]) {
      return null
    }
    const Matcher = this.matchers[name]
      ? this.matchers[name]
      : this.options.matchers[name].Matching

    return new Matcher(this.options)
  }

  private processResult(
    matches: MatchExtended[],
    promises: Promise<MatchExtended[]>[],
    result: MatchExtended[] | Promise<MatchExtended[]>,
  ) {
    if (result instanceof Promise) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      result.then((response) => {
        extend(matches, response)
      })
      promises.push(result)
    } else {
      extend(matches, result)
    }
  }

  private handlePromises(
    matches: MatchExtended[],
    promises: Promise<MatchExtended[]>[],
  ) {
    if (promises.length > 0) {
      return new Promise<MatchExtended[]>((resolve, reject) => {
        Promise.all(promises)
          .then(() => {
            resolve(sorted(matches))
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(error as Error)
          })
      })
    }
    return sorted(matches)
  }

  match(
    password: string,
    userInputsOptions?: UserInputsOptions,
  ): MatchExtended[] | Promise<MatchExtended[]> {
    const matches: MatchExtended[] = []

    const promises: Promise<MatchExtended[]>[] = []
    const matchers = [
      ...Object.keys(this.matchers),
      ...Object.keys(this.options.matchers),
    ]
    matchers.forEach((key) => {
      const matcher = this.matcherFactory(key)
      if (!matcher) {
        return
      }
      const result = matcher.match({
        password,
        omniMatch: this,
        userInputsOptions,
      })

      // extends matches and promises by references
      this.processResult(matches, promises, result)
    })

    return this.handlePromises(matches, promises)
  }
}

export default Matching
