import { L33tMatch } from '../../../../types'
import { DictionaryHit, DictionaryMatchOptions } from '../../types'
import getCleanPasswords, {
  IndexedPasswordChanges,
  PasswordChanges,
} from './unmunger/getCleanPasswords'
import MatchDictionary, {
  getUserInputsPosition,
  getUserInputsWordIndex,
} from '../../matching'
import WordIndex from '../../WordIndex'
import { L33tSubstitution, L33tSubstitutions } from './l33tSubstitutions'
import { countCharacters, toLowerCase } from '../../../../utils/helper'

// The narrow calls one password may take. A password made of substitutions
// that each stand for several letters (eg. '!'.repeat(256)) branches at every
// character, the walk then stops early and keeps the matches found so far.
export const L33T_NARROW_BUDGET = 100000

// the changes in [i, j] once each, as the match lists them
const getSubs = (changes: PasswordChanges[]) => {
  const subs: PasswordChanges[] = []
  const subDisplay: string[] = []
  const seenSubs = new Set<string>()
  changes.forEach(({ letter, substitution }) => {
    const subKey = `${letter}-${substitution}`
    if (!seenSubs.has(subKey)) {
      seenSubs.add(subKey)
      subs.push({ letter, substitution })
      subDisplay.push(`${substitution} -> ${letter}`)
    }
  })
  return { subs, subDisplay: subDisplay.join(', ') }
}

// The words of a word index that start with a character. Each start of every
// password narrows the whole index by its first character, the widest and so
// slowest search, so it is done once per character.
const firstCharacterRanges = new WeakMap<WordIndex, Map<number, Int32Array>>()

const narrowFirstCharacter = (
  wordIndex: WordIndex,
  range: Int32Array,
  code: number,
) => {
  let byCode = firstCharacterRanges.get(wordIndex)
  if (!byCode) {
    byCode = new Map()
    firstCharacterRanges.set(wordIndex, byCode)
  }
  let cached = byCode.get(code)
  if (!cached) {
    cached = new Int32Array([0, wordIndex.words.length])
    wordIndex.narrow(cached, 0, code)
    byCode.set(code, cached)
  }
  range.set(cached)
}

export interface L33tWord {
  i: number
  j: number
  // the word password[i, j] stands for with changes
  matchedWord: string
  // its index in the word index, or -1 if only a user input
  word: number
  // its rank among the user inputs, if one
  userInputsRank: number | undefined
  changes: IndexedPasswordChanges[]
}

interface L33tWalkOptions {
  password: string
  substitutions: L33tSubstitutions
  wordIndex: WordIndex
  userInputsWordIndex: WordIndex | undefined
  budget: number
  onWord: (found: L33tWord) => void
}

// Walks the word index from every start of the password. At each character
// it continues with every substitution that starts there, for each letter it
// stands for, and with the character itself. A branch ends as soon as no word
// starts with it, so only prefixes of words are explored.
class L33tWalk {
  private readonly password: string

  private readonly passwordLower: string

  private readonly options: L33tWalkOptions

  // the substitutions made so far, in password positions
  private readonly changes: IndexedPasswordChanges[] = []

  // [start, end) of the word index and of the user inputs per depth, the
  // words in them share their first depth characters
  private readonly boundsByDepth: Int32Array[] = []

  private start = 0

  // the substitutions that match at each position, of the lowercased
  // password and then of the password as it is
  private readonly substitutionsAt: L33tSubstitution[][] = []

  // the last position a substitution matches at, -1 for none. A branch
  // without changes past it can't make one anymore, so it never matches.
  private lastSubstitution = -1

  private narrowCount = 0

  constructor(options: L33tWalkOptions) {
    this.options = options
    this.password = options.password
    this.passwordLower = toLowerCase(options.password)
    for (let position = 0; position < this.password.length; position += 1) {
      const matching = this.getSubstitutionsAt(position)
      this.substitutionsAt.push(matching)
      if (matching.length > 0) {
        this.lastSubstitution = position
      }
    }
  }

  run() {
    const { wordIndex, userInputsWordIndex } = this.options
    const bounds = this.getBounds(0)
    for (let start = 0; start <= this.lastSubstitution; start += 1) {
      this.start = start
      bounds[0] = 0
      bounds[1] = wordIndex.words.length
      bounds[2] = 0
      bounds[3] = userInputsWordIndex ? userInputsWordIndex.words.length : 0
      this.walk(start, 0)
      if (this.isOverBudget()) {
        return
      }
    }
  }

  private isOverBudget() {
    return this.narrowCount > this.options.budget
  }

  private getBounds(depth: number) {
    let bounds = this.boundsByDepth[depth]
    if (!bounds) {
      bounds = new Int32Array(4)
      this.boundsByDepth[depth] = bounds
    }
    return bounds
  }

  // the bounds of depth narrowed by characters, into the bounds of the depth
  // after them. False if no word starts with them.
  // eslint-disable-next-line max-statements
  private narrow(depth: number, characters: string) {
    const { wordIndex, userInputsWordIndex } = this.options
    const bounds = this.getBounds(depth + characters.length)
    bounds.set(this.getBounds(depth))
    const range = bounds.subarray(0, 2)
    const userInputsRange = bounds.subarray(2, 4)
    for (let index = 0; index < characters.length; index += 1) {
      const code = characters.charCodeAt(index)
      if (depth + index === 0) {
        narrowFirstCharacter(wordIndex, range, code)
        this.narrowCount += 1
      } else if (range[0] < range[1]) {
        wordIndex.narrow(range, depth + index, code)
        this.narrowCount += 1
      }
      if (userInputsWordIndex && userInputsRange[0] < userInputsRange[1]) {
        userInputsWordIndex.narrow(userInputsRange, depth + index, code)
        this.narrowCount += 1
      }
      if (range[0] >= range[1] && userInputsRange[0] >= userInputsRange[1]) {
        return false
      }
    }
    return true
  }

