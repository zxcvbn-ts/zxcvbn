import utils from './utils'
import estimateGuesses from './estimate'
import { MIN_GUESSES_BEFORE_GROWING_SEQUENCE } from '../data/const'
import { MatchExtended, BruteForceMatch, MatchEstimated } from '../types'
import Options from '../Options'
import { bruteforceGuesses } from '../matcher/bruteforce/scoring'

// a slot in the search holds either an estimated match or, for a bruteforce
// match, just its start index. Bruteforce candidates are rated as numbers
// and only become match objects in unwind.
type BestMatch = MatchEstimated | number

// all arrays are indexed by [k][sequenceLength], with holes for sequence
// lengths that don't have a best sequence ending at k
interface SearchState {
  // bestMatches[k][sequenceLength] holds the final match in the best
  // length-sequenceLength match sequence covering the password prefix up to k,
  // inclusive. if there is no length-sequenceLength sequence that scores better
  // (fewer guesses) than a shorter match sequence spanning the same prefix,
  // bestMatches[k][sequenceLength] is undefined.
  bestMatches: BestMatch[][]
  // holds the product term Prod(match.guesses for match in sequence).
  // allows for fast (non-looping) updates to the minimization function.
  guessesProduct: number[][]
  // holds the overall metric.
  totalGuesses: number[][]
}

const isBruteforce = (match: BestMatch) =>
  typeof match === 'number' || match.pattern === 'bruteforce'

export default class Scoring {
  private password = ''

  private state: SearchState = {
    bestMatches: [],
    guessesProduct: [],
    totalGuesses: [],
  }

  private excludeAdditive = false

  // factorials[n] = n!, up to the longest possible sequence
  private factorials: number[] = [1]

  // characterCounts[n] = number of characters (code points) in password[0, n)
  private characterCounts = new Int32Array(1)

  constructor(private options: Options) {}

  // helper: make bruteforce match objects spanning i to j, inclusive.
  private makeBruteforceMatch(i: number, j: number): BruteForceMatch {
    return {
      pattern: 'bruteforce',
      token: this.password.slice(i, j + 1),
      i,
      j,
    }
  }

  private prepare(password: string) {
    const passwordLength = password.length
    this.factorials = [1]
    for (let n = 1; n <= passwordLength + 1; n += 1) {
      this.factorials[n] = this.factorials[n - 1] * n
    }
    // the low half of a surrogate pair doesn't count as a character
    this.characterCounts = new Int32Array(passwordLength + 1)
    for (let k = 0; k < passwordLength; k += 1) {
      const isPairedLowSurrogate =
        k > 0 &&
        password.charCodeAt(k) >= 0xdc00 &&
        password.charCodeAt(k) <= 0xdfff &&
        password.charCodeAt(k - 1) >= 0xd800 &&
        password.charCodeAt(k - 1) <= 0xdbff
      this.characterCounts[k + 1] =
        this.characterCounts[k] + (isPairedLowSurrogate ? 0 : 1)
    }
    this.state = {
      bestMatches: Array.from({ length: passwordLength }, () => []),
      guessesProduct: Array.from({ length: passwordLength }, () => []),
      totalGuesses: Array.from({ length: passwordLength }, () => []),
    }
  }

  // same as countCharacters(password.slice(i, j + 1))
  private countCharacters(i: number, j: number) {
    const counts = this.characterCounts
    let count = counts[j + 1] - counts[i]
    // a token starting in the middle of a surrogate pair counts that half
    if (counts[i + 1] === counts[i]) {
      count += 1
    }
    return count
  }

