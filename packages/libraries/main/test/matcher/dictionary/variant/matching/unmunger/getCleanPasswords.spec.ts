import l33tTableToTrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'
import TrieNode from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/TrieNode'
import getCleanPasswords from '../../../../../../src/matcher/dictionary/variants/matching/unmunger/getCleanPasswords'

const trieNode = l33tTableToTrieNode(
  {
    a: ['@', '4'],
    u: ['|_|'],
    m: ['^^', 'nn', '2n', '/\\\\/\\\\'],
  },
  new TrieNode(),
)
describe('getCleanPasswords', () => {
  it('should get correct clean passwords', () => {
    expect(getCleanPasswords('P4|_|$nn4rd', 100, trieNode)).toMatchSnapshot()
  })

  it('should limit the substitutions correctly', () => {
    expect(getCleanPasswords('P4|_|$nn4rd', 2, trieNode)).toMatchSnapshot()
  })
})
