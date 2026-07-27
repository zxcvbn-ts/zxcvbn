import l33tTableToTrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode.ts'
import TrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/TrieNode.ts'

describe('l33t table to trie node', () => {
  it('should convert correctly', () => {
    expect(
      l33tTableToTrieNode(
        {
          a: ['@', '4'],
          f: ['v'],
          m: ['^^', 'nn', '2n', '/\\\\/\\\\'],
          u: ['|_|', 'v'],
          w: ['vv'],
        },
        new TrieNode(),
      ),
    ).toMatchSnapshot()
  })
})
