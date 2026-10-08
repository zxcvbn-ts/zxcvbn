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
    // Array.from splits by Unicode code point rather than UTF-16 code unit,
    // so surrogate pairs (eg. emoji) survive the reversal intact.
    const passwordReversed = Array.from(matchOptions.password)
      .reverse()
      .join('')
    return super
      .match({
        ...matchOptions,
        password: passwordReversed,
      })
      .map((match: DictionaryMatch) => ({
        ...match,
        token: Array.from(match.token).reverse().join(''), // reverse back
        reversed: true,
        // map coordinates back to original string
        i: matchOptions.password.length - 1 - match.j,
        j: matchOptions.password.length - 1 - match.i,
      }))
  }
}

export default MatchReverse
