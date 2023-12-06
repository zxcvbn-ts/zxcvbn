import { REGEXEN } from '../../data/const'
import { sorted } from '../../utils/helper'
import { RegexMatch } from '../../types'
import { Options } from '../../Options'

interface RegexMatchOptions {
  password: string
  regexes?: typeof REGEXEN
}

type RegexesKeys = keyof typeof REGEXEN
/*
 * -------------------------------------------------------------------------------
 *  regex matching ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchRegex {
  constructor(private options: Options) {}

  match({ password, regexes = REGEXEN }: RegexMatchOptions) {
    const matches: RegexMatch[] = []
    Object.keys(regexes).forEach((name) => {
      const regex = regexes[name as RegexesKeys]
      regex.lastIndex = 0 // keeps regexMatch stateless

      let regexMatch: RegExpExecArray | null
      // eslint-disable-next-line no-cond-assign
      while ((regexMatch = regex.exec(password))) {
        if (regexMatch) {
          const token = regexMatch[0]
          matches.push({
            pattern: 'regex',
            token,
            i: regexMatch.index,
            j: regexMatch.index + regexMatch[0].length - 1,
            regexName: name as RegexesKeys,
            regexMatch,
          })
        }
      }
    })
    return sorted(matches)
  }
}

export default MatchRegex
