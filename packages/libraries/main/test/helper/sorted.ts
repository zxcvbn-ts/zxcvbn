import { MatchExtended } from '../../src/types'

// sort on i primary, j secondary
export default (matches: MatchExtended[]) =>
  matches.sort((m1, m2) => m1.i - m2.i || m1.j - m2.j)
