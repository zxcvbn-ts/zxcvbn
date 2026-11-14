import utils from './utils.ts'
import estimateGuesses from './estimate.ts'
import { MIN_GUESSES_BEFORE_GROWING_SEQUENCE } from '../data/const.ts'
import { MatchExtended, BruteForceMatch, MatchEstimated } from '../types.ts'
import Options from '../Options.ts'
import { bruteforceGuesses } from '../matcher/bruteforce/scoring.ts'
import { isSurrogatePairAt } from '../utils/helper.ts'

// a slot in the search holds either an estimated match or, for a bruteforce
// match, just its start index. Bruteforce candidates are rated as numbers
// and only become match objects in unwind.
type BestMatch = MatchEstimated | number

// all arrays are indexed by [endIndex][sequenceLength], with holes for
// sequence lengths that don't have a best sequence ending at endIndex
interface SearchState {
  // bestMatches[endIndex][sequenceLength] holds the final match in the best
  // length-sequenceLength match sequence covering the password prefix up to
  // endIndex, inclusive. if there is no length-sequenceLength sequence that
  // scores better (fewer guesses) than a shorter match sequence spanning the
  // same prefix, bestMatches[endIndex][sequenceLength] is undefined.
  bestMatches: BestMatch[][]
  // holds the product term Prod(match.guesses for match in sequence).
  // allows for fast (non-looping) updates to the minimization function.
  guessesProduct: number[][]
  // holds the overall metric.
  totalGuesses: number[][]
}

const isBruteforce = (match: BestMatch) =>
  typeof match === 'number' || match.pattern === 'bruteforce'

