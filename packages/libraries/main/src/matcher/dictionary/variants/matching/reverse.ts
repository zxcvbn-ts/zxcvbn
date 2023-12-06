import { DictionaryMatch } from '../../../../types'
import { DefaultMatch } from '../../types'
import { Options } from '../../../../Options'

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

  match({ password }: { password: string }) {
    const passwordReversed = password.split('').reverse().join('')
    return this.defaultMatch({
      password: passwordReversed,
    }).map((match: DictionaryMatch) => ({
      ...match,
      token: match.token.split('').reverse().join(''), // reverse back
      reversed: true,
      // map coordinates back to original string
      i: password.length - 1 - match.j,
      j: password.length - 1 - match.i,
    }))
  }
}

export default MatchReverse
