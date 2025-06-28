import { MatchOptions, WordSequenceMatch, DictionaryMatch } from '../../types'
import Options from '../../Options'
import DictionaryMatcher from '../dictionary/matching'

interface WordMatch {
  word: string
  i: number
  j: number
  rank: number
  dictionaryName: string
}

/*
 *-------------------------------------------------------------------------------
 * word sequences (oneTwoThree, fourFiveSix) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchWordSequence {
  constructor(private options: Options) {}

  match(matchOptions: MatchOptions): WordSequenceMatch[] {
    const { password } = matchOptions

    // Get all dictionary matches first
    const dictionaryMatcher = new DictionaryMatcher(this.options)
    const dictionaryMatches = dictionaryMatcher.match(matchOptions)

    if (dictionaryMatches instanceof Promise) {
      // Handle async case if needed
      return []
    }

    // Filter to only dictionary matches (exclude l33t, reverse, etc.)
    const pureDictionaryMatches = dictionaryMatches.filter(
      (match) =>
        match.pattern === 'dictionary' && !match.l33t && !match.reversed,
    ) as DictionaryMatch[]

    // Convert dictionary matches to our internal format
    const wordMatches = this.convertToWordMatches(pureDictionaryMatches)

    // Find sequences of consecutive words
    return this.findWordSequences(wordMatches, password)
  }

  private convertToWordMatches(
    dictionaryMatches: DictionaryMatch[],
  ): WordMatch[] {
    return dictionaryMatches.map((match) => ({
      word: match.matchedWord,
      i: match.i,
      j: match.j,
      rank: match.rank,
      dictionaryName: match.dictionaryName,
    }))
  }

  private findWordSequences(
    wordMatches: WordMatch[],
    password: string,
  ): WordSequenceMatch[] {
    const sequences: WordSequenceMatch[] = []

    if (wordMatches.length === 0) {
      return sequences
    }

    // Sort matches by start position
    const sortedMatches = [...wordMatches].sort((a, b) => a.i - b.i)

    // Find all possible sequences
    for (let startIdx = 0; startIdx < sortedMatches.length; startIdx += 1) {
      const sequencesFromStart = this.findSequencesFromStart(
        sortedMatches,
        startIdx,
        password,
      )
      sequences.push(...sequencesFromStart)
    }

    return sequences
  }

  // eslint-disable-next-line max-statements
  private findSequencesFromStart(
    sortedMatches: WordMatch[],
    startIdx: number,
    password: string,
  ): WordSequenceMatch[] {
    const sequences: WordSequenceMatch[] = []
    const startMatch = sortedMatches[startIdx]

    // Start with single word sequence
    let currentSequence = [startMatch]
    let currentEnd = startMatch.j

    // Try to extend the sequence
    for (
      let nextIdx = startIdx + 1;
      nextIdx < sortedMatches.length;
      nextIdx += 1
    ) {
      const nextMatch = sortedMatches[nextIdx]

      // Only extend if the next word can form a valid sequence
      if (this.isValidWordSequence(currentSequence, nextMatch, password)) {
        currentSequence.push(nextMatch)
        currentEnd = nextMatch.j
      } else if (nextMatch.i > currentEnd) {
        // Gap found, save current sequence and start new one
        if (currentSequence.length > 1) {
          sequences.push(
            this.createWordSequenceMatch(currentSequence, password),
          )
        }
        currentSequence = [nextMatch]
        currentEnd = nextMatch.j
      }
      // If nextMatch.i <= currentEnd, it overlaps, so we skip it
    }

    // Don't forget the last sequence
    if (currentSequence.length > 1) {
      sequences.push(this.createWordSequenceMatch(currentSequence, password))
    }

    return sequences
  }

  private isValidWordSequence(
    currentSequence: WordMatch[],
    nextMatch: WordMatch,
    password: string,
  ): boolean {
    // Get the text between the last word and the next word
    const lastWord = currentSequence[currentSequence.length - 1]
    const textBetween = password.slice(lastWord.j + 1, nextMatch.i)

    // Check for common word separators
    const separators = ['', ' ', '-', '_', '.', '']

    // For simple concatenation (no separator)
    const isSimpleConcat = textBetween === ''

    // For snake_case or kebab-case, check for separators
    const hasValidSeparator = separators.some((sep) => textBetween === sep)

    // For camelCase, we need to check if the next word starts with uppercase
    // and there's no separator (or just a single character that could be uppercase)
    const isCamelCase =
      textBetween.length === 1 &&
      textBetween === textBetween.toUpperCase() &&
      textBetween !== textBetween.toLowerCase()

    return hasValidSeparator || isSimpleConcat || isCamelCase
  }

  private createWordSequenceMatch(
    sequence: WordMatch[],
    password: string,
  ): WordSequenceMatch {
    const firstMatch = sequence[0]
    const lastMatch = sequence[sequence.length - 1]
    const words = sequence.map((match) => match.word)

    // Determine if sequence is ascending (by rank)
    const ranks = sequence.map((match) => match.rank)
    const ascending = ranks.every((rank, i) => i === 0 || rank >= ranks[i - 1])

    // Use the most common dictionary name, or the first one
    const dictionaryNames = sequence.map((match) => match.dictionaryName)
    const dictionaryName =
      this.getMostCommon(dictionaryNames) || firstMatch.dictionaryName

    return {
      pattern: 'wordSequence',
      i: firstMatch.i,
      j: lastMatch.j,
      token: password.slice(firstMatch.i, lastMatch.j + 1),
      words,
      wordCount: words.length,
      dictionaryName,
      ascending,
    }
  }

  private getMostCommon<T>(array: T[]): T | null {
    if (array.length === 0) return null

    const counts = new Map<T, number>()
    let maxCount = 0
    let mostCommon: T | null = null

    array.forEach((item) => {
      const count = (counts.get(item) || 0) + 1
      counts.set(item, count)

      if (count > maxCount) {
        maxCount = count
        mostCommon = item
      }
    })

    return mostCommon
  }
}

export default MatchWordSequence
