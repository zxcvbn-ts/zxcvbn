import TrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/TrieNode'

describe('TrieNode', () => {
  describe('addChild', () => {
    it('should not replace an existing child when called again for the same character', () => {
      const node = new TrieNode()
      node.addChild('a')
      const child = node.getChild('a')

      node.addChild('a')

      expect(node.getChild('a')).toBe(child)
    })
  })

  describe('addSub', () => {
    it('should reuse a shared node when two substitution strings share a multi-character prefix', () => {
      const node = new TrieNode()
      node.addSub('xy', 'a')
      node.addSub('xyz', 'b')

      const sharedPrefixNode = node.getChild('x')!.getChild('y')!
      expect(sharedPrefixNode.subs).toEqual(['a'])
      expect(sharedPrefixNode.getChild('z')!.subs).toEqual(['b'])
    })
  })
})
