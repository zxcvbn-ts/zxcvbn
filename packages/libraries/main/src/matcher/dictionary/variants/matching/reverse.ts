import { DictionaryMatch } from '../../../../types'
import { DefaultMatch, DictionaryMatchOptions } from '../../types'
import Options from '../../../../Options'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary reverse matching --------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchReverse {
  constructor(
    private options: Options,
    private defaultMatch: DefaultMatch,
  ) {}

  match(matchOptions: DictionaryMatchOptions) {
    const passwordReversed = matchOptions.password.split('').reverse().join('')
    return this.defaultMatch({
      ...matchOptions,
      password: passwordReversed,
    }).map((match: DictionaryMatch) => ({
      ...match,
      token: match.token.split('').reverse().join(''), // reverse back
      reversed: true,
      // map coordinates back to original string
      i: matchOptions.password.length - 1 - match.j,
      j: matchOptions.password.length - 1 - match.i,
    }))
  }
}

export default MatchReverse
