import { extend, sorted } from './helper'
import Options from './Options'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

class Matching {
  match(password: string) {
    const matches: any[] = []

    const matchers = Object.keys(Options.matchers)
    matchers.forEach((key) => {
      if (!Options.matchers[key].Matching) {
        return
      }
      const matcher = new Options.matchers[key].Matching()
      extend(
        matches,
        matcher.match({
          password,
          omniMatch: this,
        }),
      )
    })
    return sorted(matches)
  }
}

export default Matching
