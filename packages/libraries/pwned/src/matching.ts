// @ts-ignore
import { MatchExtended, MatchOptions } from '@zxcvbn-ts/core'
import haveIBeenPwned from './haveIBeenPwned'
import { FetchApi } from './types'

/*
 * -------------------------------------------------------------------------------
 *  Have i been pwned matching factory ---------------------------------------------------
 * -------------------------------------------------------------------------------
 */
export default (universalFetch: FetchApi, url?: string) => {
  return class MatchPwned {
    async match({ password }: MatchOptions) {
      const matches: MatchExtended[] = []
      const pwned = await haveIBeenPwned(password, universalFetch, url)
      if (pwned) {
        // @ts-ignore
        matches.push({
          pattern: 'pwned',
          pwnedAmount: parseInt(pwned.split(':')[1], 10),
          i: 0,
          j: password.length - 1,
          token: password,
        })
      }
      return matches
    }
  }
}
