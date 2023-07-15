import { zxcvbnOptions } from '../../../../Options'
import { DictionaryMatch, L33tMatch } from '../../../../types'
import { DefaultMatch } from '../../types'
import getCleanPasswords, {
  PasswordChanges,
  PasswordWithSubs,
} from './unmunger/getCleanPasswords'

const getExtras = (
  passwordWithSubs: PasswordWithSubs,
  i: number,
  j: number,
) => {
  const previousChanges = passwordWithSubs.changes.filter((changes) => {
    return changes.i < i
  })
  const iUnsubbed = previousChanges.reduce((value, change) => {
    return value - change.letter.length + change.substitution.length
  }, i)
  const usedChanges = passwordWithSubs.changes.filter((changes) => {
    return changes.i >= i && changes.i <= j
  })
  const jUnsubbed = usedChanges.reduce(
    (value, change) => {
      return value - change.letter.length + change.substitution.length
    },
    j - i + iUnsubbed,
  )
  const filtered: PasswordChanges[] = []
  const subDisplay: string[] = []
  usedChanges.forEach((value) => {
    const existingIndex = filtered.findIndex((t) => {
      return t.letter === value.letter && t.substitution === value.substitution
    })
    if (existingIndex < 0) {
      filtered.push({
        letter: value.letter,
        substitution: value.substitution,
      })
      subDisplay.push(`${value.substitution} -> ${value.letter}`)
    }
  })
  return {
    i: iUnsubbed,
    j: jUnsubbed,
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
    subbedPasswords.forEach((subbedPassword) => {
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
        const extras = getExtras(subbedPassword, match.i, match.j)
        const token = password.slice(extras.i, +extras.j + 1 || 9e9)
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
