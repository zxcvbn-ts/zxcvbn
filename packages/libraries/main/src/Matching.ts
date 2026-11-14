import { extend } from './utils/helper'
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
import WordIndex from './matcher/dictionary/WordIndex'

// An object built by hand without wordIndex only has the ranked dictionary,
// its words are put in the word index in the order of their rank. Without
// this the user inputs would be skipped.
const withWordIndex = (userInputsOptions: UserInputsOptions | undefined) => {
  if (!userInputsOptions || userInputsOptions.wordIndex) {
    return userInputsOptions
  }
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const words = Object.entries(userInputsOptions.rankedDictionary)
    .sort((first, second) => first[1] - second[1])
    .map(([word]) => word)
  return {
    ...userInputsOptions,
    wordIndex: new WordIndex([{ name: 'userInputs', words }]),
  }
}

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
    givenUserInputsOptions?: UserInputsOptions,
  ): MatchExtended[] | Promise<MatchExtended[]> {
    const userInputsOptions = withWordIndex(givenUserInputsOptions)
    const matches: MatchExtended[] = []
    const promises: Promise<MatchExtended[]>[] = []
    // wordSequence reads the shared `matches` array to find sequences of
    // dictionary matches, so it must run once every other matcher's results
    // (sync or async) have already landed in `matches` - it can't just be
    // one more entry in the same iteration order.
    const { wordSequence, ...otherMatchers } = this.matchers
    // Scoring writes the guesses onto the matches. A custom matcher may
    // return the same objects for every check, so its matches are copied and
    // never carry the guesses of an earlier check.
    const add = (name: string, result: MatchExtended[]) => {
      extend(
        matches,
        name in this.options.matchers
          ? result.map((match) => ({ ...match }))
          : result,
      )
    }

    Object.entries(otherMatchers).forEach(([name, matcher]) => {
      const result = matcher.match({
        password,
        omniMatch: this,
        userInputsOptions,
      })

      if (result instanceof Promise) {
        promises.push(
          result.then((response) => {
            add(name, response)
            return response
          }),
        )
      } else {
        add(name, result)
      }
    })

    // The matches are left unsorted: scoring groups them by j and sorts each
    // group by i, which gives the same order a sort by i and j would
    const runWordSequence = (): MatchExtended[] | Promise<MatchExtended[]> => {
      if (!wordSequence) {
        return matches
      }
      // a copy, so a custom wordSequence matcher can't drop or reorder the
      // matches of the other matchers
      const result = wordSequence.match({
        password,
        omniMatch: this,
        userInputsOptions,
        matches: matches.slice(),
      })
      if (result instanceof Promise) {
        return result.then((response) => {
          add('wordSequence', response)
          return matches
        })
      }
      add('wordSequence', result)
      return matches
    }

    if (promises.length > 0) {
      return Promise.all(promises).then(runWordSequence)
    }

    return runWordSequence()
  }
}

export default Matching
