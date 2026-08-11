import MatchDictionary from '../../matching'
import { DictionaryMatch } from '../../../../types'
import { DictionaryMatchOptions } from '../../types'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary reverse matching --------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchReverse extends MatchDictionary {
  public match(matchOptions: DictionaryMatchOptions) {
    const passwordReversed = matchOptions.password.split('').reverse().join('')
    return super
      .match({
        ...matchOptions,
        password: passwordReversed,
      })
      .map((match: DictionaryMatch) => ({
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
