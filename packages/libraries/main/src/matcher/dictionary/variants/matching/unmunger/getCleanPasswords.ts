import TrieNode from './TrieNode'

interface GetAllSubCombosHelperOptions {
  substr: string
  buffer: string[]
  limit: number
  trieRoot: TrieNode
}

export interface PasswordChanges {
  letter: string
  substitution: string
}

export interface PasswordWithSubs {
  password: string
  changes: PasswordChanges[]
}

const getAllSubCombosHelper = ({
  substr,
  buffer,
  limit,
  trieRoot,
}: GetAllSubCombosHelperOptions): PasswordWithSubs[] => {
  const finalPasswords: PasswordWithSubs[] = []

  // eslint-disable-next-line max-statements
  const helper = (index: number, changes: PasswordChanges[]): void => {
    if (finalPasswords.length >= limit) {
      return
    }

    if (index === substr.length) {
      finalPasswords.push({ password: buffer.join(''), changes })
      return
    }

    const firstChar = substr.charAt(index)

    // first, generate all combos without doing a substitution at this index
    buffer.push(firstChar)
    helper(index + 1, changes)
    buffer.pop()

    // next, exhaust all possible substitutions at this index
    let cur = trieRoot
    for (let i = index; i < substr.length; i += 1) {
      const character = substr.charAt(i)
      cur = cur.getChild(character)!
      if (!cur) {
        return
      }

      if (cur.isTerminal()) {
        const subs = cur.subs!
        // eslint-disable-next-line no-restricted-syntax
        for (const sub of subs) {
          buffer.push(sub)
          const newSubs = changes.concat({
            letter: sub,
            substitution: cur.parents.join(''),
          })

          // recursively build the rest of the string
          helper(i + 1, newSubs)
          // backtrack by ignoring the added postfix
          buffer.splice(-sub.length)
          if (finalPasswords.length >= limit) {
            return
          }
        }
      }
    }
  }

  helper(0, [])

  return finalPasswords
}

const getCleanPasswords = (
  string: string,
  limit: number,
  trieRoot: TrieNode,
): PasswordWithSubs[] => {
  return getAllSubCombosHelper({
    substr: string,
    buffer: [],
    limit,
    trieRoot,
  })
}
export default getCleanPasswords
