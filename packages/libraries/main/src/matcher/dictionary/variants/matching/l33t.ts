import { L33tMatch } from '../../../../types'
import { DictionaryMatchOptions } from '../../types'
import MatchDictionary from '../../matching'

/*
 * -------------------------------------------------------------------------------
 *  Dictionary l33t matching -----------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchL33t extends MatchDictionary {
  private isAlreadyIncluded(matches: L33tMatch[], newMatch: L33tMatch) {
    return matches.some(
      (match) =>
        match.i === newMatch.i &&
        match.j === newMatch.j &&
        match.dictionaryName === newMatch.dictionaryName &&
        match.matchedWord === newMatch.matchedWord,
    )
  }

  public match(matchOptions: DictionaryMatchOptions) {
    const matches = super.match(matchOptions, true, false) as L33tMatch[]

    const deduped: L33tMatch[] = []
    matches.forEach((match) => {
      // drop matches that don't contain an actual substitution, and matches
      // that different substitution paths already produced for the same span
      if (
        match.token.toLowerCase() === match.matchedWord ||
        this.isAlreadyIncluded(deduped, match)
      ) {
        return
      }
      deduped.push(match)
    })

    // filter single-character l33t matches to reduce noise.
    // otherwise '1' matches 'i', '4' matches 'a', both very common English words
    // with low dictionary rank.
    return deduped.filter((match) => match.token.length > 1)
  }
}

export default MatchL33t
