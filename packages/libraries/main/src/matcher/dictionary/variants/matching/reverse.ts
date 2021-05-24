import { DictionaryMatch } from '../../../../types'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary reverse matching --------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchL33t {
  defaultMatch: Function

  constructor(defaultMatch: Function) {
    this.defaultMatch = defaultMatch
  }

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

export default MatchL33t
