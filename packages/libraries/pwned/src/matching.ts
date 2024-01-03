// @ts-ignore
import { MatchExtended, MatchOptions } from '@zxcvbn-ts/core'
import haveIBeenPwned from './haveIBeenPwned'
import { FetchApi, MatcherPwnedFactoryConfig } from './types'

/*
 * -------------------------------------------------------------------------------
 *  Have i been pwned matching factory ---------------------------------------------------
 * -------------------------------------------------------------------------------
 */
export default (
  universalFetch: FetchApi,
  { url, networkErrorHandler }: MatcherPwnedFactoryConfig,
) => {
  return class MatchPwned {
    async match({ password }: MatchOptions) {
      const matches: MatchExtended[] = []
      const pwned = await haveIBeenPwned(password, {
        universalFetch,
        url,
        networkErrorHandler,
      })
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
