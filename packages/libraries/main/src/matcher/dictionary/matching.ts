import { sorted } from '../../helper'
import Options from '../../Options'
import { DictionaryNames, DictionaryMatch, L33tMatch } from '../../types'
import Reverse from './variants/matching/reverse'
import L33t from './variants/matching/l33t'

interface DictionaryMatchOptions {
  password: string
}

class MatchDictionary {
  l33t: L33t

  reverse: Reverse

  constructor() {
    this.l33t = new L33t(this.defaultMatch)
    this.reverse = new Reverse(this.defaultMatch)
  }

  match({ password }: DictionaryMatchOptions) {
    const matches = [
      ...(this.defaultMatch({ password }) as DictionaryMatch[]),
      ...(this.reverse.match({ password }) as DictionaryMatch[]),
      ...(this.l33t.match({ password }) as L33tMatch[]),
    ]
    return sorted(matches)
  }

  defaultMatch({ password }: DictionaryMatchOptions) {
    // rankedDictionaries variable is for unit testing purposes
    const matches: DictionaryMatch[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()

    Object.keys(Options.rankedDictionaries).forEach((dictionaryName) => {
      const rankedDict =
        Options.rankedDictionaries[dictionaryName as DictionaryNames]
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
    return matches
  }
}

export default MatchDictionary
