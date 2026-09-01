import findLevenshteinDistance from '../../utils/levenshtein'
import {
  DictionaryNames,
  DictionaryMatch,
  UserInputsOptions,
  MatcherBaseClass,
  L33tMatch,
  PasswordChanges,
} from '../../types'
import { DictionaryMatchOptions } from './types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'
import { DictionaryTrieNode } from './DictionaryTrie'
import TrieNode from './variants/matching/unmunger/TrieNode'

interface L33tCandidateNode {
  letters: string[]
  substitution: string
  length: number
}

// Defensive bound on total l33t branch expansion within a single match() call.
// The per-path depth limit (l33tMaxSubstitutions) and trie-guided pruning keep
// this a no-op for any realistic dictionary/l33t table, but nothing else stops
// a pathological custom table (e.g. many ambiguous short substitutions) from
// blowing up the DFS, so this acts as a last-resort backstop.
const MAX_L33T_STEPS = 100_000

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

  private getL33tNodes(password: string, index: number): L33tCandidateNode[] {
    const nodes: L33tCandidateNode[] = []
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

  private getCachedL33tNodes(
    password: string,
    index: number,
    cache: Map<number, L33tCandidateNode[]>,
  ): L33tCandidateNode[] {
    let nodes = cache.get(index)
    if (!nodes) {
      nodes = this.getL33tNodes(password, index)
      cache.set(index, nodes)
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
    const passwordLower = password.toLowerCase()
    const fullPasswordExactMatches = new Set<string>()

    const matches = this.getTrieMatches(
      password,
      passwordLower,
      userInputsOptions,
      includeL33t,
      includeReverse,
      fullPasswordExactMatches,
    )

    if (
      this.options.useLevenshteinDistance &&
      useLevenshtein &&
      password.length > 0 &&
      !includeL33t &&
      !includeReverse
    ) {
      const { dictionaries, dictionaryMaxWordSize, dictionaryMinWordSize } =
        this.getRangedDictionaries(userInputsOptions)

      this.addLevenshteinMatches(
        password,
        passwordLower,
        dictionaries,
        dictionaryMaxWordSize,
        dictionaryMinWordSize,
        fullPasswordExactMatches,
        matches,
      )
    }

    return matches
  }

  private getTrieMatches(
    password: string,
    passwordLower: string,
    userInputsOptions: UserInputsOptions | undefined,
    includeL33t: boolean,
    includeReverse: boolean,
    fullPasswordExactMatches: Set<string>,
  ) {
    const matches: (DictionaryMatch | L33tMatch)[] = []
    const passwordLength = password.length
    // getL33tNodes(password, j) only depends on j, but many DFS branches
    // (different starting i, different substitution histories) can revisit
    // the same j - cache it once per match() call instead of re-walking the
    // l33t trie from scratch on every visit.
    const l33tNodesByIndex = new Map<number, L33tCandidateNode[]>()
    const l33tStepBudget = { remaining: MAX_L33T_STEPS }

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

          matches.push(
            this.createMatch(
              password,
              i,
              j,
              path,
              rank,
              dictionaryName,
              reversed,
              subs,
              includeReverse,
            ),
          )
        })

        if (j < password.length) {
          this.processNextSteps(
            password,
            passwordLower,
            j,
            staticNode,
            userInputNode,
            subs,
            path,
            includeL33t,
            stack,
            l33tNodesByIndex,
            l33tStepBudget,
          )
        }
      }
    }
    return matches
  }

  private createMatch(
    password: string,
    i: number,
    j: number,
    path: string,
    rank: number,
    dictionaryName: string,
    reversed: boolean,
    subs: PasswordChanges[],
    includeReverse: boolean,
  ): DictionaryMatch | L33tMatch {
    const token = password.slice(i, j)
    const matchedWord = includeReverse ? path.split('').reverse().join('') : path

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
      return {
        ...baseMatch,
        subs: uniqueSubs,
        subDisplay: uniqueSubs
          .map((s) => `${s.substitution} -> ${s.letter}`)
          .join(', '),
      }
    }
    return baseMatch
  }

  // eslint-disable-next-line max-params
  private processNextSteps(
    password: string,
    passwordLower: string,
    j: number,
    staticNode: DictionaryTrieNode | undefined,
    userInputNode: DictionaryTrieNode | undefined,
    subs: PasswordChanges[],
    path: string,
    includeL33t: boolean,
    stack: any[],
    l33tNodesByIndex: Map<number, L33tCandidateNode[]>,
    l33tStepBudget: { remaining: number },
  ) {
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
    if (
      includeL33t &&
      subs.length < this.options.l33tMaxSubstitutions &&
      l33tStepBudget.remaining > 0
    ) {
      const l33tNodes = this.getCachedL33tNodes(password, j, l33tNodesByIndex)
      l33tNodes.forEach((l33tNode) => {
        l33tNode.letters.forEach((letter) => {
          if (l33tStepBudget.remaining <= 0) {
            return
          }
          let nextStaticL33t = staticNode
          let nextUserInputL33t = userInputNode
          let possible = true
          for (let k = 0; k < letter.length; k += 1) {
            nextStaticL33t = nextStaticL33t?.children?.get(letter[k])
            nextUserInputL33t = nextUserInputL33t?.children?.get(letter[k])
            if (!nextStaticL33t && !nextUserInputL33t) {
              possible = false
              break
            }
          }
          if (possible) {
            l33tStepBudget.remaining -= 1
            stack.push({
              j: j + l33tNode.length,
              staticNode: nextStaticL33t,
              userInputNode: nextUserInputL33t,
              subs: [...subs, { letter, substitution: l33tNode.substitution }],
              path: path + letter,
            })
          }
        })
      })
    }
  }

  private addLevenshteinMatches(
    password: string,
    passwordLower: string,
    dictionaries: Record<string, (string | number)[]>,
    dictionaryMaxWordSize: Record<string, number>,
    dictionaryMinWordSize: Record<string, number>,
    fullPasswordExactMatches: Set<string>,
    matches: (DictionaryMatch | L33tMatch)[],
  ) {
    const passwordLength = password.length
    const dictionaryNames = Object.keys(dictionaries) as DictionaryNames[]
    dictionaryNames.forEach((dictionaryName) => {
      if (fullPasswordExactMatches.has(dictionaryName)) {
        return
      }
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
    })
  }
}

export default MatchDictionary
