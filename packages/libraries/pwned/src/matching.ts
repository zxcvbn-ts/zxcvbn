import {
  MatchExtended,
  MatchOptions,
  MatcherBaseClass,
  MatcherConstructor,
} from '@zxcvbn-ts/core'
import haveIBeenPwned from './haveIBeenPwned'
import { FetchApi, MatcherPwnedFactoryConfig } from './types'

const matchingFactory = (
  universalFetch: FetchApi,
  { url, networkErrorHandler }: MatcherPwnedFactoryConfig,
): MatcherConstructor => {
  class MatchPwned extends MatcherBaseClass {
    async match({ password }: MatchOptions) {
      const matches: MatchExtended[] = []
      const pwned = await haveIBeenPwned(password, {
        universalFetch,
        url,
        networkErrorHandler,
      })
      if (pwned) {
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

  return MatchPwned
}
/*
 * -------------------------------------------------------------------------------
 *  Have i been pwned matching factory ---------------------------------------------------
 * -------------------------------------------------------------------------------
 */
export default matchingFactory
