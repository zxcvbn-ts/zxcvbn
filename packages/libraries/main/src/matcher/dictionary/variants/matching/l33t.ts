import { empty, translate } from '../../../../helper'
import zxcvbnOptions from '../../../../Options'
import {
  DictionaryMatch,
  L33tMatch,
  LooseObject,
  OptionsL33tTable,
} from '../../../../types'
import { DefaultMatch } from '../../types'

type Subs = string[][][]

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
    const enumeratedSubs = this.enumerateL33tSubs(
      this.relevantL33tSubtable(password, zxcvbnOptions.l33tTable),
    )
    const length = Math.min(
      enumeratedSubs.length,
      zxcvbnOptions.l33tMaxSubstitutions,
    )
    for (let i = 0; i < length; i += 1) {
      const sub = enumeratedSubs[i]
      // corner case: password has no relevant subs.
      if (empty(sub)) {
        break
      }
      const subbedPassword = translate(password, sub)
      const matchedDictionary = this.defaultMatch({
        password: subbedPassword,
      })
      matchedDictionary.forEach((match: DictionaryMatch) => {
        const token = password.slice(match.i, +match.j + 1 || 9e9)
        // only return the matches that contain an actual substitution
        if (token.toLowerCase() !== match.matchedWord) {
          // subset of mappings in sub that are in use for this match
          const matchSub: LooseObject = {}
          Object.keys(sub).forEach((subbedChr) => {
            const chr = sub[subbedChr]
            if (token.indexOf(subbedChr) !== -1) {
              matchSub[subbedChr] = chr
            }
          })
          const subDisplay = Object.keys(matchSub)
            .map((k) => `${k} -> ${matchSub[k]}`)
            .join(', ')
          matches.push({
            ...match,
            l33t: true,
            token,
            sub: matchSub,
            subDisplay,
          })
        }
      })
    }
    // filter single-character l33t matches to reduce noise.
    // otherwise '1' matches 'i', '4' matches 'a', both very common English words
    // with low dictionary rank.
    return matches.filter((match) => match.token.length > 1)
  }

  // makes a pruned copy of l33t_table that only includes password's possible substitutions
  relevantL33tSubtable(password: string, table: OptionsL33tTable) {
    const passwordChars: LooseObject = {}
    const subTable: LooseObject = {}
    password.split('').forEach((char: string) => {
      passwordChars[char] = true
    })

    Object.keys(table).forEach((letter) => {
      const subs = table[letter as keyof typeof table]
      const relevantSubs = subs.filter((sub: string) => sub in passwordChars)
      if (relevantSubs.length > 0) {
        subTable[letter] = relevantSubs
      }
    })
    return subTable
  }

  // returns the list of possible 1337 replacement dictionaries for a given password
  enumerateL33tSubs(table: OptionsL33tTable) {
    const tableKeys = Object.keys(table)
    const subs = this.getSubs(tableKeys, [[]], table)
    // convert from assoc lists to dicts
    return subs.map((sub) => {
      const subDict: LooseObject = {}
      sub.forEach(([l33tChr, chr]) => {
        subDict[l33tChr] = chr
      })
      return subDict
    })
  }

  getSubs(keys: string[], subs: Subs, table: OptionsL33tTable): Subs {
    if (!keys.length) {
      return subs
    }
    const firstKey = keys[0]
    const restKeys = keys.slice(1)
    const nextSubs: Subs = []
    table[firstKey as keyof typeof table].forEach((l33tChr: string) => {
      subs.forEach((sub) => {
        let dupL33tIndex = -1
        for (let i = 0; i < sub.length; i += 1) {
          if (sub[i][0] === l33tChr) {
            dupL33tIndex = i
            break
          }
        }
        if (dupL33tIndex === -1) {
          const subExtension = sub.concat([[l33tChr, firstKey]])
          nextSubs.push(subExtension)
        } else {
          const subAlternative = sub.slice(0)
          subAlternative.splice(dupL33tIndex, 1)
          subAlternative.push([l33tChr, firstKey])
          nextSubs.push(sub)
          nextSubs.push(subAlternative)
        }
      })
    })
    const newSubs = this.dedup(nextSubs)
    if (restKeys.length) {
      return this.getSubs(restKeys, newSubs, table)
    }
    return newSubs
  }

  dedup(subs: Subs) {
    const deduped: Subs = []
    const members: LooseObject = {}
    subs.forEach((sub) => {
      const assoc = sub.map((k, index) => [k, index])
      assoc.sort()
      const label = assoc.map(([k, v]) => `${k},${v}`).join('-')
      if (!(label in members)) {
        members[label] = true
        deduped.push(sub)
      }
    })
    return deduped
  }
}

export default MatchL33t
