import bruteforceMatcher from './bruteforce'
import dateMatcher from './date'
import dictionaryMatcher from './dictionary'
import regexMatcher from './regex'
import repeatMatcher from './repeat'
import sequenceMatcher from './sequence'
import spatialMatcher from './spatial'
import { defaultFeedbackFunction } from '../Feedback'
import { defaultScoringFunction } from '../scoring/estimate'

export interface Matcher {
  feedback?: typeof defaultFeedbackFunction
  scoring: typeof defaultScoringFunction
  Matching?: any
}

export interface Matchers {
  [key: string]: Matcher
}

class MatcherClass {
  readonly matchers: Matchers = {
    bruteforce: bruteforceMatcher,
    date: dateMatcher,
    dictionary: dictionaryMatcher,
    regex: regexMatcher,
    repeat: repeatMatcher,
    sequence: sequenceMatcher,
    spatial: spatialMatcher,
  }

  public addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      throw new Error('Matcher already exists')
    }
    this.matchers[name] = matcher
  }
}

export default new MatcherClass()
