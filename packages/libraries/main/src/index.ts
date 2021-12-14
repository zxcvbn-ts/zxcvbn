import Matching from './Matching'
import scoring from './scoring'
import TimeEstimates from './TimeEstimates'
import Feedback from './Feedback'
import Options from './Options'
import { MatchEstimated, MatchExtended, ZxcvbnResult } from './types'

const time = () => new Date().getTime()

const createReturnValue = (
  resolvedMatches: MatchExtended[],
  password: string,
  start: number,
) => {
  const feedback = new Feedback()
  const timeEstimates = new TimeEstimates()
  const matchSequence = scoring.mostGuessableMatchSequence(
    password,
    resolvedMatches,
  )
  const calcTime = time() - start
  const attackTimes = timeEstimates.estimateAttackTimes(matchSequence.guesses)

  return {
    calcTime,
    ...matchSequence,
    ...attackTimes,
    feedback: feedback.getFeedback(
      attackTimes.score,
      matchSequence.sequence as MatchEstimated[],
    ),
  }
}

export const zxcvbn = (
  password: string,
  userInputs?: (string | number)[],
): ZxcvbnResult | Promise<ZxcvbnResult> => {
  if (userInputs) {
    Options.extendUserInputsDictionary(userInputs)
  }

  const matching = new Matching()

  const start = time()

  const matches = matching.match(password)

  if (matches instanceof Promise) {
    return matches.then((resolvedMatches) => {
      return createReturnValue(resolvedMatches, password, start)
    })
  }
  return createReturnValue(matches, password, start)
}

export { Options as ZxcvbnOptions, ZxcvbnResult }
