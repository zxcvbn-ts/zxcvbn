import l33tTableToTrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'
import TrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/TrieNode'

describe('l33t table to trie node', () => {
  it('should convert correctly', () => {
    expect(
      l33tTableToTrieNode(
        {
          a: ['@', '4'],
          u: ['|_|'],
          m: ['^^', 'nn', '2n', '/\\\\/\\\\'],
        },
        new TrieNode(),
      ),
    ).toMatchSnapshot()
  })
})
