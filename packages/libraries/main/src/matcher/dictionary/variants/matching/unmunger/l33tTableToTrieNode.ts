import { OptionsL33tTable } from '../../../../../types'
import TrieNode from './TrieNode'

export default (l33tTable: OptionsL33tTable, triNode: TrieNode) => {
  Object.entries(l33tTable).forEach(([letter, substitutions]) => {
    substitutions.forEach((substitution) => {
      triNode.addSub(substitution, letter)
    })
  })
  return triNode
}
