import findLevenshteinDistance from '../../utils/levenshtein'
import {
  DictionaryNames,
  DictionaryMatch,
  UserInputsOptions,
  MatcherBaseClass,
  L33tMatch,
} from '../../types'
import { DictionaryMatchOptions } from './types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'
import { DictionaryTrieNode } from './DictionaryTrie'
import TrieNode from './variants/matching/unmunger/TrieNode'
import { PasswordChanges } from './variants/matching/unmunger/getCleanPasswords'

class MatchDictionary extends MatcherBaseClass {
  private getRangedDictionaries(userInputsOptions?: UserInputsOptions) {
    if (
      userInputsOptions?.mergedDictionaries &&
      userInputsOptions?.mergedDictionaryMaxWordSize &&
      userInputsOptions?.mergedDictionaryMinWordSize
    ) {
      return {
        dictionaries: userInputsOptions.mergedDictionaries,
        dictionaryMaxWordSize: userInputsOptions.mergedDictionaryMaxWordSize,
        dictionaryMinWordSize: userInputsOptions.mergedDictionaryMinWordSize,
      }
    }
    return mergeUserInputDictionary(
      this.options.dictionary,
      this.options.dictionaryMaxWordSize,
      this.options.dictionaryMinWordSize,
      userInputsOptions,
    )
  }

  private getL33tNodes(password: string, index: number) {
    const nodes: { letters: string[]; substitution: string; length: number }[] =
      []
    let cur: TrieNode | undefined = this.options.trieNodeRoot
    for (let i = index; i < password.length; i += 1) {
      const character = password.charAt(i)
      cur = cur?.getChild(character)
      if (!cur) {
        break
      }
      if (cur.isTerminal()) {
        nodes.push({
          letters: cur.subs!,
          substitution: password.slice(index, i + 1),
          length: i - index + 1,
        })
      }
    }
    return nodes
  }

