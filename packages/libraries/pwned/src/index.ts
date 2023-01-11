// @ts-ignore
import { Matcher, Options } from '@zxcvbn-ts/core'
import MatchPwned from './matching'
import scoring from './scoring'
import FeedbackFactory from './feedback'
import haveIBeenPwned from './haveIBeenPwned'
import { FetchApi } from './types'

const matcherPwnedFactory = (
  universalFetch: FetchApi,
  options: Options,
  url?: string,
): Matcher => {
  return {
    Matching: MatchPwned(universalFetch, url),
    feedback: FeedbackFactory(options),
    scoring,
  }
}

export default matcherPwnedFactory

export { haveIBeenPwned }
