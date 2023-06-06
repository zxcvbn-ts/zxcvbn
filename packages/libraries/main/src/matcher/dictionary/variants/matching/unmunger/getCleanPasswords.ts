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

export type IndexedPasswordChanges = PasswordChanges & {i: number}

export interface PasswordWithSubs {
  password: string
  changes: IndexedPasswordChanges[]
}

const getAllSubCombosHelper = ({
  substr,
  buffer,
  limit,
  trieRoot,
}: GetAllSubCombosHelperOptions): PasswordWithSubs[] => {
  const finalPasswords: PasswordWithSubs[] = []

  // eslint-disable-next-line max-statements
  const helper = (
    onlyFullSub: boolean,
    isFullSub: boolean,
    index: number,
    subIndex: number,
    changes: IndexedPasswordChanges[],
  ): void => {
    if (finalPasswords.length >= limit) {
      return
    }

    if (index === substr.length) {
      if (onlyFullSub === isFullSub) {
        finalPasswords.push({ password: buffer.join(''), changes })
      }
      return
    }

    // first, exhaust all possible substitutions at this index
    const nodes: TrieNode[] = []
    let cur = trieRoot
    for (let i = index; i < substr.length; i += 1) {
      const character = substr.charAt(i)
      cur = cur.getChild(character)!
      if (!cur) {
        break
      }
      nodes.push(cur)
    }
    let hasSubs = false
    // iterate backward to get wider substitutions first
    for (let i = index + nodes.length - 1; i >= index; i -= 1) {
      cur = nodes[i - index]
      if (cur.isTerminal()) {
        hasSubs = true
        const subs = cur.subs!
        // eslint-disable-next-line no-restricted-syntax
        for (const sub of subs) {
          buffer.push(sub)
          const newSubs = changes.concat({
            i: subIndex,
            letter: sub,
            substitution: cur.parents.join(''),
          })

          // recursively build the rest of the string
          helper(onlyFullSub, isFullSub, i + 1, subIndex + sub.length, newSubs)
          // backtrack by ignoring the added postfix
          buffer.pop()
          if (finalPasswords.length >= limit) {
            return
          }
        }
      }
    }
    // next, generate all combos without doing a substitution at this index
    // if a partial substitution is requested or there are no substitutions at this index
    if (!onlyFullSub || !hasSubs) {
      const firstChar = substr.charAt(index)
      buffer.push(firstChar)
      helper(onlyFullSub, isFullSub && !hasSubs, index + 1, subIndex + 1, changes)
      buffer.pop()
    }
  }

  // only full substitution
  helper(true, true, 0, 0, [])
  // only partial substitution
  helper(false, true, 0, 0, [])

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
