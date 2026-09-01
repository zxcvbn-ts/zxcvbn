import { extend, sorted } from './utils/helper'
import { MatcherBaseClass, MatchExtended, UserInputsOptions } from './types'
import DateMatcher from './matcher/date/matching'
import DictionaryMatcher from './matcher/dictionary/matching'
import DictionaryL33tMatcher from './matcher/dictionary/variants/matching/l33t'
import DictionaryReverseMatcher from './matcher/dictionary/variants/matching/reverse'
import RegexMatcher from './matcher/regex/matching'
import RepeatMatcher from './matcher/repeat/matching'
import SequenceMatcher from './matcher/sequence/matching'
import SpatialMatcher from './matcher/spatial/matching'
import SeparatorMatcher from './matcher/separator/matching'
import WordSequenceMatcher from './matcher/wordSequence/matching'
import Options from './Options'

/*
 * -------------------------------------------------------------------------------
 *  Omnimatch combine matchers ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */

class Matching {
  matchers: Record<string, MatcherBaseClass> = {}

  constructor(private options: Options) {
    this.matchers = {
      date: new DateMatcher(this.options),
      dictionary: new DictionaryMatcher(this.options),
      dictionaryL33t: new DictionaryL33tMatcher(this.options),
      dictionaryReverse: new DictionaryReverseMatcher(this.options),
      regex: new RegexMatcher(this.options),
      repeat: new RepeatMatcher(this.options),
      sequence: new SequenceMatcher(this.options),
      spatial: new SpatialMatcher(this.options),
      separator: new SeparatorMatcher(this.options),
      wordSequence: new WordSequenceMatcher(this.options),
    }

    Object.entries(this.options.matchers).forEach(([key, Matcher]) => {
      this.matchers[key] = new Matcher.Matching(this.options)
    })
  }

  match(
    password: string,
    userInputsOptions?: UserInputsOptions,
  ): MatchExtended[] | Promise<MatchExtended[]> {
    const matches: MatchExtended[] = []
    const promises: Promise<MatchExtended[]>[] = []
    // wordSequence reads the shared `matches` array to find sequences of
    // dictionary matches, so it must run once every other matcher's results
    // (sync or async) have already landed in `matches` - it can't just be
    // one more entry in the same iteration order.
    const { wordSequence, ...otherMatchers } = this.matchers

    Object.values(otherMatchers).forEach((matcher) => {
      const result = matcher.match({
        password,
        omniMatch: this,
        userInputsOptions,
        matches,
      })

      if (result instanceof Promise) {
        promises.push(
          result.then((response) => {
            extend(matches, response)
            return response
          }),
        )
      } else {
        extend(matches, result)
      }
    })

    const runWordSequence = (): void | Promise<void> => {
      if (!wordSequence) {
        return undefined
      }
      const result = wordSequence.match({
        password,
        omniMatch: this,
        userInputsOptions,
        matches,
      })
      if (result instanceof Promise) {
        return result.then((response) => {
          extend(matches, response)
        })
      }
      extend(matches, result)
      return undefined
    }

    if (promises.length > 0) {
      return Promise.all(promises).then(() => {
        const wordSequenceResult = runWordSequence()
        if (wordSequenceResult instanceof Promise) {
          return wordSequenceResult.then(() => sorted(matches))
        }
        return sorted(matches)
      })
    }

    const wordSequenceResult = runWordSequence()
    if (wordSequenceResult instanceof Promise) {
      return wordSequenceResult.then(() => sorted(matches))
    }
    return sorted(matches)
  }
}

export default Matching
