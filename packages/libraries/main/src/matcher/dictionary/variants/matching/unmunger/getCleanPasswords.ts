import TrieNode from './TrieNode'

interface GetAllSubCombosHelperOptions {
  substr: string
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
  lastSubLetter?: string
  consecutiveSubCount: number
}

class CleanPasswords {
  private substr: string

  private buffer: string[] = []

  private limit: number

  private trieRoot: TrieNode

  private finalPasswords: PasswordWithSubs[] = []

  constructor({ substr, limit, trieRoot }: GetAllSubCombosHelperOptions) {
    this.substr = substr
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
    lastSubLetter,
    consecutiveSubCount,
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
        // Skip if this would be a 4th or more consecutive substitution of the same letter
        // this should work in all language as there shouldn't be the same letter more than four times in a row
        // So we can ignore the rest to save calculation time
        if (
          lastSubLetter === cur.parents.join('') &&
          consecutiveSubCount >= 3
        ) {
          // eslint-disable-next-line no-continue
          continue
        }
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
            lastSubLetter: cur.parents.join(''),
            consecutiveSubCount:
              lastSubLetter === cur.parents.join('')
                ? consecutiveSubCount + 1
                : 1,
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
        lastSubLetter,
        consecutiveSubCount,
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
      lastSubLetter: undefined,
      consecutiveSubCount: 0,
    })
    // only partial substitution
    this.helper({
      onlyFullSub: false,
      isFullSub: true,
      index: 0,
      subIndex: 0,
      changes: [],
      lastSubLetter: undefined,
      consecutiveSubCount: 0,
    })

    return this.finalPasswords
  }
}

const getCleanPasswords = (
  password: string,
  limit: number,
  trieRoot: TrieNode,
): PasswordWithSubs[] => {
  const helper = new CleanPasswords({
    substr: password,
    limit,
    trieRoot,
  })

  return helper.getAll()
}
export default getCleanPasswords
