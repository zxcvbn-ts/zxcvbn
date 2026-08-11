import { L33tMatch } from '../../../../types'
import { DictionaryMatchOptions } from '../../types'
import MatchDictionary from '../../matching'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary l33t matching -----------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchL33t extends MatchDictionary {
  public match(matchOptions: DictionaryMatchOptions) {
    const matches = super.match(matchOptions, true, false) as L33tMatch[]

    // filter single-character l33t matches to reduce noise.
    // otherwise '1' matches 'i', '4' matches 'a', both very common English words
    // with low dictionary rank.
    return matches.filter((match) => match.token.length > 1)
  }
}

export default MatchL33t