  // eslint-disable-next-line complexity,max-statements
  public match(
    matchOptions: DictionaryMatchOptions,
    includeL33t = false,
    includeReverse = false,
  ) {
    const { password, userInputsOptions, useLevenshtein = true } = matchOptions
    const matches: (DictionaryMatch | L33tMatch)[] = []
    const passwordLength = password.length
    const passwordLower = password.toLowerCase()
    const { dictionaries, dictionaryMaxWordSize, dictionaryMinWordSize } =
      this.getRangedDictionaries(userInputsOptions)

    const fullPasswordExactMatches = new Set<string>()

    for (let i = 0; i < passwordLength; i += 1) {
      const stack: {
        j: number
        staticNode: DictionaryTrieNode | undefined
        userInputNode: DictionaryTrieNode | undefined
        subs: PasswordChanges[]
        path: string
      }[] = [
        {
          j: i,
          staticNode: this.options.dictionaryTrie.root,
          userInputNode: userInputsOptions?.dictionaryTrie?.root,
          subs: [],
          path: '',
        },
      ]

      while (stack.length > 0) {
        const { j, staticNode, userInputNode, subs, path } = stack.pop()!

        if (!staticNode && !userInputNode) {
          continue
        }

        const terminals = [
          ...(staticNode?.terminals || []),
          ...(userInputNode?.terminals || []),
        ]

        terminals.forEach(({ dictionaryName, rank, reversed }) => {
          if (reversed !== includeReverse) {
            return
          }
          if (includeL33t && subs.length === 0) {
            return
          }

          const isFullPassword = i === 0 && j === passwordLength
          if (isFullPassword && !includeReverse && !includeL33t) {
            fullPasswordExactMatches.add(dictionaryName)
          }

          const token = password.slice(i, j)
          const matchedWord = includeReverse
            ? path.split('').reverse().join('')
            : path

          const baseMatch: DictionaryMatch = {
            pattern: 'dictionary',
            i,
            j: j - 1,
            token,
            matchedWord,
            rank,
            dictionaryName,
            reversed,
            l33t: subs.length > 0,
          }

          if (subs.length > 0) {
            const uniqueSubs: PasswordChanges[] = []
            const seenSubs = new Set<string>()
            subs.forEach((sub) => {
              const key = `${sub.letter}-${sub.substitution}`
              if (!seenSubs.has(key)) {
                seenSubs.add(key)
                uniqueSubs.push(sub)
              }
            })
            const l33tMatch: L33tMatch = {
              ...baseMatch,
              subs: uniqueSubs,
              subDisplay: uniqueSubs
                .map((s) => `${s.substitution} -> ${s.letter}`)
                .join(', '),
            }
            matches.push(l33tMatch)
          } else {
            matches.push(baseMatch)
          }
        })

        if (j < password.length) {
          // Normal step
          const char = passwordLower[j]
          const nextStatic = staticNode?.children?.get(char)
          const nextUserInput = userInputNode?.children?.get(char)
          if (nextStatic || nextUserInput) {
            stack.push({
              j: j + 1,
              staticNode: nextStatic,
              userInputNode: nextUserInput,
              subs,
              path: path + char,
            })
          }

          // L33t steps
          if (includeL33t && subs.length < this.options.l33tMaxSubstitutions) {
            const l33tNodes = this.getL33tNodes(password, j)
            l33tNodes.forEach((l33tNode) => {
              l33tNode.letters.forEach((letter) => {
                let nextStaticL33t = staticNode
                let nextUserInputL33t = userInputNode
                let possible = true
                for (let k = 0; k < letter.length; k += 1) {
                  nextStaticL33t = nextStaticL33t?.children?.get(letter[k])
                  nextUserInputL33t = nextUserInputL33t?.children?.get(
                    letter[k],
                  )
                  if (!nextStaticL33t && !nextUserInputL33t) {
                    possible = false
                    break
                  }
                }
                if (possible) {
                  stack.push({
                    j: j + l33tNode.length,
                    staticNode: nextStaticL33t,
                    userInputNode: nextUserInputL33t,
                    subs: [
                      ...subs,
                      { letter, substitution: l33tNode.substitution },
                    ],
                    path: path + letter,
                  })
                }
              })
            })
          }
        }
      }
    }

    if (
      this.options.useLevenshteinDistance &&
      useLevenshtein &&
      passwordLength > 0 &&
      !includeL33t &&
      !includeReverse
    ) {
      const dictionaryNames = Object.keys(dictionaries) as DictionaryNames[]
      dictionaryNames.forEach((dictionaryName) => {
        if (!fullPasswordExactMatches.has(dictionaryName)) {
          const maxWordSize = dictionaryMaxWordSize[dictionaryName]
          const minWordSize = dictionaryMinWordSize[dictionaryName]
          const threshold = this.options.levenshteinThreshold
          const relativeThreshold = Math.ceil(passwordLength / 4)
          const thresholdForShortEntry =
            passwordLength <= threshold ? relativeThreshold : threshold

          if (
            passwordLength - maxWordSize > thresholdForShortEntry ||
            minWordSize - passwordLength > relativeThreshold
          ) {
            return
          }

          const dictionary = dictionaries[dictionaryName]
          const foundLevenshteinDistance = findLevenshteinDistance(
            passwordLower,
            dictionary,
            this.options.levenshteinThreshold,
          )
          if (foundLevenshteinDistance.levenshteinDistance !== undefined) {
            const {
              levenshteinDistanceRank,
              ...foundLevenshteinDistanceWithoutRank
            } = foundLevenshteinDistance
            matches.push({
              pattern: 'dictionary',
              i: 0,
              j: passwordLength - 1,
              token: password,
              matchedWord: passwordLower,
              rank: levenshteinDistanceRank!,
              dictionaryName,
              reversed: false,
              l33t: false,
              ...foundLevenshteinDistanceWithoutRank,
            })
          }
        }
      })
    }
    return matches
  }
}

export default MatchDictionary
