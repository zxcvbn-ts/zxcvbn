export interface TrieTerminalInfo {
  dictionaryName: string
  rank: number
  reversed: boolean
}

export interface DictionaryTrieNode {
  children?: Map<string, DictionaryTrieNode>

  terminals?: TrieTerminalInfo[]
}

export class DictionaryTrie {
  root: DictionaryTrieNode = {}

  add(word: string, dictionaryName: string, rank: number, reversed: boolean) {
    let node = this.root
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < word.length; i += 1) {
      const char = word[i]
      if (!node.children) {
        node.children = new Map()
      }
      let nextNode = node.children.get(char)
      if (!nextNode) {
        nextNode = {}
        node.children.set(char, nextNode)
      }
      node = nextNode
    }
    if (!node.terminals) {
      node.terminals = []
    }
    node.terminals.push({ dictionaryName, rank, reversed })
  }
}