  // the word of exactly depth characters in the bounds of depth, if any
  // eslint-disable-next-line complexity
  private emit(position: number, depth: number) {
    const { wordIndex, userInputsWordIndex, onWord } = this.options
    const bounds = this.getBounds(depth)
    const word =
      bounds[0] < bounds[1] && wordIndex.words[bounds[0]].length === depth
        ? bounds[0]
        : -1
    const userInputsRank =
      userInputsWordIndex &&
      bounds[2] < bounds[3] &&
      userInputsWordIndex.words[bounds[2]].length === depth
        ? userInputsWordIndex.getRank(bounds[2], 0)
        : undefined
    if (word !== -1 || userInputsRank !== undefined) {
      onWord({
        i: this.start,
        j: position - 1,
        matchedWord:
          word === -1
            ? userInputsWordIndex!.words[bounds[2]]
            : wordIndex.words[word],
        word,
        userInputsRank,
        changes: this.changes,
      })
    }
  }

  // the substitutions that start at position, of the password lowercased and
  // as it is
  private getSubstitutionsAt(position: number) {
    const { substitutions } = this.options
    const lower = this.passwordLower.charAt(position)
    const character = this.password.charAt(position)
    const matching = (substitutions.get(lower) || []).filter(
      ({ substitution }) =>
        this.passwordLower.startsWith(substitution, position),
    )
    if (character !== lower) {
      ;(substitutions.get(character) || []).forEach((candidate) => {
        if (this.password.startsWith(candidate.substitution, position)) {
          matching.push(candidate)
        }
      })
    }
    return matching
  }

  private walk(position: number, depth: number) {
    if (depth > 0 && this.changes.length > 0) {
      this.emit(position, depth)
    }
    if (
      position === this.password.length ||
      (this.changes.length === 0 && position > this.lastSubstitution)
    ) {
      return
    }
    this.substitutionsAt[position].forEach(
      ({ substitution, letters, lettersLower }) => {
        letters.forEach((letter, index) => {
          const letterLower = lettersLower[index]
          if (this.isOverBudget() || !this.narrow(depth, letterLower)) {
            return
          }
          this.changes.push({ i: position, letter, substitution })
          this.walk(position + substitution.length, depth + letterLower.length)
          this.changes.pop()
        })
      },
    )
    if (
      !this.isOverBudget() &&
      this.narrow(depth, this.passwordLower.charAt(position))
    ) {
      this.walk(position + 1, depth + 1)
    }
  }
}

/*
 * -------------------------------------------------------------------------------
 *  Dictionary l33t matching -----------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchL33t extends MatchDictionary {
  protected narrowBudget = L33T_NARROW_BUDGET

  public match({
    password,
    userInputsOptions,
    useLevenshtein = true,
  }: DictionaryMatchOptions) {
    const matches: L33tMatch[] = []
    const seen = new Set<string>()
    const { wordIndex } = this.options
    const userInputsWordIndex = userInputsOptions
      ? getUserInputsWordIndex(userInputsOptions)
      : undefined

    const addMatches = (
      {
        i,
        j,
        matchedWord,
        changes,
      }: Pick<L33tWord, 'i' | 'j' | 'matchedWord' | 'changes'>,
      hits: DictionaryHit[],
    ) => {
      const token = password.slice(i, j + 1)
      // only the matches that contain an actual substitution, and no single
      // characters: '1' would match 'i' and '4' would match 'a', both very
      // common English words with a low rank
      if (toLowerCase(token) === matchedWord || countCharacters(token) <= 1) {
        return
      }
      const extras = getSubs(changes)
      hits.forEach(({ dictionaryName, rank, ...levenshtein }) => {
        const key = `${i}\u0000${j}\u0000${dictionaryName}\u0000${matchedWord}`
        if (seen.has(key)) {
          return
        }
        seen.add(key)
        matches.push({
          pattern: 'dictionary',
          i,
          j,
          token,
          matchedWord,
          rank,
          dictionaryName,
          reversed: false,
          l33t: true,
          ...levenshtein,
          ...extras,
        })
      })
    }

    if (this.options.useLevenshteinDistance && useLevenshtein) {
      // levenshtein only checks the full password, so the l33t words close
      // to it are only found with every possible substitution made
      getCleanPasswords(
        password,
        this.options.l33tMaxSubstitutions,
        this.options.trieNodeRoot,
      ).forEach(({ password: subbedPassword, changes }) => {
        if (changes.length === 0) {
          return
        }
        const matchedWord = toLowerCase(subbedPassword)
        addMatches(
          { i: 0, j: password.length - 1, matchedWord, changes },
          this.getLevenshteinHits(matchedWord, userInputsWordIndex),
        )
      })
    }

    const userInputsPosition = getUserInputsPosition(wordIndex)
    new L33tWalk({
      password,
      substitutions: this.options.l33tSubstitutions,
      wordIndex,
      userInputsWordIndex,
      budget: this.narrowBudget,
      onWord: (found) => {
        addMatches(
          found,
          this.getHits(found.word, found.userInputsRank, userInputsPosition),
        )
      },
    }).run()
    return matches
  }
}

export default MatchL33t
