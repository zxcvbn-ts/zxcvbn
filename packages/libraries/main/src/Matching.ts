import { extend, sorted } from './helper'
import { MatchExtended, MatchingType } from './types'
import dateMatcher from './matcher/date/matching'
import dictionaryMatcher from './matcher/dictionary/matching'
import regexMatcher from './matcher/regex/matching'
import repeatMatcher from './matcher/repeat/matching'
import sequenceMatcher from './matcher/sequence/matching'
import spatialMatcher from './matcher/spatial/matching'
import separatorMatcher from './matcher/separator/matching'
import { zxcvbnOptions } from './Options'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

type Matchers = {
  [key: string]: MatchingType
}

class Matching {
  readonly matchers: Matchers = {
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    // @ts-ignore => TODO resolve this type issue. This is because it is possible to be async
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
    separator: separatorMatcher,
  }

  match(password: string): MatchExtended[] | Promise<MatchExtended[]> {
    const matches: MatchExtended[] = []

    const promises: Promise<MatchExtended[]>[] = []
    const matchers = [
      ...Object.keys(this.matchers),
      ...Object.keys(zxcvbnOptions.matchers),
    ]
    matchers.forEach((key) => {
      if (!this.matchers[key] && !zxcvbnOptions.matchers[key]) {
        return
      }
      const Matcher = this.matchers[key]
        ? this.matchers[key]
        : zxcvbnOptions.matchers[key].Matching
      const usedMatcher = new Matcher()
      const result = usedMatcher.match({
        password,
        omniMatch: this,
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
