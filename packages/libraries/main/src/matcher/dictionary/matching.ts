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
import { DictionaryTrieNode, TrieTerminalInfo } from './DictionaryTrie'
import TrieNode from './variants/matching/unmunger/TrieNode'

interface L33tCandidateNode {
  letters: string[]
  substitution: string
  length: number
}

// Shared, read-only state for a single match() call - threaded through the
// trie walk instead of passed as a growing list of individual arguments.
interface MatchContext {
  password: string
  passwordLower: string
  includeL33t: boolean
  includeReverse: boolean
  userInputsOptions?: UserInputsOptions
  fullPasswordExactMatches: Set<string>
}

// One frame of the depth-first trie walk. `i` is the token's start index -
// fixed for every frame descended from the same outer-loop iteration - and
// travels with the frame so callees don't need it as a separate argument.
interface DfsFrame {
  i: number
  j: number
  staticNode: DictionaryTrieNode | undefined
  userInputNode: DictionaryTrieNode | undefined
  subs: PasswordChanges[]
  path: string
}

// Mutable, per-match() bookkeeping for the l33t branch of the walk.
interface L33tSearchState {
  nodesByIndex: Map<number, L33tCandidateNode[]>
  stepBudget: { remaining: number }
}

// Everything processNextSteps needs to extend the walk: the DFS stack for the
// current outer-loop iteration, and the l33t bookkeeping shared across all of
// them.
interface WalkState {
  stack: DfsFrame[]
  l33t: L33tSearchState
}

interface RangedDictionaries {
  dictionaries: Record<string, (string | number)[]>
  dictionaryMaxWordSize: Record<string, number>
  dictionaryMinWordSize: Record<string, number>
}

// Defensive bound on total l33t branch expansion within a single match() call.
// The per-path depth limit (l33tMaxSubstitutions) and trie-guided pruning keep
// this a no-op for any realistic dictionary/l33t table, but nothing else stops
// a pathological custom table (e.g. many ambiguous short substitutions) from
// blowing up the DFS, so this acts as a last-resort backstop.
const MAX_L33T_STEPS = 100_000

