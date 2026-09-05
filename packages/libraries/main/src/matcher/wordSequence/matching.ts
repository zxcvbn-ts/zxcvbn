import {
  MatchOptions,
  WordSequenceMatch,
  DictionaryMatch,
  MatcherBaseClass,
  L33tMatch,
  MatchExtended,
} from '../../types'

const VALID_SEPARATORS = new Set(['', ' ', '-', '_', '.'])

/*
 *-------------------------------------------------------------------------------
 * word sequences (oneTwoThree, fourFiveSix) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchWordSequence extends MatcherBaseClass {
  match(matchOptions: MatchOptions): WordSequenceMatch[] {
    const { password, matches = [] } = matchOptions

    const dictionaryMatches = matches.filter(
      (match): match is DictionaryMatch | L33tMatch =>
        match.pattern === 'dictionary' &&
        this.options.isWordSequence(match.dictionaryName),
    )

    const filteredDictionaryMatches =
      this.filterDictionaryMatches(dictionaryMatches)

    // Find sequences of consecutive words
    const sequences = this.findWordSequences(
      filteredDictionaryMatches,
      password,
    )

    if (sequences.length > 0) {
      const usedMatches = new Set<DictionaryMatch | L33tMatch>()
      sequences.forEach((sequence) => {
        const sequenceMatches = filteredDictionaryMatches.filter(
          (match) => match.i >= sequence.i && match.j <= sequence.j,
        )
        sequenceMatches.forEach((match) => usedMatches.add(match))
      })

      // Remove used matches from the original matches array
      const filteredMatches = matches.filter(
        (match) => !usedMatches.has(match as DictionaryMatch | L33tMatch),
      )
      matches.length = 0
      matches.push(...filteredMatches)
    }

    return sequences
  }

  private filterDictionaryMatches(matches: (L33tMatch | DictionaryMatch)[]) {
    // sort by start index, then by end index
    return (
      matches
        .sort((a, b) => {
          if (a.i !== b.i) return a.i - b.i
          if (a.j !== b.j) return a.j - b.j

          // prefer forward over reversed
          if (a.reversed !== b.reversed) return a.reversed ? 1 : -1

          // prefer non-l33t
          if (a.l33t !== b.l33t) return a.l33t ? 1 : -1

          // prefer better rank
          return a.rank - b.rank
        })
        // Keep only non-overlapping matches, favoring earlier ones
        .reduce<DictionaryMatch[]>((acc, match) => {
          const last = acc[acc.length - 1]
          if (!last || match.i > last.j) {
            acc.push(match)
          }
          return acc
        }, [])
    )
  }

  private findWordSequences(
    wordMatches: MatchExtended[],
    password: string,
  ): WordSequenceMatch[] {
    const sequences: WordSequenceMatch[] = []

    if (wordMatches.length === 0) {
      return sequences
    }

    // Find all possible sequences
    for (let startIdx = 0; startIdx < wordMatches.length; startIdx += 1) {
      const sequencesFromStart = this.findSequencesFromStart(
        wordMatches,
        startIdx,
        password,
      )
      sequences.push(...sequencesFromStart)
    }

    return sequences
  }

  private findSequencesFromStart(
    sortedMatches: MatchExtended[],
    startIdx: number,
    password: string,
  ): WordSequenceMatch[] {
    const sequences: WordSequenceMatch[] = []
    const startMatch = sortedMatches[startIdx]

    // Start with single word sequence
    let currentSequence = [startMatch]

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
      } else {
        // sortedMatches always comes from filterDictionaryMatches, which already
        // guarantees each entry starts after the previous one ends, so a
        // non-extending match is always a gap, never an overlap to skip.
        if (currentSequence.length > 1) {
          sequences.push(
            this.createWordSequenceMatch(currentSequence, password),
          )
        }
        currentSequence = [nextMatch]
      }
    }

    // Don't forget the last sequence
    if (currentSequence.length > 1) {
      sequences.push(this.createWordSequenceMatch(currentSequence, password))
    }

    return sequences
  }

  private isValidWordSequence(
    currentSequence: MatchExtended[],
    nextMatch: MatchExtended,
    password: string,
  ): boolean {
    // Get the text between the last word and the next word
    const lastWord = currentSequence[currentSequence.length - 1]
    const textBetween = password.slice(lastWord.j + 1, nextMatch.i)

    // For snake_case, kebab-case, or simple concatenation (VALID_SEPARATORS
    // includes '', which covers the no-separator case too)
    const hasValidSeparator = VALID_SEPARATORS.has(textBetween)

    // For camelCase, we need to check if the next word starts with uppercase
    // and there's no separator (or just a single character that could be uppercase)
    const isCamelCase =
      textBetween.length === 1 &&
      textBetween === textBetween.toUpperCase() &&
      textBetween !== textBetween.toLowerCase()

    return hasValidSeparator || isCamelCase
  }

  private createWordSequenceMatch(
    sequence: MatchExtended[],
    password: string,
  ): WordSequenceMatch {
    const firstMatch = sequence[0]
    const lastMatch = sequence[sequence.length - 1]
    const words = sequence.map((match) => match.matchedWord)

    // Determine if sequence is ascending (by rank)
    const ranks = sequence.map((match) => match.rank)
    const ascending = ranks.every((rank, i) => i === 0 || rank >= ranks[i - 1])

    // Use the most common dictionary name. createWordSequenceMatch is only
    // ever called with 2+ matches, so getMostCommon never returns null here.
    const dictionaryNames = sequence.map((match) => match.dictionaryName)
    const dictionaryName = this.getMostCommon(dictionaryNames)!

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
