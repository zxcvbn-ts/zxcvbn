import TrieNode from './TrieNode'

// interface GetAllSubCombosHelperOptions {
//   substr: string
//   index: number
//   buffer: string[]
//   finalPasswords: string[]
//   limit: number
//   trieRoot: TrieNode
// }
// const getAllSubCombosHelper = ({
//   substr,
//   index,
//   buffer,
//   finalPasswords,
//   limit,
//   trieRoot,
// }: GetAllSubCombosHelperOptions): void => {
//   if (finalPasswords.length >= limit) {
//     return
//   }
//
//   if (index === substr.length) {
//     // reached the end; add the contents of the buffer to the list of combinations
//     finalPasswords.push(buffer.join(''))
//     return
//   }
//
//   const firstChar = substr.charAt(index)
//
//   // first, generate all combos without doing a substitution at this index
//   buffer.push(firstChar)
//   getAllSubCombosHelper({
//     substr,
//     index: index + 1,
//     buffer,
//     finalPasswords,
//     limit,
//     trieRoot,
//   })
//   // eslint-disable-next-line no-param-reassign
//   buffer.length -= 1
//
//   // next, exhaust all possible substitutions at this index
//   let cur = trieRoot
//   for (let i = index; i < substr.length; i += 1) {
//     const c = substr.charAt(i)
//     cur = cur.getChild(c)!
//     if (cur === null || cur === undefined) {
//       return
//     }
//
//     if (cur.isTerminal()) {
//       const subs = cur.subs!
//       // eslint-disable-next-line no-restricted-syntax
//       for (const sub of subs) {
//         buffer.push(sub)
//         // recursively build the rest of the string
//         getAllSubCombosHelper({
//           substr,
//           index: i + 1,
//           buffer,
//           finalPasswords,
//           limit,
//           trieRoot,
//         })
//         // backtrack by ignoring the added postfix
//         // eslint-disable-next-line no-param-reassign
//         buffer.length -= sub.length
//         console.log(buffer)
//         if (finalPasswords.length >= limit) {
//           return
//         }
//       }
//     }
//   }
// }
interface GetAllSubCombosHelperOptions {
  substr: string
  buffer: string[]
  limit: number
  trieRoot: TrieNode
}

export interface PasswordChanges {
  letter: string
  substitutions: string
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
            substitutions: cur.parents.join(''),
          })

          // sub: {
          //   0: 'o',
          //     4: 'a',
          //     $: 's',
          // },
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
  // const combos: string[] = []
  return getAllSubCombosHelper({
    substr: string,
    buffer: [],
    limit,
    trieRoot,
  })
  // return combos
}
export default getCleanPasswords
