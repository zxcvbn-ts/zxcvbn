import { extend, sorted } from './helper'
import { MatchExtended, MatchingType } from './types'
import dateMatcher from './matcher/date/matching'
import dictionaryMatcher from './matcher/dictionary/matching'
import regexMatcher from './matcher/regex/matching'
import repeatMatcher from './matcher/repeat/matching'
import sequenceMatcher from './matcher/sequence/matching'
import spatialMatcher from './matcher/spatial/matching'
import Options from './Options'

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
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
  }

  match(password: string) {
    const matches: MatchExtended[] = []

    const matchers = [
      ...Object.keys(this.matchers),
      ...Object.keys(Options.matchers),
    ]
    matchers.forEach((key) => {
      if (!this.matchers[key] && !Options.matchers[key]) {
        return
      }
      const Matcher = this.matchers[key]
        ? this.matchers[key]
        : Options.matchers[key].Matching
      const usedMatcher = new Matcher()

      extend(
        matches,
        usedMatcher.match({
          password,
          omniMatch: this,
        }),
      )
    })
    return sorted(matches)
  }
}

export default Matching
