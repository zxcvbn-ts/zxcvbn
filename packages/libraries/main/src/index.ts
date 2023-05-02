import Matching from './Matching'
import scoring from './scoring'
import TimeEstimates from './TimeEstimates'
import Feedback from './Feedback'
import { zxcvbnOptions, Options } from './Options'
import debounce from './debounce'
import { MatchExtended, ZxcvbnResult } from './types'

const time = () => new Date().getTime()

const createReturnValue = (
  resolvedMatches: MatchExtended[],
  password: string,
  start: number,
): ZxcvbnResult => {
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
    feedback: feedback.getFeedback(attackTimes.score, matchSequence.sequence),
  }
}

const main = (password: string, userInputs?: (string | number)[]) => {
  if (userInputs) {
    zxcvbnOptions.extendUserInputsDictionary(userInputs)
  }

  const matching = new Matching()

  return matching.match(password)
}

export const zxcvbn = (password: string, userInputs?: (string | number)[]) => {
  const start = time()
  const matches = main(password, userInputs)

  if (matches instanceof Promise) {
    throw new Error(
      'You are using a Promised matcher, please use `zxcvbnAsync` for it.',
    )
  }
  return createReturnValue(matches, password, start)
}

export const zxcvbnAsync = async (
  password: string,
  userInputs?: (string | number)[],
): Promise<ZxcvbnResult> => {
  const usedPassword = password.substring(0, zxcvbnOptions.maxLength)
  const start = time()
  const matches = await main(usedPassword, userInputs)

  return createReturnValue(matches, usedPassword, start)
}

export * from './types'
export { zxcvbnOptions, Options, debounce }
