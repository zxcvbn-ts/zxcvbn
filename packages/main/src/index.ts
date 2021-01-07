import Matching from './Matching'
import scoring from './scoring'
import TimeEstimates from './TimeEstimates'
import Feedback from './Feedback'
import Options from './Options'
import { OptionsType } from './types'

const time = () => new Date().getTime()

export default (password: string, options: OptionsType = {}) => {
  Options.setOptions(options)
  const feedback = new Feedback()
  const matching = new Matching()
  const timeEstimates = new TimeEstimates()

  const start = time()

  const matches = matching.match(password)

  const matchSequence = scoring.mostGuessableMatchSequence(password, matches)
  const calcTime = time() - start
  const attackTimes = timeEstimates.estimateAttackTimes(matchSequence.guesses)

  return {
    calcTime,
    ...matchSequence,
    ...attackTimes,
    // @ts-ignore
    feedback: feedback.getFeedback(attackTimes.score, matchSequence.sequence),
  }
}
