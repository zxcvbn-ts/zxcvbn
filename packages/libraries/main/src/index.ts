import Matching from './Matching.ts'
import { TimeEstimates } from './TimeEstimates.ts'
import Feedback from './Feedback.ts'
import Options from './Options.ts'
import debounce from './utils/debounce.ts'
import { isSurrogatePairAt } from './utils/helper.ts'
import {
  Matcher,
  MatchEstimated,
  MatchExtended,
  OptionsType,
  ZxcvbnResult,
} from './types.ts'
import Scoring from './scoring/index.ts'

const time = () => new Date().getTime()

class ZxcvbnFactory {
  private options: Options

  private scoring: Scoring

  private matching: Matching

  private feedback: Feedback

  private timeEstimates: TimeEstimates

  constructor(
    options: OptionsType = {},
    customMatchers: Record<string, Matcher> = {},
  ) {
    this.options = new Options(options, customMatchers)
    this.scoring = new Scoring(this.options)
    this.matching = new Matching(this.options)
    this.feedback = new Feedback(this.options)
    this.timeEstimates = new TimeEstimates(this.options)
  }

  private estimateAttackTimes(guesses: number) {
    return this.timeEstimates.estimateAttackTimes(guesses)
  }

  private getFeedback(score: number, sequence: MatchEstimated[]) {
    return this.feedback.getFeedback(score, sequence)
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

  private getMatches(password: string, userInputs?: (string | number)[]) {
    const userInputsOptions = this.options.getUserInputsOptions(userInputs)

    return this.matching.match(password, userInputsOptions)
  }

  public check(password: string, userInputs?: (string | number)[]) {
    const { reducedPassword, start } = this.prepareCheck(password)
    const matches = this.getMatches(reducedPassword, userInputs)

    if (matches instanceof Promise) {
      throw new Error(
        'You are using a Promised matcher, please use `checkAsync` for it.',
      )
    }
    return this.createReturnValue(matches, reducedPassword, start)
  }

  public async checkAsync(password: string, userInputs?: (string | number)[]) {
    const { reducedPassword, start } = this.prepareCheck(password)
    const matches = await this.getMatches(reducedPassword, userInputs)

    return this.createReturnValue(matches, reducedPassword, start)
  }

  private prepareCheck(password: string) {
    let end = this.options.maxLength
    // maxLength counts UTF-16 code units. If the cut lands inside a surrogate
    // pair (eg. an emoji), drop that whole character instead of half of it.
    if (isSurrogatePairAt(password, end - 1)) {
      end -= 1
    }
    return {
      reducedPassword: password.substring(0, end),
      start: time(),
    }
  }
}

export * from './types.ts'
export { ZxcvbnFactory, debounce, Options }
