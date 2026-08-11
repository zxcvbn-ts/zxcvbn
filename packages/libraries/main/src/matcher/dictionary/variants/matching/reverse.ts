import MatchDictionary from '../../matching'
import { DictionaryMatch } from '../../../../types'
import { DictionaryMatchOptions } from '../../types'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary reverse matching --------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchReverse extends MatchDictionary {
  public match(matchOptions: DictionaryMatchOptions) {
    return super.match(matchOptions, false, true)
  }
}

export default MatchReverse
