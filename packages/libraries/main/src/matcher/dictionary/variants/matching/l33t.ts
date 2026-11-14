import { L33tMatch } from '../../../../types.ts'
import { DictionaryHit, DictionaryMatchOptions } from '../../types.ts'
import getCleanPasswords, {
  IndexedPasswordChanges,
  PasswordChanges,
} from './unmunger/getCleanPasswords.ts'
import MatchDictionary, { getUserInputsPosition } from '../../matching.ts'
import WordIndex from '../../WordIndex.ts'
import WordRanges from '../../WordRanges.ts'
import { L33tSubstitution, L33tSubstitutions } from './l33tSubstitutions.ts'
import { countCharacters, toLowerCase } from '../../../../utils/helper.ts'

// The narrow calls one password may take. A password made of substitutions
// that each stand for several letters (eg. '!'.repeat(256)) branches at every
// character, the walk of a start then stops early and keeps the matches found
// so far. Every start gets a share of it, so the end of a password is walked
// no matter how much the start of it branches. What is left afterwards goes to
// the starts that were stopped, so they only miss words once it is used up.
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

  // the words per depth, they share their first depth characters
  private readonly rangesByDepth: WordRanges[] = []

  private start = 0

  // the substitutions that match at each position, of the lowercased
  // password and then of the password as it is
  private readonly substitutionsAt: L33tSubstitution[][] = []

  // the last position a substitution matches at, -1 for none. A branch
  // without changes past it can't make one anymore, so it never matches.
  private lastSubstitution = -1

  private narrowCount = 0

  // the narrowCount at which the walk of the current start stops
  private narrowLimit = 0

  // if the limit stopped the walk of the current start
  private stopped = false

  private largestShare = 0

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
    this.ensureRanges(0)
    let stoppedStarts = this.walkEveryStart()
    // A stopped start walks again from its beginning, so it needs more than it
    // had to get further. The cheapest ones finish first.
    while (stoppedStarts.length > 0 && this.narrowCount < this.options.budget) {
      this.largestShare *= 2
      stoppedStarts = stoppedStarts.filter((start) =>
        this.walkStart(start, this.largestShare),
      )
    }
  }

  // the starts their share wasn't enough for
  private walkEveryStart() {
    const stoppedStarts: number[] = []
    for (let start = 0; start <= this.lastSubstitution; start += 1) {
      // an equal share of what is left, what a start doesn't use goes to the
      // ones after it
      const startsLeft = this.lastSubstitution - start + 1
      const budgetLeft = Math.max(0, this.options.budget - this.narrowCount)
      const share = Math.ceil(budgetLeft / startsLeft)
      this.largestShare = Math.max(this.largestShare, share)
      if (this.walkStart(start, share)) {
        stoppedStarts.push(start)
      }
    }
    return stoppedStarts
  }

  // true if the share wasn't enough to finish the walk of start
  private walkStart(start: number, share: number) {
    this.start = start
    this.rangesByDepth[0].reset()
    this.narrowLimit = Math.min(this.narrowCount + share, this.options.budget)
    this.stopped = false
    this.walk(start, 0)
    return this.stopped
  }

  private hasBudget() {
    if (this.narrowCount >= this.narrowLimit) {
      this.stopped = true
      return false
    }
    return true
  }

  private ensureRanges(depth: number) {
    const { wordIndex, userInputsWordIndex } = this.options
    for (let next = this.rangesByDepth.length; next <= depth; next += 1) {
      this.rangesByDepth.push(new WordRanges(wordIndex, userInputsWordIndex))
    }
  }

  // the words of depth narrowed by characters, into the words of the depth
  // after them. False if no word starts with them.
  private narrow(depth: number, characters: string) {
    this.ensureRanges(depth + characters.length)
    const ranges = this.rangesByDepth[depth + characters.length]
    ranges.copy(this.rangesByDepth[depth])
    for (let index = 0; index < characters.length; index += 1) {
      this.narrowCount += ranges.narrow(
        depth + index,
        characters.charCodeAt(index),
      )
      if (ranges.isEmpty()) {
        return false
      }
    }
    return true
  }

  // the word of exactly depth characters in the words of depth, if any
  private emit(position: number, depth: number) {
    const { wordIndex, onWord } = this.options
    const ranges = this.rangesByDepth[depth]
    const word = ranges.getWord(depth)
    const userInputsRank = ranges.getUserInputsRank(depth)
    if (word !== -1 || userInputsRank !== undefined) {
      onWord({
        i: this.start,
        j: position - 1,
        matchedWord:
          word === -1 ? ranges.getUserInput() : wordIndex.words[word],
        word,
        userInputsRank,
        changes: this.changes,
      })
    }
  }

  // the substitutions that start at position, of the password lowercased or
  // as it is. One with an uppercase character after a lowercase first one
  // (eg. 'nN') only matches the password as it is.
  private getSubstitutionsAt(position: number) {
    const { substitutions } = this.options
    const lower = this.passwordLower.charAt(position)
    const character = this.password.charAt(position)
    const matching = (substitutions.get(lower) || []).filter(
      ({ substitution }) =>
        this.passwordLower.startsWith(substitution, position) ||
        this.password.startsWith(substitution, position),
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

  // eslint-disable-next-line complexity
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
    for (const { substitution, letters, lettersLower } of this.substitutionsAt[
      position
    ]) {
      for (let index = 0; index < letters.length; index += 1) {
        const letterLower = lettersLower[index]
        if (this.hasBudget() && this.narrow(depth, letterLower)) {
          this.changes.push({
            i: position,
            letter: letters[index],
            substitution,
          })
          this.walk(position + substitution.length, depth + letterLower.length)
          this.changes.pop()
        }
      }
    }
    if (
      this.hasBudget() &&
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

  public match({ password, userInputsOptions }: DictionaryMatchOptions) {
    const matches: L33tMatch[] = []
    const seen = new Set<string>()
    const { wordIndex } = this.options
    const userInputsWordIndex = userInputsOptions?.wordIndex

    // Another branch to a word in seenWords has the same hits, so it is
    // skipped before they are looked up. The levenshtein hits of a word differ
    // from the ones of the walk, so each has its own seenWords.
    const addMatches = (
      {
        i,
        j,
        matchedWord,
        changes,
      }: Pick<L33tWord, 'i' | 'j' | 'matchedWord' | 'changes'>,
      getHits: () => DictionaryHit[],
      seenWords: Set<string>,
    ) => {
      const wordKey = `${i}\u0000${j}\u0000${matchedWord}`
      if (seenWords.has(wordKey)) {
        return
      }
      seenWords.add(wordKey)
      const token = password.slice(i, j + 1)
      // only the matches that contain an actual substitution, and no single
      // characters: '1' would match 'i' and '4' would match 'a', both very
      // common English words with a low rank
      if (toLowerCase(token) === matchedWord || countCharacters(token) <= 1) {
        return
      }
      let extras: ReturnType<typeof getSubs> | undefined
      getHits().forEach(({ dictionaryName, rank, ...levenshtein }) => {
        const key = `${wordKey}\u0000${dictionaryName}`
        if (seen.has(key)) {
          return
        }
        seen.add(key)
        extras ??= getSubs(changes)
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

    if (this.options.useLevenshteinDistance) {
      const seenLevenshteinWords = new Set<string>()
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
          () => this.getLevenshteinHits(matchedWord, userInputsWordIndex),
          seenLevenshteinWords,
        )
      })
    }

    const userInputsPosition = getUserInputsPosition(wordIndex)
    const seenWalkWords = new Set<string>()
    new L33tWalk({
      password,
      substitutions: this.options.l33tSubstitutions,
      wordIndex,
      userInputsWordIndex,
      budget: this.narrowBudget,
      onWord: (found) => {
        addMatches(
          found,
          () =>
            this.getHits(found.word, found.userInputsRank, userInputsPosition),
          seenWalkWords,
        )
      },
    }).run()
    return matches
  }
}

export default MatchL33t
