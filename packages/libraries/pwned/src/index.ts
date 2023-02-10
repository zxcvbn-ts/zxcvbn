// @ts-ignore
import { Matcher, Options } from '@zxcvbn-ts/core'
import MatchPwned from './matching'
import scoring from './scoring'
import FeedbackFactory from './feedback'
import haveIBeenPwned from './haveIBeenPwned'
import { FetchApi, MatcherPwnedFactoryConfig } from './types'

export const matcherPwnedFactory = (
  universalFetch: FetchApi,
  options: Options,
  config: MatcherPwnedFactoryConfig = {},
): Matcher => {
  return {
    Matching: MatchPwned(universalFetch, config),
    feedback: FeedbackFactory(options),
    scoring,
  }
}

export { haveIBeenPwned }
