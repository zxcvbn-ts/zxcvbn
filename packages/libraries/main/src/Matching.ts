import { extend, sorted } from './utils/helper.ts'
import { MatcherBaseClass, MatchExtended, UserInputsOptions } from './types.ts'
import DateMatcher from './matcher/date/matching.ts'
import DictionaryMatcher from './matcher/dictionary/matching.ts'
import DictionaryL33tMatcher from './matcher/dictionary/variants/matching/l33t.ts'
import DictionaryReverseMatcher from './matcher/dictionary/variants/matching/reverse.ts'
import RegexMatcher from './matcher/regex/matching.ts'
import RepeatMatcher from './matcher/repeat/matching.ts'
import SequenceMatcher from './matcher/sequence/matching.ts'
import SpatialMatcher from './matcher/spatial/matching.ts'
import SeparatorMatcher from './matcher/separator/matching.ts'
import WordSequenceMatcher from './matcher/wordSequence/matching.ts'
import Options from './Options.ts'

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

  private processResult(
    matches: MatchExtended[],
    promises: Promise<MatchExtended[]>[],
    result: MatchExtended[] | Promise<MatchExtended[]>,
  ) {
    if (result instanceof Promise) {
      const wrappedPromise = result.then((response) => {
        extend(matches, response)
        return response
      })
      promises.push(wrappedPromise)
    } else {
      extend(matches, result)
    }
  }

  private handlePromises(
    matches: MatchExtended[],
    promises: Promise<MatchExtended[]>[],
  ) {
    if (promises.length > 0) {
      return new Promise<MatchExtended[]>((resolve, reject) => {
        Promise.all(promises)
          .then(() => {
            resolve(sorted(matches))
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(error)
          })
      })
    }
    return sorted(matches)
  }

  match(
    password: string,
    userInputsOptions?: UserInputsOptions,
  ): MatchExtended[] | Promise<MatchExtended[]> {
    const matches: MatchExtended[] = []

    const promises: Promise<MatchExtended[]>[] = []
    Object.values(this.matchers).forEach((matcher) => {
      const result = matcher.match({
        password,
        omniMatch: this,
        userInputsOptions,
      })

      // extends matches and promises by references
      this.processResult(matches, promises, result)
    })

    return this.handlePromises(matches, promises)
  }
}

export default Matching
