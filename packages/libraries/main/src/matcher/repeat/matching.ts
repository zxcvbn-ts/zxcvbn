import { RepeatMatch } from '../../types'
import scoring from '../../scoring'
import Matching from '../../Matching'

interface RepeatMatchOptions {
  password: string
  omniMatch: Matching
}
/*
 *-------------------------------------------------------------------------------
 * repeats (aaa, abcabcabc) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchRepeat {
  // eslint-disable-next-line max-statements
  match({ password, omniMatch }: RepeatMatchOptions) {
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
        const baseGuesses = this.getBaseGuesses(baseToken, omniMatch)
        matches.push(this.normalizeMatch(baseToken, j, match, baseGuesses))

        lastIndex = j + 1
      }
    }

    const hasPromises = matches.some((match) => {
      return match instanceof Promise
    })
    if (hasPromises) {
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
  ) {
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
        } as RepeatMatch
      })
    }
    return {
      ...baseMatch,
      baseGuesses,
    } as RepeatMatch
  }

  getGreedyMatch(password: string, lastIndex: number) {
    const greedy = /(.+)\1+/g
    greedy.lastIndex = lastIndex
    return greedy.exec(password)
  }

  getLazyMatch(password: string, lastIndex: number) {
    const lazy = /(.+?)\1+/g
    lazy.lastIndex = lastIndex
    return lazy.exec(password)
  }

  setMatchToken(
    greedyMatch: RegExpExecArray,
    lazyMatch: RegExpExecArray | null,
  ) {
    const lazyAnchored = /^(.+?)\1+$/
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
      const temp = lazyAnchored.exec(match[0])
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

  getBaseGuesses(baseToken: string, omniMatch: Matching) {
    const matches = omniMatch.match(baseToken)
    if (matches instanceof Promise) {
      return matches.then((resolvedMatches) => {
        const baseAnalysis = scoring.mostGuessableMatchSequence(
          baseToken,
          resolvedMatches,
        )
        return baseAnalysis.guesses
      })
    }
    const baseAnalysis = scoring.mostGuessableMatchSequence(baseToken, matches)
    return baseAnalysis.guesses
  }
}

export default MatchRepeat
