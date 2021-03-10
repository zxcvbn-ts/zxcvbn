import { sorted } from '../helper'
import Options from '../Options'
import { DictionaryNames, RankedDictionaries, DictionaryMatch } from '../types'

interface DictionaryMatchOptions {
  password: string
}
class MatchDictionary {
  rankedDictionaries: RankedDictionaries = {}

  constructor() {
    this.rankedDictionaries = Options.rankedDictionaries
  }

  match({ password }: DictionaryMatchOptions) {
    // rankedDictionaries variable is for unit testing purposes
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()

    Object.keys(this.rankedDictionaries).forEach((dictionaryName) => {
      const rankedDict = this.rankedDictionaries[
        dictionaryName as DictionaryNames
      ]
      for (let i = 0; i < passwordLength; i += 1) {
        for (let j = i; j < passwordLength; j += 1) {
          if (passwordLower.slice(i, +j + 1 || 9e9) in rankedDict) {
            const word = passwordLower.slice(i, +j + 1 || 9e9)
            const rank = rankedDict[word as keyof typeof rankedDict]
            matches.push({
              pattern: 'dictionary',
              i,
              j,
              token: password.slice(i, +j + 1 || 9e9),
              matchedWord: word,
              rank,
              dictionaryName: dictionaryName as DictionaryNames,
              reversed: false,
              l33t: false,
            })
          }
        }
      }
    })
    return sorted(matches) as DictionaryMatch[]
  }
}

export default MatchDictionary