  // helper: considers whether a length-sequenceLength
  // sequence ending at match is better (fewer guesses)
  // than previously encountered sequences, updating state if so.
  // takes plain numbers instead of an options object, it runs in the hot loop
  // eslint-disable-next-line max-params, max-statements
  private update(
    match: BestMatch,
    i: number,
    j: number,
    guesses: number,
    sequenceLength: number,
  ) {
    let pi = guesses
    if (sequenceLength > 1) {
      // we're considering a length-sequenceLength sequence ending with match:
      // obtain the product term in the minimization function by multiplying match's guesses
      // by the product of the length-(sequenceLength-1)
      // sequence ending just before match, at match.i - 1.
      pi *= this.state.guessesProduct[i - 1][sequenceLength - 1]
    }
    // calculate the minimization func
    let g = this.factorials[sequenceLength] * pi
    if (!this.excludeAdditive) {
      g += MIN_GUESSES_BEFORE_GROWING_SEQUENCE ** (sequenceLength - 1)
    }
    // update state if new best.
    // first see if any competing sequences covering this prefix,
    // with sequenceLength or fewer matches,
    // fare better than this sequence. if so, skip it and return.
    const competingG = this.state.totalGuesses[j]
    const maxCompetingLength = Math.min(sequenceLength, competingG.length - 1)
    for (let length = 1; length <= maxCompetingLength; length += 1) {
      const competingMetricMatch = competingG[length]
      if (competingMetricMatch !== undefined && competingMetricMatch <= g) {
        return
      }
    }
    // this sequence might be part of the final optimal sequence.
    competingG[sequenceLength] = g
    this.state.bestMatches[j][sequenceLength] = match
    this.state.guessesProduct[j][sequenceLength] = pi
  }

  // helper: evaluate bruteforce matches ending at passwordCharIndex.
  private bruteforceUpdate(passwordCharIndex: number) {
    // see if a single bruteforce match spanning the passwordCharIndex-prefix is optimal.
    this.update(
      0,
      0,
      passwordCharIndex,
      bruteforceGuesses(this.countCharacters(0, passwordCharIndex)),
      1,
    )

    for (let i = 1; i <= passwordCharIndex; i += 1) {
      // generate passwordCharIndex bruteforce matches, spanning from (i=1, j=passwordCharIndex) up to (i=passwordCharIndex, j=passwordCharIndex).
      // see if adding these new matches to any of the sequences in optimal[i-1]
      // leads to new bests.
      const previousBestMatches = this.state.bestMatches[i - 1]
      let guesses = 0
      for (
        let sequenceLength = 1;
        sequenceLength < previousBestMatches.length;
        sequenceLength += 1
      ) {
        const lastMatch = previousBestMatches[sequenceLength]
        // corner: an optimal sequence will never have two adjacent bruteforce matches.
        // it is strictly better to have a single bruteforce match spanning the same region:
        // same contribution to the guess product with a lower length.
        // --> safe to skip those cases.
        if (lastMatch !== undefined && !isBruteforce(lastMatch)) {
          if (guesses === 0) {
            guesses = bruteforceGuesses(
              this.countCharacters(i, passwordCharIndex),
            )
          }
          // try adding the bruteforce match to this length-sequenceLength sequence.
          this.update(i, i, passwordCharIndex, guesses, sequenceLength + 1)
        }
      }
    }
  }

  // helper: the sequence length with the fewest total guesses
  // covering the whole password
  private getBestSequenceLength(passwordLength: number) {
    let sequenceLength = 0
    // Infinity, not Number.MAX_VALUE: bruteforce guesses are capped at
    // MAX_VALUE, so the only candidate can be exactly MAX_VALUE
    let g = Number.POSITIVE_INFINITY
    const totalGuessesAtLastChar = this.state.totalGuesses[passwordLength - 1]

    if (totalGuessesAtLastChar) {
      for (
        let candidateSequenceLength = 1;
        candidateSequenceLength < totalGuessesAtLastChar.length;
        candidateSequenceLength += 1
      ) {
        const candidateMetricMatch =
          totalGuessesAtLastChar[candidateSequenceLength]
        if (candidateMetricMatch !== undefined && candidateMetricMatch < g) {
          sequenceLength = candidateSequenceLength
          g = candidateMetricMatch
        }
      }
    }
    return sequenceLength
  }

  // helper: step backwards through bestMatches starting at the end,
  // constructing the final optimal match sequence.
  private unwind(passwordLength: number) {
    const optimalMatchSequence: MatchEstimated[] = []
    let k = passwordLength - 1
    let sequenceLength = this.getBestSequenceLength(passwordLength)
    while (k >= 0) {
      const bestMatch = this.state.bestMatches[k][sequenceLength]
      const match =
        typeof bestMatch === 'number'
          ? estimateGuesses(
              this.options,
              this.makeBruteforceMatch(bestMatch, k),
              this.password,
            )
          : bestMatch
      optimalMatchSequence.unshift(match)
      k = match.i - 1
      sequenceLength -= 1
    }
    return optimalMatchSequence
  }

