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

export type IndexedPasswordChanges = PasswordChanges & { i: number }

export interface PasswordWithSubs {
  password: string
  changes: IndexedPasswordChanges[]
}

interface HelperOptions {
  onlyFullSub: boolean
  isFullSub: boolean
  index: number
  subIndex: number
  changes: IndexedPasswordChanges[]
}

class CleanPasswords {
  private substr: string

  private buffer: string[]

  private limit: number

  private trieRoot: TrieNode

  private finalPasswords: PasswordWithSubs[] = []

  constructor({
    substr,
    buffer,
    limit,
    trieRoot,
  }: GetAllSubCombosHelperOptions) {
    this.substr = substr
    this.buffer = buffer
    this.limit = limit
    this.trieRoot = trieRoot
  }

  private getAllPossibleSubsAtIndex(index: number) {
    const nodes: TrieNode[] = []
    let cur = this.trieRoot
    for (let i = index; i < this.substr.length; i += 1) {
      const character = this.substr.charAt(i)
      cur = cur.getChild(character)!
      if (!cur) {
        break
      }
      nodes.push(cur)
    }
    return nodes
  }

  // eslint-disable-next-line complexity,max-statements
  private helper({
    onlyFullSub,
    isFullSub,
    index,
    subIndex,
    changes,
  }: HelperOptions): void {
    if (this.finalPasswords.length >= this.limit) {
      return
    }

    if (index === this.substr.length) {
      if (onlyFullSub === isFullSub) {
        this.finalPasswords.push({ password: this.buffer.join(''), changes })
      }
      return
    }

    // first, exhaust all possible substitutions at this index
    const nodes: TrieNode[] = [...this.getAllPossibleSubsAtIndex(index)]

    let hasSubs = false
    // iterate backward to get wider substitutions first
    for (let i = index + nodes.length - 1; i >= index; i -= 1) {
      const cur = nodes[i - index]
      if (cur.isTerminal()) {
        hasSubs = true
        const subs = cur.subs!
        // eslint-disable-next-line no-restricted-syntax
        for (const sub of subs) {
          this.buffer.push(sub)
          const newSubs = changes.concat({
            i: subIndex,
            letter: sub,
            substitution: cur.parents.join(''),
          })

          // recursively build the rest of the string
          this.helper({
            onlyFullSub,
            isFullSub,
            index: i + 1,
            subIndex: subIndex + sub.length,
            changes: newSubs,
          })
          // backtrack by ignoring the added postfix
          this.buffer.pop()
          if (this.finalPasswords.length >= this.limit) {
            return
          }
        }
      }
    }
    // next, generate all combos without doing a substitution at this index
    // if a partial substitution is requested or there are no substitutions at this index
    if (!onlyFullSub || !hasSubs) {
      const firstChar = this.substr.charAt(index)
      this.buffer.push(firstChar)
      this.helper({
        onlyFullSub,
        isFullSub: isFullSub && !hasSubs,
        index: index + 1,
        subIndex: subIndex + 1,
        changes,
      })
      this.buffer.pop()
    }
  }

  getAll() {
    // only full substitution
    this.helper({
      onlyFullSub: true,
      isFullSub: true,
      index: 0,
      subIndex: 0,
      changes: [],
    })
    // only partial substitution
    this.helper({
      onlyFullSub: false,
      isFullSub: true,
      index: 0,
      subIndex: 0,
      changes: [],
    })

    return this.finalPasswords
  }
}

const getCleanPasswords = (
  string: string,
  limit: number,
  trieRoot: TrieNode,
): PasswordWithSubs[] => {
  const helper = new CleanPasswords({
    substr: string,
    buffer: [],
    limit,
    trieRoot,
  })

  return helper.getAll()
}
export default getCleanPasswords
