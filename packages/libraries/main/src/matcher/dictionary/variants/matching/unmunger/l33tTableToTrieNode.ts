import { OptionsL33tTable } from '../../../../../types.ts'
import TrieNode from './TrieNode.ts'

export default (l33tTable: OptionsL33tTable, triNode: TrieNode) => {
  Object.entries(l33tTable).forEach(([letter, substitutions]) => {
    substitutions.forEach((substitution) => {
      triNode.addSub(substitution, letter)
    })
  })
  return triNode
}
