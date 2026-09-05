import { DictionaryTrie } from '../../../src/matcher/dictionary/DictionaryTrie'

describe('DictionaryTrie', () => {
  it('does not attach a terminal to the root for an empty-string word', () => {
    const trie = new DictionaryTrie()
    trie.add('', { dictionaryName: 'words', rank: 1, reversed: false })
    expect(trie.root.terminals).toBeUndefined()
  })

  it('still adds non-empty words normally', () => {
    const trie = new DictionaryTrie()
    trie.add('cat', { dictionaryName: 'words', rank: 1, reversed: false })
    expect(trie.root.children?.get('c')).toBeDefined()
  })
})
