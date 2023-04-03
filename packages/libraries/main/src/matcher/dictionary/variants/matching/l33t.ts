import { zxcvbnOptions } from '../../../../Options'
import { DictionaryMatch, L33tMatch } from '../../../../types'
import { DefaultMatch } from '../../types'
import getCleanPasswords, {
  PasswordWithSubs,
} from './unmunger/getCleanPasswords'

const getExtras = (passwordWithSubs: PasswordWithSubs) => {
  const subDisplay: string[] = []
  const filtered = passwordWithSubs.changes.filter((value, index, self) => {
    const existingIndex = self.findIndex((t) => {
      return t.letter === value.letter && t.substitution === value.substitution
    })
    return index === existingIndex
  })
  filtered.forEach((value) => {
    subDisplay.push(`${value.substitution} -> ${value.letter}`)
  })
  return {
    subs: filtered,
    subDisplay: subDisplay.join(', '),
  }
}

/*
 * -------------------------------------------------------------------------------
 *  Dictionary l33t matching -----------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchL33t {
  defaultMatch: DefaultMatch

  constructor(defaultMatch: DefaultMatch) {
    this.defaultMatch = defaultMatch
  }

  match({ password }: { password: string }) {
    const matches: L33tMatch[] = []
    const subbedPasswords = getCleanPasswords(
      password,
      zxcvbnOptions.l33tMaxSubstitutions,
      zxcvbnOptions.trieNodeRoot,
    )
    subbedPasswords.forEach((subbedPassword) => {
      const matchedDictionary = this.defaultMatch({
        password: subbedPassword.password,
      })
      matchedDictionary.forEach((match: DictionaryMatch) => {
        const token = password.slice(match.i, +match.j + 1 || 9e9)
        // only return the matches that contain an actual substitution
        if (token.toLowerCase() !== match.matchedWord) {
          const extras = getExtras(subbedPassword)
          matches.push({
            ...match,
            l33t: true,
            token,
            ...extras,
          })
        }
      })
    })

    // filter single-character l33t matches to reduce noise.
    // otherwise '1' matches 'i', '4' matches 'a', both very common English words
    // with low dictionary rank.
    return matches.filter((match) => match.token.length > 1)
  }
}

export default MatchL33t
