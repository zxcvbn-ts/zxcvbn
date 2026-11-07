import { DictionaryMatch, L33tMatch } from '../../../../types'
import { DictionaryHit, DictionaryMatchOptions } from '../../types'
import getCleanPasswords, {
  PasswordChanges,
  PasswordWithSubs,
} from './unmunger/getCleanPasswords'
import MatchDictionary from '../../matching'
import { countCharacters, toLowerCase } from '../../../../utils/helper'

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

// a window [i, j] without a substitution was already checked by the plain
// dictionary matcher, so for each i find the first j that reaches one
const getMinWindowEnds = ({ password, changes }: PasswordWithSubs) => {
  const minWindowEnds: number[] = []
  let changeIndex = 0
  for (let i = 0; i < password.length; i += 1) {
    // changes are ordered by position, skip the ones that end before i
    while (
      changeIndex < changes.length &&
      changes[changeIndex].i + changes[changeIndex].letter.length <= i
    ) {
      changeIndex += 1
    }
    minWindowEnds.push(
      changeIndex < changes.length
        ? Math.max(i, changes[changeIndex].i)
        : password.length,
    )
  }
  return minWindowEnds
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
    // the substituted passwords share most of their substrings
    const lookupCache = new Map<string, DictionaryHit[]>()
    let hasFullMatch = false
    subbedPasswords.forEach((subbedPassword) => {
      if (hasFullMatch) {
        return
      }
      const matchedDictionary = super.match({
        ...matchOptions,
        password: subbedPassword.password,
        useLevenshtein: subbedPassword.isFullSubstitution,
        minWindowEnds: getMinWindowEnds(subbedPassword),
        lookupCache,
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
        if (toLowerCase(token) !== match.matchedWord && !alreadyIncluded) {
          matches.push(newMatch)
        }
      })
    })

    // filter single-character l33t matches to reduce noise.
    // otherwise '1' matches 'i', '4' matches 'a', both very common English words
    // with low dictionary rank.
    return matches.filter((match) => countCharacters(match.token) > 1)
  }
}

export default MatchL33t
