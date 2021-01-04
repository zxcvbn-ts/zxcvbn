import { sorted } from '../helper'
import Options from '../Options'
import { ExtendedMatch, DictionaryNames, OptionsDictionary } from '../types'

interface DictionaryMatchOptions {
  password: string
}
class MatchDictionary {
  rankedDictionaries: OptionsDictionary = {}

  constructor() {
    this.rankedDictionaries = Options.rankedDictionaries
  }

  match({ password }: DictionaryMatchOptions) {
    // rankedDictionaries variable is for unit testing purposes
    const matches: ExtendedMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()

    Object.keys(this.rankedDictionaries).forEach(
      // @ts-ignore
      (dictionaryName: DictionaryNames) => {
        const rankedDict = this.rankedDictionaries[dictionaryName]
        for (let i = 0; i < passwordLength; i += 1) {
          for (let j = i; j < passwordLength; j += 1) {
            if (passwordLower.slice(i, +j + 1 || 9e9) in rankedDict) {
              const word = passwordLower.slice(i, +j + 1 || 9e9)
              const rank = rankedDict[word]
              // @ts-ignore
              matches.push({
                pattern: 'dictionary',
                i,
                j,
                token: password.slice(i, +j + 1 || 9e9),
                matchedWord: word,
                rank,
                dictionaryName,
                reversed: false,
                l33t: false,
              })
            }
          }
        }
      },
    )
    return sorted(matches)
  }
}

export default MatchDictionary
