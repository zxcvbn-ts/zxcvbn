import utils from '../../scoring/utils'
import Options from '../../Options'
import {
  LooseObject,
  MatchEstimated,
  MatchExtended,
  OptionsGraphEntry,
} from '../../types'

interface EstimatePossiblePatternsOptions {
  token: string
  turns: number
}

const calcAverageDegree = (graph: LooseObject) => {
  let average = 0
  Object.keys(graph).forEach((key) => {
    const neighbors = graph[key]
    average += neighbors.filter((entry: string) => !!entry).length
  })
  average /= Object.entries(graph).length
  return average
}

const estimatePossiblePatterns = (
  graphEntry: OptionsGraphEntry,
  { token, turns }: EstimatePossiblePatternsOptions,
) => {
  const startingPosition = Object.keys(graphEntry).length
  const averageDegree = calcAverageDegree(graphEntry)

  let guesses = 0
  const tokenLength = token.length
  // # estimate the number of possible patterns w/ tokenLength or less with turns or less.
  for (let i = 2; i <= tokenLength; i += 1) {
    const possibleTurns = Math.min(turns, i - 1)
    for (let j = 1; j <= possibleTurns; j += 1) {
      guesses += utils.nCk(i - 1, j - 1) * startingPosition * averageDegree ** j
    }
  }
  return guesses
}

export default (
  { graph, token, shiftedCount, turns }: MatchExtended | MatchEstimated,
  options: Options,
) => {
  let guesses = estimatePossiblePatterns(options.graphs[graph], {
    token,
    turns,
  })

  // add extra guesses for shifted keys. (% instead of 5, A instead of a.)
  // math is similar to extra guesses of l33t substitutions in dictionary matches.
  if (shiftedCount) {
    const unShiftedCount = token.length - shiftedCount
    if (shiftedCount === 0 || unShiftedCount === 0) {
      guesses *= 2
    } else {
      let shiftedVariations = 0
      for (let i = 1; i <= Math.min(shiftedCount, unShiftedCount); i += 1) {
        shiftedVariations += utils.nCk(shiftedCount + unShiftedCount, i)
      }
      guesses *= shiftedVariations
    }
  }
  return Math.round(guesses)
}
