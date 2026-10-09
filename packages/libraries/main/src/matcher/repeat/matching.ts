import { MatcherBaseClass, MatchOptions, RepeatMatch } from '../../types'
import Scoring from '../../scoring'
import Matching from '../../Matching'
import Options from '../../Options'
import { MaybePromise } from 'rollup'

/*
 *-------------------------------------------------------------------------------
 * repeats (aaa, abcabcabc) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchRepeat extends MatcherBaseClass {
  private static readonly GREEDY = /(.+)\1+/g

  private static readonly LAZY = /(.+?)\1+/g

  private static readonly LAZY_ANCHORED = /^(.+?)\1+$/

  private scoring: Scoring

  constructor(options: Options) {
    super(options)
    this.scoring = new Scoring(options)
  }

  // eslint-disable-next-line max-statements
  match({ password, omniMatch }: MatchOptions) {
    // Scoped to this call rather than an instance field: getBaseGuesses
    // recurses back into this same instance via omniMatch.match(baseToken),
    // and a shared field would get cleared by that nested call before the
    // outer loop's later iterations could reuse it.
    const memoizedResults = new Map<string, number | Promise<number>>()
    const matches: (RepeatMatch | Promise<RepeatMatch>)[] = []
    let lastIndex = 0
    while (lastIndex < password.length) {
      const greedyMatch = this.getGreedyMatch(password, lastIndex)
      const lazyMatch = this.getLazyMatch(password, lastIndex)
      if (greedyMatch == null) {
        break
      }
      const { match, baseToken } = this.setMatchToken(greedyMatch, lazyMatch)

      if (match) {
        const j = match.index + match[0].length - 1
        const baseGuesses = this.getBaseGuesses(
          baseToken,
          omniMatch,
          memoizedResults,
        )
        matches.push(this.normalizeMatch(baseToken, j, match, baseGuesses))

        lastIndex = j + 1
      }
    }

    const hasPromises = matches.some((match) => {
      return match instanceof Promise
    })
    if (hasPromises) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      return Promise.all(matches)
    }
    return matches as RepeatMatch[]
  }

  // eslint-disable-next-line max-params
  normalizeMatch(
    baseToken: string,
    j: number,
    match: RegExpExecArray,
    baseGuesses: number | Promise<number>,
  ): MaybePromise<RepeatMatch> {
    const baseMatch: RepeatMatch = {
      pattern: 'repeat',
      i: match.index,
      j,
      token: match[0],
      baseToken,
      baseGuesses: 0,
      repeatCount: match[0].length / baseToken.length,
    }
    if (baseGuesses instanceof Promise) {
      return baseGuesses.then((resolvedBaseGuesses) => {
        return {
          ...baseMatch,
          baseGuesses: resolvedBaseGuesses,
        }
      })
    }
    return {
      ...baseMatch,
      baseGuesses,
    }
  }

  getGreedyMatch(password: string, lastIndex: number) {
    MatchRepeat.GREEDY.lastIndex = lastIndex
    return MatchRepeat.GREEDY.exec(password)
  }

  getLazyMatch(password: string, lastIndex: number) {
    MatchRepeat.LAZY.lastIndex = lastIndex
    return MatchRepeat.LAZY.exec(password)
  }

  setMatchToken(
    greedyMatch: RegExpExecArray,
    lazyMatch: RegExpExecArray | null,
  ) {
    let match
    let baseToken = ''
    if (lazyMatch && greedyMatch[0].length > lazyMatch[0].length) {
      // greedy beats lazy for 'aabaab'
      // greedy: [aabaab, aab]
      // lazy:   [aa,     a]
      match = greedyMatch
      // greedy's repeated string might itself be repeated, eg.
      // aabaab in aabaabaabaab.
      // run an anchored lazy match on greedy's repeated string
      // to find the shortest repeated string
      const temp = MatchRepeat.LAZY_ANCHORED.exec(match[0])
      if (temp) {
        baseToken = temp[1]
      }
    } else {
      // lazy beats greedy for 'aaaaa'
      // greedy: [aaaa,  aa]
      // lazy:   [aaaaa, a]
      match = lazyMatch
      if (match) {
        baseToken = match[1]
      }
    }
    return {
      match,
      baseToken,
    }
  }

  getBaseGuesses(
    baseToken: string,
    omniMatch: Matching,
    memoizedResults: Map<string, number | Promise<number>>,
  ) {
    if (memoizedResults.has(baseToken)) {
      return memoizedResults.get(baseToken)!
    }
    const matches = omniMatch.match(baseToken)
    let result: number | Promise<number>
    if (matches instanceof Promise) {
      result = matches.then((resolvedMatches) => {
        const baseAnalysis = this.scoring.mostGuessableMatchSequence(
          baseToken,
          resolvedMatches,
        )
        return baseAnalysis.guesses
      })
    } else {
      const baseAnalysis = this.scoring.mostGuessableMatchSequence(
        baseToken,
        matches,
      )
      result = baseAnalysis.guesses
    }
    memoizedResults.set(baseToken, result)
    return result
  }
}

export default MatchRepeat
