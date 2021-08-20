import { Matcher } from '../../types'
import MatchPwned from './matching'
import scoring from './scoring'
import feedback from './feedback'
import haveIBeenPwned from './haveIBeenPwned'

const matcherPwnedFactory = (
  universalFetch: Function,
  url?: string,
): Matcher => {
  return {
    Matching: MatchPwned(universalFetch, url),
    feedback,
    scoring,
  }
}

export default matcherPwnedFactory

export { haveIBeenPwned }
