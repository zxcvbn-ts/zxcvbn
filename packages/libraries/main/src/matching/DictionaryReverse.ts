import { sorted } from '../helper'
import MatchDictionary from './Dictionary'
import { DictionaryMatch } from '../types'

interface DictionaryReverseMatchOptions {
  password: string
}
/*
 * -------------------------------------------------------------------------------
 *  Dictionary reverse ----------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchDictionaryReverse {
  MatchDictionary: any

  constructor() {
    this.MatchDictionary = new MatchDictionary()
  }

  match({ password }: DictionaryReverseMatchOptions) {
    const passwordReversed = password.split('').reverse().join('')
    const matches = this.MatchDictionary.match({
      password: passwordReversed,
    }).map((match: DictionaryMatch) => ({
      ...match,
      token: match.token.split('').reverse().join(''), // reverse back
      reversed: true,
      // map coordinates back to original string
      i: password.length - 1 - match.j,
      j: password.length - 1 - match.i,
    }))
    return sorted(matches)
  }
}

export default MatchDictionaryReverse
