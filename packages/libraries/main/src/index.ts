import Matching from './Matching'
import { TimeEstimates } from './TimeEstimates'
import Feedback from './Feedback'
import Options from './Options'
import debounce from './utils/debounce'
import {
  Matcher,
  MatchEstimated,
  MatchExtended,
  OptionsType,
  ZxcvbnResult,
} from './types'
import Scoring from './scoring'

const time = () => new Date().getTime()

class ZxcvbnFactory {
  private options: Options

  private scoring: Scoring

  constructor(
    options: OptionsType = {},
    customMatchers: Record<string, Matcher> = {},
  ) {
    this.options = new Options(options, customMatchers)
    this.scoring = new Scoring(this.options)
  }

  private estimateAttackTimes(guesses: number) {
    const timeEstimates = new TimeEstimates(this.options)
    return timeEstimates.estimateAttackTimes(guesses)
  }

  private getFeedback(score: number, sequence: MatchEstimated[]) {
    const feedback = new Feedback(this.options)
    return feedback.getFeedback(score, sequence)
  }

  private createReturnValue(
    resolvedMatches: MatchExtended[],
    password: string,
    start: number,
  ): ZxcvbnResult {
    const matchSequence = this.scoring.mostGuessableMatchSequence(
      password,
      resolvedMatches,
    )
    const calcTime = time() - start
    const attackTimes = this.estimateAttackTimes(matchSequence.guesses)

    return {
      calcTime,
      ...matchSequence,
      ...attackTimes,
      feedback: this.getFeedback(attackTimes.score, matchSequence.sequence),
    }
  }

  private main(password: string, userInputs?: (string | number)[]) {
    const userInputsOptions = this.options.getUserInputsOptions(userInputs)

    const matching = new Matching(this.options)

    return matching.match(password, userInputsOptions)
  }

  public check(password: string, userInputs?: (string | number)[]) {
    const reducedPassword = password.substring(0, this.options.maxLength)
    const start = time()
    const matches = this.main(reducedPassword, userInputs)

    if (matches instanceof Promise) {
      throw new Error(
        'You are using a Promised matcher, please use `zxcvbnAsync` for it.',
      )
    }
    return this.createReturnValue(matches, reducedPassword, start)
  }

  public async checkAsync(password: string, userInputs?: (string | number)[]) {
    const reducedPassword = password.substring(0, this.options.maxLength)
    const start = time()
    const matches = await this.main(reducedPassword, userInputs)

    return this.createReturnValue(matches, reducedPassword, start)
  }
}

export * from './types'
export { ZxcvbnFactory, debounce }
