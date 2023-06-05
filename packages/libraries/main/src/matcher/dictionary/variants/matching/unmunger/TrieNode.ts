export default class TrieNode {
  constructor(public parents: string[] = []) {}

  // eslint-disable-next-line no-use-before-define
  children: Map<string, TrieNode> = new Map()

  subs?: string[]

  addSub(key: string, ...subs: string[]): TrieNode {
    const firstChar = key.charAt(0)
    if (!this.children.has(firstChar)) {
      this.children.set(firstChar, new TrieNode([...this.parents, firstChar]))
    }
    let cur = this.children.get(firstChar)!
    for (let i = 1; i < key.length; i += 1) {
      const c = key.charAt(i)
      if (!cur.hasChild(c)) {
        cur.addChild(c)
      }
      cur = cur.getChild(c)!
    }
    cur.subs = (cur.subs || []).concat(subs)
    return this
  }

  getChild(child: string): TrieNode | undefined {
    return this.children.get(child)
  }

  isTerminal(): boolean {
    return !!this.subs
  }

  addChild(child: string): void {
    if (!this.hasChild(child)) {
      this.children.set(child, new TrieNode([...this.parents, child]))
    }
  }

  hasChild(child: string): boolean {
    return this.children.has(child)
  }
}
