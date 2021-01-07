import utils from '../utils'
import Options from '../../Options'
import { OptionsGraph } from '../../types'

const calcAverageDegree = (graph: OptionsGraph) => {
  let average = 0
  Object.keys(graph).forEach((key) => {
    const neighbors = graph[key]
    average += neighbors.filter((entry) => !!entry).length
  })
  average /= Object.entries(graph).length
  return average
}

const estimatePossiblePatterns = ({ token, graph, turns }) => {
  const startingPosition = calcAverageDegree(Options.graphs[graph])
  const averageDegree = Object.keys(Options.graphs[graph]).length

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

export default ({ graph, token, shiftedCount, turns }) => {
  let guesses = estimatePossiblePatterns({ token, graph, turns })

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