  // ------------------------------------------------------------------------------
  // search --- most guessable match sequence -------------------------------------
  // ------------------------------------------------------------------------------
  //
  // takes a sequence of overlapping matches, returns the non-overlapping sequence with
  // minimum guesses. the following is a O(l_max * (n + m)) dynamic programming algorithm
  // for a length-n password with m candidate matches. l_max is the maximum optimal
  // sequence length spanning each prefix of the password. In practice it rarely exceeds 5 and the
  // search terminates rapidly.
  //
  // the optimal "minimum guesses" sequence is here defined to be the sequence that
  // minimizes the following function:
  //
  //    totalGuesses = sequenceLength! * Product(m.guesses for m in sequence) + D^(sequenceLength - 1)
  //
  // where sequenceLength is the length of the sequence.
  //
  // the factorial term is the number of ways to order sequenceLength patterns.
  //
  // the D^(sequenceLength-1) term is another length penalty, roughly capturing the idea that an
  // attacker will try lower-length sequences first before trying length-sequenceLength sequences.
  //
  // for example, consider a sequence that is date-repeat-dictionary.
  //  - an attacker would need to try other date-repeat-dictionary combinations,
  //    hence the product term.
  //  - an attacker would need to try repeat-date-dictionary, dictionary-repeat-date,
  //    ..., hence the factorial term.
  //  - an attacker would also likely try length-1 (dictionary) and length-2 (dictionary-date)
  //    sequences before length-3. assuming at minimum D guesses per pattern type,
  //    D^(sequenceLength-1) approximates Sum(D^i for i in [1..sequenceLength-1]
  //
  // ------------------------------------------------------------------------------
  mostGuessableMatchSequence(
    password: string,
    matches: MatchExtended[],
    excludeAdditive = false,
  ) {
    this.password = password
    this.excludeAdditive = excludeAdditive
    const passwordLength = password.length
    // partition matches into sublists according to ending index j
    const matchesByCoordinateJ = Array.from(
      { length: passwordLength },
      () => [] as MatchExtended[],
    )

    matches.forEach((match) => {
      matchesByCoordinateJ[match.j].push(match)
    })
    // small detail: for deterministic output, sort each sublist by i.
    matchesByCoordinateJ.forEach((matchesAtJ) =>
      matchesAtJ.sort((m1: MatchExtended, m2: MatchExtended) => m1.i - m2.i),
    )

    this.prepare(password)

    for (let k = 0; k < passwordLength; k += 1) {
      matchesByCoordinateJ[k].forEach((match: MatchExtended) => {
        // a match's guess estimate doesn't change, estimate it once
        const estimatedMatch = estimateGuesses(this.options, match, password)
        const { i, guesses } = estimatedMatch
        if (i > 0) {
          const previousBestMatches = this.state.bestMatches[i - 1]
          for (
            let sequenceLength = 1;
            sequenceLength < previousBestMatches.length;
            sequenceLength += 1
          ) {
            if (previousBestMatches[sequenceLength] !== undefined) {
              this.update(estimatedMatch, i, k, guesses, sequenceLength + 1)
            }
          }
        } else {
          this.update(estimatedMatch, i, k, guesses, 1)
        }
      })
      this.bruteforceUpdate(k)
    }
    const optimalMatchSequence = this.unwind(passwordLength)
    const optimalSequenceLength = optimalMatchSequence.length
    const guesses = this.getGuesses(password, optimalSequenceLength)
    return {
      password,
      guesses,
      guessesLog10: utils.log10(guesses),
      sequence: optimalMatchSequence,
    }
  }

  getGuesses(password: string, optimalSequenceLength: number) {
    const passwordLength = password.length
    if (password.length === 0) {
      return 1
    } else {
      return this.state.totalGuesses[passwordLength - 1][optimalSequenceLength]
    }
  }
}
