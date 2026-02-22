// @ts-expect-error for testing purposes
import {
  MatchExtended,
  MatchOptions,
  Options,
  MatcherBaseClass,
} from '@zxcvbn-ts/core'
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
  return class MatchPwned extends MatcherBaseClass {
    constructor(options: Options) {
      super(options)
    }

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
}
