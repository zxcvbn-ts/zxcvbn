import { extend, sorted } from './utils/helper'
import { MatchExtended, MatchingType, UserInputsOptions } from './types'
import dateMatcher from './matcher/date/matching'
import dictionaryMatcher from './matcher/dictionary/matching'
import regexMatcher from './matcher/regex/matching'
import repeatMatcher from './matcher/repeat/matching'
import sequenceMatcher from './matcher/sequence/matching'
import spatialMatcher from './matcher/spatial/matching'
import separatorMatcher from './matcher/separator/matching'
import { Options } from './Options'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

type Matchers = {
  [key: string]: MatchingType
}

class Matching {
  private readonly matchers: Matchers = {
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    // @ts-ignore => TODO resolve this type issue. This is because it is possible to be async
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
    separator: separatorMatcher,
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

      if (result instanceof Promise) {
        result.then((response) => {
          extend(matches, response)
        })
        promises.push(result)
      } else {
        extend(matches, result)
      }
    })
    if (promises.length > 0) {
      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then(() => {
            resolve(sorted(matches))
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
    return sorted(matches)
  }
}

export default Matching
