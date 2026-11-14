import { Matcher } from '@zxcvbn-ts/core'
import MatchPwned from './matching.ts'
import scoring from './scoring.ts'
import FeedbackFactory from './feedback.ts'
import haveIBeenPwned from './haveIBeenPwned.ts'
import { FetchApi, MatcherPwnedFactoryConfig } from './types.ts'

export const matcherPwnedFactory = (
  universalFetch: FetchApi,
  config: MatcherPwnedFactoryConfig = {},
): Matcher => {
  return {
    Matching: MatchPwned(universalFetch, config),
    feedback: FeedbackFactory,
    scoring,
  }
}

export { haveIBeenPwned }
