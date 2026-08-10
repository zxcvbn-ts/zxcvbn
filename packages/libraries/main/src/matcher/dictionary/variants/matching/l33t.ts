import { DictionaryMatch, L33tMatch } from '../../../../types.ts'
import { DictionaryMatchOptions } from '../../types.ts'
import getCleanPasswords, {
  PasswordChanges,
  PasswordWithSubs,
} from './unmunger/getCleanPasswords.ts'
import MatchDictionary from '../../matching.ts'

const getExtras = (
  passwordWithSubs: PasswordWithSubs,
  i: number,
  j: number,
) => {
  let iUnsubbed = i
  let jUnsubbed = j
  const filtered: PasswordChanges[] = []
  const subDisplay: string[] = []
  const seenSubs = new Set<string>()

  passwordWithSubs.changes.forEach((change) => {
    if (change.i < i) {
      const diff = change.substitution.length - change.letter.length
      iUnsubbed += diff
      jUnsubbed += diff
    } else if (change.i <= j) {
      jUnsubbed += change.substitution.length - change.letter.length

      const subKey = `${change.letter}-${change.substitution}`
      if (!seenSubs.has(subKey)) {
        seenSubs.add(subKey)
        filtered.push({
          letter: change.letter,
          substitution: change.substitution,
        })
        subDisplay.push(`${change.substitution} -> ${change.letter}`)
      }
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
class MatchL33t extends MatchDictionary {
  private isAlreadyIncluded(matches: L33tMatch[], newMatch: L33tMatch) {
    return matches.some((l33tMatch) => {
      return (
        l33tMatch.i === newMatch.i &&
        l33tMatch.j === newMatch.j &&
        l33tMatch.dictionaryName === newMatch.dictionaryName &&
        l33tMatch.matchedWord === newMatch.matchedWord
      )
    })
  }

  public match(matchOptions: DictionaryMatchOptions) {
    const matches: L33tMatch[] = []
    const subbedPasswords = getCleanPasswords(
      matchOptions.password,
      this.options.l33tMaxSubstitutions,
      this.options.trieNodeRoot,
    )
    let hasFullMatch = false
    subbedPasswords.forEach((subbedPassword) => {
      if (hasFullMatch) {
        return
      }
      const matchedDictionary = super.match({
        ...matchOptions,
        password: subbedPassword.password,
        useLevenshtein: subbedPassword.isFullSubstitution,
      })
      matchedDictionary.forEach((match: DictionaryMatch) => {
        const extras = getExtras(subbedPassword, match.i, match.j)
        if (!hasFullMatch) {
          hasFullMatch =
            extras.i === 0 && extras.j === matchOptions.password.length - 1
        }
        const token = matchOptions.password.slice(extras.i, extras.j + 1)
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