class MatchDictionary extends MatcherBaseClass {
  private getRangedDictionaries(
    userInputsOptions?: UserInputsOptions,
  ): RangedDictionaries {
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

  public match(
    matchOptions: DictionaryMatchOptions,
    includeL33t = false,
    includeReverse = false,
  ) {
    const { password, userInputsOptions, useLevenshtein = true } = matchOptions
    const context: MatchContext = {
      password,
      passwordLower: password.toLowerCase(),
      includeL33t,
      includeReverse,
      userInputsOptions,
      fullPasswordExactMatches: new Set<string>(),
    }

    const matches = this.getTrieMatches(context)

    if (
      this.options.useLevenshteinDistance &&
      useLevenshtein &&
      password.length > 0 &&
      !includeL33t
    ) {
      this.addLevenshteinMatches(
        context,
        this.getRangedDictionaries(userInputsOptions),
        matches,
      )
    }

    return matches
  }

  // eslint-disable-next-line complexity,max-statements
  private getTrieMatches(context: MatchContext) {
    const {
      password,
      userInputsOptions,
      includeL33t,
      includeReverse,
      fullPasswordExactMatches,
    } = context
    const matches: (DictionaryMatch | L33tMatch)[] = []
    const passwordLength = password.length
    // getL33tNodes(password, j) only depends on j, but many DFS branches
    // (different starting i, different substitution histories) can revisit
    // the same j - cache it once per match() call instead of re-walking the
    // l33t trie from scratch on every visit.
    const l33t: L33tSearchState = {
      nodesByIndex: new Map(),
      stepBudget: { remaining: MAX_L33T_STEPS },
    }

    for (let i = 0; i < passwordLength; i += 1) {
      const walkState: WalkState = {
        stack: [
          {
            i,
            j: i,
            staticNode: this.options.dictionaryTrie.root,
            userInputNode: userInputsOptions?.dictionaryTrie?.root,
            subs: [],
            path: '',
          },
        ],
        l33t,
      }

      while (walkState.stack.length > 0) {
        const frame = walkState.stack.pop()!
        const { j, staticNode, userInputNode, subs } = frame

        if (!staticNode && !userInputNode) {
          continue
        }

        const rawTerminals = [
          ...(staticNode?.terminals || []),
          ...(userInputNode?.terminals || []),
        ]
        // Only dedupe when both sides actually contributed something -
        // rawTerminals is empty on the overwhelming majority of frames, so
        // skip the allocation there.
        const terminals =
          rawTerminals.length > 1
            ? this.dedupeTerminals(rawTerminals)
            : rawTerminals

        terminals.forEach((terminal) => {
          if (terminal.reversed !== includeReverse) {
            return
          }
          if (includeL33t && subs.length === 0) {
            return
          }

          const isFullPassword = frame.i === 0 && j === passwordLength
          if (isFullPassword && !includeReverse && !includeL33t) {
            fullPasswordExactMatches.add(terminal.dictionaryName)
          }

          matches.push(this.createMatch(context, frame, terminal))
        })

        if (j < password.length) {
          this.processNextSteps(context, frame, walkState)
        }
      }
    }
    return matches
  }

  // A word present in both the static dictionary.userInputs list and the
  // per-check userInputs array produces one terminal from each trie for the
  // same (dictionaryName, reversed) pair - collapse those into a single
  // terminal, keeping the lower (more conservative) rank.
  private dedupeTerminals(terminals: TrieTerminalInfo[]): TrieTerminalInfo[] {
    const byKey = new Map<string, TrieTerminalInfo>()
    terminals.forEach((terminal) => {
      const key = `${terminal.dictionaryName}-${terminal.reversed}`
      const existing = byKey.get(key)
      if (!existing || terminal.rank < existing.rank) {
        byKey.set(key, terminal)
      }
    })
    return [...byKey.values()]
  }

  private createMatch(
    context: MatchContext,
    frame: DfsFrame,
    terminal: TrieTerminalInfo,
  ): DictionaryMatch | L33tMatch {
    const { password, includeReverse } = context
    const { i, j, path, subs } = frame
    const { dictionaryName, rank, reversed } = terminal
    const token = password.slice(i, j)
    // Array.from (code-point aware) undoes the same code-point-aware reversal
    // Options.buildTrie applied when building the reverse-dictionary trie key,
    // so an astral character in `path` round-trips back to the original word.
    const matchedWord = includeReverse
      ? Array.from(path).reverse().join('')
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

  private processNextSteps(
    context: MatchContext,
    frame: DfsFrame,
    walkState: WalkState,
  ) {
    const { password, passwordLower, includeL33t } = context
    const { i, j, staticNode, userInputNode, subs, path } = frame
    const { stack, l33t } = walkState

    // Normal step
    const char = passwordLower[j]
    const nextStatic = staticNode?.children?.get(char)
    const nextUserInput = userInputNode?.children?.get(char)
    if (nextStatic || nextUserInput) {
      stack.push({
        i,
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
      l33t.stepBudget.remaining > 0
    ) {
      const l33tNodes = this.getCachedL33tNodes(password, j, l33t.nodesByIndex)
      l33tNodes.forEach((l33tNode) => {
        l33tNode.letters.forEach((letter) => {
          if (l33t.stepBudget.remaining <= 0) {
            return
          }
          let nextStaticL33t = staticNode
          let nextUserInputL33t = userInputNode
          let possible = true
          // Indexed by UTF-16 code unit (not `for...of`, which iterates by
          // code point) to match how DictionaryTrie.add/TrieNode.addSub walk
          // words - one code unit per level - so a `letter` containing an
          // astral character still resolves to the right trie nodes.
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let k = 0; k < letter.length; k += 1) {
            nextStaticL33t = nextStaticL33t?.children?.get(letter[k])
            nextUserInputL33t = nextUserInputL33t?.children?.get(letter[k])
            if (!nextStaticL33t && !nextUserInputL33t) {
              possible = false
              break
            }
          }
          if (possible) {
            l33t.stepBudget.remaining -= 1
            stack.push({
              i,
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
    context: MatchContext,
    rangedDictionaries: RangedDictionaries,
    matches: (DictionaryMatch | L33tMatch)[],
  ): void {
    const {
      password,
      passwordLower,
      includeReverse,
      fullPasswordExactMatches,
    } = context
    const { dictionaries, dictionaryMaxWordSize, dictionaryMinWordSize } =
      rangedDictionaries
    const passwordLength = password.length
    // Reversing one side of a Levenshtein comparison is equivalent to
    // reversing the other, so searching the reversed password against the
    // forward dictionary yields the same distance and entry as searching
    // the forward password against a reversed dictionary would.
    const searchPassword = includeReverse
      ? Array.from(passwordLower).reverse().join('')
      : passwordLower
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
        searchPassword,
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
          reversed: includeReverse,
          l33t: false,
          ...foundLevenshteinDistanceWithoutRank,
        })
      }
    })
  }
}

export default MatchDictionary