// in log10 units, far above the rounding error of the bounds, so a skipped
// bruteforce candidate is always one that would be rejected
const BOUND_TOLERANCE = 1e-9

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

  // additivePenalties[n] = MIN_GUESSES_BEFORE_GROWING_SEQUENCE ** (n - 1)
  private additivePenalties: number[] = [1]

  // bestUpTo[sequenceLength] = the fewest total guesses of the sequences
  // ending at the current endIndex with sequenceLength or fewer matches,
  // Infinity if there are none. Every update is for the current endIndex, so
  // the competing sequences of a candidate are compared at once.
  private bestUpTo = new Float64Array(1)

  // the index whose best sequences the search is finding, every update is
  // for a sequence ending there. A sequence ending at endIndex has at most
  // endIndex + 1 matches
  private endIndex = 0

  // characterCounts[n] = number of characters (code points) in password[0, n)
  private characterCounts = new Int32Array(1)

  // bruteforceGuessesByLength[n] = bruteforceGuesses(n), for every token length
  private bruteforceGuessesByLength: number[] = []

  // startBounds[i] = the lowest log10(sequenceLength! * guessesProduct) of
  // the sequences ending at i - 1 that a bruteforce match from i can extend,
  // minus the characters of password[0, i). Infinity if there are none.
  // A bruteforce match of c characters adds a factor of at least 10^c, so
  // its candidates make at least 10^(characters up to its end + bound) guesses.
  private startBounds = new Float64Array(1)

  // startLengths[i] = the lengths of the sequences ending at i - 1 that a
  // bruteforce match from i can extend, the ones not ending in bruteforce
  private startLengths: number[][] = []

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
    this.additivePenalties = [1]
    this.bruteforceGuessesByLength = [bruteforceGuesses(0)]
    for (let n = 1; n <= passwordLength + 1; n += 1) {
      this.factorials[n] = utils.factorial(n)
      this.additivePenalties[n] = MIN_GUESSES_BEFORE_GROWING_SEQUENCE ** (n - 1)
      this.bruteforceGuessesByLength[n] = bruteforceGuesses(n)
    }
    this.bestUpTo = new Float64Array(passwordLength + 2)
    this.prepareCharacterCounts(password)
    this.startBounds = new Float64Array(passwordLength)
    this.startLengths = []
    this.state = {
      bestMatches: Array.from({ length: passwordLength }, () => []),
      guessesProduct: Array.from({ length: passwordLength }, () => []),
      totalGuesses: Array.from({ length: passwordLength }, () => []),
    }
  }

  private prepareCharacterCounts(password: string) {
    const passwordLength = password.length
    // the low half of a surrogate pair doesn't count as a character
    this.characterCounts = new Int32Array(passwordLength + 1)
    for (let index = 0; index < passwordLength; index += 1) {
      const isPairedLowSurrogate =
        index > 0 && isSurrogatePairAt(password, index - 1)
      this.characterCounts[index + 1] =
        this.characterCounts[index] + (isPairedLowSurrogate ? 0 : 1)
    }
  }

  // same as countCharacters(password.slice(i, j + 1)), from the counts
  private countTokenCharacters(i: number, j: number) {
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
  // match ends at endIndex. Its guesses are passed in, a bruteforce match is
  // only its start index and has none to read
  // eslint-disable-next-line max-statements, complexity
  private update(match: BestMatch, guesses: number, sequenceLength: number) {
    const { endIndex } = this
    let pi = guesses
    if (sequenceLength > 1) {
      const i = typeof match === 'number' ? match : match.i
      // we're considering a length-sequenceLength sequence ending with match:
      // obtain the product term in the minimization function by multiplying match's guesses
      // by the product of the length-(sequenceLength-1)
      // sequence ending just before match, at match.i - 1.
      pi *= this.state.guessesProduct[i - 1][sequenceLength - 1]
    }
    // calculate the minimization func
    let sequenceGuesses = this.factorials[sequenceLength] * pi
    if (!this.excludeAdditive) {
      sequenceGuesses += this.additivePenalties[sequenceLength]
    }
    // update state if new best.
    // first see if any competing sequences covering this prefix,
    // with sequenceLength or fewer matches,
    // fare better than this sequence. if so, skip it and return.
    const competingGuesses = this.state.totalGuesses[endIndex]
    const { bestUpTo } = this
    if (sequenceGuesses === Number.POSITIVE_INFINITY) {
      // bestUpTo can't tell an Infinity sequence from none
      const maxCompetingLength = Math.min(
        sequenceLength,
        competingGuesses.length - 1,
      )
      for (let length = 1; length <= maxCompetingLength; length += 1) {
        if (competingGuesses[length] !== undefined) {
          return
        }
      }
    } else if (bestUpTo[sequenceLength] <= sequenceGuesses) {
      return
    }
    // this sequence might be part of the final optimal sequence.
    // bestUpTo doesn't increase with the length, so it stops at the first
    // length that already has as few
    for (
      let length = sequenceLength;
      length <= endIndex + 1 && bestUpTo[length] > sequenceGuesses;
      length += 1
    ) {
      bestUpTo[length] = sequenceGuesses
    }
    competingGuesses[sequenceLength] = sequenceGuesses
    this.state.bestMatches[endIndex][sequenceLength] = match
    this.state.guessesProduct[endIndex][sequenceLength] = pi
  }

  // helper: sets startBounds[i] once the sequences ending at i - 1 are final
  private boundStart(i: number) {
    const previousBestMatches = this.state.bestMatches[i - 1]
    const previousGuessesProduct = this.state.guessesProduct[i - 1]
    const lengths: number[] = []
    let bound = Number.POSITIVE_INFINITY
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
        lengths.push(sequenceLength)
        bound = Math.min(
          bound,
          Math.log10(
            this.factorials[sequenceLength + 1] *
              previousGuessesProduct[sequenceLength],
          ),
        )
      }
    }
    this.startBounds[i] = bound - this.characterCounts[i]
    this.startLengths[i] = lengths
  }

  // helper: evaluate bruteforce matches ending at passwordCharIndex.
  private bruteforceUpdate(passwordCharIndex: number) {
    // see if a single bruteforce match spanning the passwordCharIndex-prefix is optimal.
    this.update(
      0,
      this.bruteforceGuessesByLength[
        this.countTokenCharacters(0, passwordCharIndex)
      ],
      1,
    )

    // every candidate below has a sequence length of 2 or more, so update
    // rejects it unless it beats the best length 1 and 2 sequences, which
    // only get better in this loop. A start whose bound doesn't beat them
    // is skipped, the same as update would reject all of its candidates.
    const skipFrom =
      Math.log10(this.bestUpTo[2]) -
      this.characterCounts[passwordCharIndex + 1] +
      BOUND_TOLERANCE

    for (let i = 1; i <= passwordCharIndex; i += 1) {
      if (this.startBounds[i] >= skipFrom) {
        continue
      }
      // generate passwordCharIndex bruteforce matches, spanning from (i=1, j=passwordCharIndex) up to (i=passwordCharIndex, j=passwordCharIndex).
      // see if adding these new matches to any of the sequences in optimal[i-1]
      // leads to new bests.
      const lengths = this.startLengths[i]
      const guesses =
        this.bruteforceGuessesByLength[
          this.countTokenCharacters(i, passwordCharIndex)
        ]
      for (const sequenceLength of lengths) {
        // try adding the bruteforce match to this length-sequenceLength sequence.
        this.update(i, guesses, sequenceLength + 1)
      }
    }
  }

  // helper: finds the best sequences ending at endIndex, from the matches
  // ending there
  private step(endIndex: number, matchesAtEnd: MatchExtended[]) {
    this.endIndex = endIndex
    this.bestUpTo.fill(Number.POSITIVE_INFINITY, 0, endIndex + 2)
    matchesAtEnd.forEach((match: MatchExtended) => {
      // a match's guess estimate doesn't change, estimate it once
      const estimatedMatch = estimateGuesses(this.options, match, this.password)
      const { i, guesses } = estimatedMatch
      if (i > 0) {
        const previousBestMatches = this.state.bestMatches[i - 1]
        for (
          let sequenceLength = 1;
          sequenceLength < previousBestMatches.length;
          sequenceLength += 1
        ) {
          if (previousBestMatches[sequenceLength] !== undefined) {
            this.update(estimatedMatch, guesses, sequenceLength + 1)
          }
        }
      } else {
        this.update(estimatedMatch, guesses, 1)
      }
    })
    this.bruteforceUpdate(endIndex)
    if (endIndex + 1 < this.password.length) {
      this.boundStart(endIndex + 1)
    }
  }

  // helper: the sequence length with the fewest total guesses
  // covering the whole password
  private getBestSequenceLength(passwordLength: number) {
    let sequenceLength = 0
    // Infinity, not Number.MAX_VALUE: bruteforce guesses are capped at
    // MAX_VALUE, so the only candidate can be exactly MAX_VALUE
    let fewestGuesses = Number.POSITIVE_INFINITY
    const totalGuessesAtLastChar = this.state.totalGuesses[passwordLength - 1]

    if (totalGuessesAtLastChar) {
      for (
        let candidateSequenceLength = 1;
        candidateSequenceLength < totalGuessesAtLastChar.length;
        candidateSequenceLength += 1
      ) {
        const candidateMetricMatch =
          totalGuessesAtLastChar[candidateSequenceLength]
        if (
          candidateMetricMatch !== undefined &&
          candidateMetricMatch < fewestGuesses
        ) {
          sequenceLength = candidateSequenceLength
          fewestGuesses = candidateMetricMatch
        }
      }
    }
    return sequenceLength
  }

  // helper: step backwards through bestMatches starting at the end,
  // constructing the final optimal match sequence.
  private unwind(passwordLength: number) {
    const optimalMatchSequence: MatchEstimated[] = []
    let endIndex = passwordLength - 1
    let sequenceLength = this.getBestSequenceLength(passwordLength)
    while (endIndex >= 0) {
      const bestMatch = this.state.bestMatches[endIndex][sequenceLength]
      const match =
        typeof bestMatch === 'number'
          ? estimateGuesses(
              this.options,
              this.makeBruteforceMatch(bestMatch, endIndex),
              this.password,
            )
          : bestMatch
      optimalMatchSequence.unshift(match)
      endIndex = match.i - 1
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

    for (let endIndex = 0; endIndex < passwordLength; endIndex += 1) {
      this.step(endIndex, matchesByCoordinateJ[endIndex])
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
