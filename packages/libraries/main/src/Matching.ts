import { extend, sorted } from './helper'
import matcher from './matcher'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

class Matching {
  match(password: string) {
    const matches: any[] = []

    const matchers = Object.keys(matcher.matchers)
    matchers.forEach((key) => {
      if (!matcher.matchers[key].Matching) {
        return
      }
      const usedMatcher = new matcher.matchers[key].Matching()
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
