import { sorted, extend } from '../../helper'
import { zxcvbnOptions } from '../../Options'
import { LooseObject, SpatialMatch } from '../../types'

interface SpatialMatchOptions {
  password: string
}
/*
 * ------------------------------------------------------------------------------
 * spatial match (qwerty/dvorak/keypad and so on) -----------------------------------------
 * ------------------------------------------------------------------------------
 */
class MatchSpatial {
  SHIFTED_RX = /[~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?]/

  match({ password }: SpatialMatchOptions) {
    const matches: SpatialMatch[] = []
    Object.keys(zxcvbnOptions.graphs).forEach((graphName) => {
      const graph = zxcvbnOptions.graphs[graphName]
      extend(matches, this.helper(password, graph, graphName))
    })
    return sorted(matches)
  }

  checkIfShifted(graphName: string, password: string, index: number) {
    if (
      !graphName.includes('keypad') &&
      // initial character is shifted
      this.SHIFTED_RX.test(password.charAt(index))
    ) {
      return 1
    }
    return 0
  }

  // eslint-disable-next-line complexity, max-statements
  helper(password: string, graph: LooseObject, graphName: string) {
    let shiftedCount
    const matches: SpatialMatch[] = []
    let i = 0
    const passwordLength = password.length
    while (i < passwordLength - 1) {
      let j = i + 1
      let lastDirection: number | null = null
      let turns = 0
      shiftedCount = this.checkIfShifted(graphName, password, i)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const prevChar = password.charAt(j - 1)
        const adjacents = graph[prevChar as keyof typeof graph] || []
        let found = false
        let foundDirection = -1
        let curDirection = -1
        // consider growing pattern by one character if j hasn't gone over the edge.
        if (j < passwordLength) {
          const curChar = password.charAt(j)
          const adjacentsLength = adjacents.length
          for (let k = 0; k < adjacentsLength; k += 1) {
            const adjacent = adjacents[k]
            curDirection += 1
            // eslint-disable-next-line max-depth
            if (adjacent) {
              const adjacentIndex = adjacent.indexOf(curChar)
              // eslint-disable-next-line max-depth
              if (adjacentIndex !== -1) {
                found = true
                foundDirection = curDirection
                // eslint-disable-next-line max-depth
                if (adjacentIndex === 1) {
                  // # index 1 in the adjacency means the key is shifted,
                  // # 0 means unshifted: A vs a, % vs 5, etc.
                  // # for example, 'q' is adjacent to the entry '2@'.
                  // # @ is shifted w/ index 1, 2 is unshifted.
                  shiftedCount += 1
                }
                // eslint-disable-next-line max-depth
                if (lastDirection !== foundDirection) {
                  // # adding a turn is correct even in the initial
                  // case when last_direction is null:
                  // # every spatial pattern starts with a turn.
                  turns += 1
                  lastDirection = foundDirection
                }
                break
              }
            }
          }
        }
        // if the current pattern continued, extend j and try to grow again
        if (found) {
          j += 1
          // otherwise push the pattern discovered so far, if any...
        } else {
          // don't consider length 1 or 2 chains.
          if (j - i > 2) {
            matches.push({
              pattern: 'spatial',
              i,
              j: j - 1,
              token: password.slice(i, j),
              graph: graphName,
              turns,
              shiftedCount,
            })
          }
          // ...and then start a new search for the rest of the password.
          i = j
          break
        }
      }
    }
    return matches
  }
}

export default MatchSpatial
