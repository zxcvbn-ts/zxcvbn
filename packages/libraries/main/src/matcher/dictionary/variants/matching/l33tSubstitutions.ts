import { OptionsL33tTable } from '../../../../types'
import { toLowerCase } from '../../../../utils/helper'

export interface L33tSubstitution {
  // eg. '4' or '|<'
  substitution: string
  // the letters it can stand for, as in the l33t table
  letters: string[]
  // the same letters lowercased, as the words of the word index are
  lettersLower: string[]
}

// The substitutions of a l33t table by their first character, the longest
// first, so wider substitutions are tried before narrower ones
export type L33tSubstitutions = Map<string, L33tSubstitution[]>

export default (l33tTable: OptionsL33tTable): L33tSubstitutions => {
  const bySubstitution = new Map<string, L33tSubstitution>()
  Object.entries(l33tTable).forEach(([letter, substitutions]) => {
    substitutions.forEach((substitution) => {
      // an empty substitution never matches a character
      if (substitution === '') {
        return
      }
      let entry = bySubstitution.get(substitution)
      if (!entry) {
        entry = { substitution, letters: [], lettersLower: [] }
        bySubstitution.set(substitution, entry)
      }
      entry.letters.push(letter)
      entry.lettersLower.push(toLowerCase(letter))
    })
  })
  const result: L33tSubstitutions = new Map()
  bySubstitution.forEach((entry) => {
    const firstCharacter = entry.substitution.charAt(0)
    const entries = result.get(firstCharacter) || []
    entries.push(entry)
    result.set(firstCharacter, entries)
  })
  result.forEach((entries) =>
    entries.sort(
      (first, second) => second.substitution.length - first.substitution.length,
    ),
  )
  return result
}
