import { zxcvbnOptions } from '../../../../Options'
import { DictionaryMatch, L33tMatch } from '../../../../types'
import { DefaultMatch } from '../../types'
import getCleanPasswords, {
  PasswordWithSubs,
} from './unmunger/getCleanPasswords'

const getExtras = (passwordWithSubs: PasswordWithSubs, token: string) => {
  const usedChanges = passwordWithSubs.changes.filter((changes) => {
    const sub = changes.substitution
    return token.indexOf(sub) !== -1
  })
  const subDisplay: string[] = []
  const filtered = usedChanges.filter((value, index, self) => {
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

  isAlreadyIncluded(matches: L33tMatch[], newMatch: L33tMatch) {
    return matches.some((l33tMatch) => {
      return Object.entries(l33tMatch).every(([key, value]) => {
        return key === 'subs' || value === newMatch[key]
      })
    })
  }

  match({ password }: { password: string }) {
    const matches: L33tMatch[] = []
    const subbedPasswords = getCleanPasswords(
      password,
      zxcvbnOptions.l33tMaxSubstitutions,
      zxcvbnOptions.trieNodeRoot,
    )
    let hasFullMatch = false
    let isFullSubstitution = true
    subbedPasswords.reverse().forEach((subbedPassword) => {
      if (hasFullMatch) {
        return
      }
      const matchedDictionary = this.defaultMatch({
        password: subbedPassword.password,
        useLevenshtein: isFullSubstitution,
      })
      // only the first entry has a full substitution
      isFullSubstitution = false
      matchedDictionary.forEach((match: DictionaryMatch) => {
        if (!hasFullMatch) {
          hasFullMatch = match.i === 0 && match.j === password.length - 1
        }
        const token = password.slice(match.i, +match.j + 1 || 9e9)
        const extras = getExtras(subbedPassword, token)
        const newMatch: L33tMatch = {
          ...match,
          l33t: true,
          token,
          ...extras,
        }
        const alreadyIncluded = this.isAlreadyIncluded(matches, newMatch)

        // only return the matches that contain an actual substitution
        if (token.toLowerCase() !== match.matchedWord && !alreadyIncluded) {
          matches.push(newMatch)
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
