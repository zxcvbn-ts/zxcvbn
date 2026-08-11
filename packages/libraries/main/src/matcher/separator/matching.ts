import { ESCAPE_REGEX, SEPERATOR_CHARS } from '../../data/const'
import { MatcherBaseClass, MatchOptions, SeparatorMatch } from '../../types'

type SeparatorMatchOptions = Pick<MatchOptions, 'password'>

const separatorRegex = new RegExp(`[${SEPERATOR_CHARS.join('')}]`)

/*
 *-------------------------------------------------------------------------------
 * separators (any semi-repeated special character) -----------------------------
 *-------------------------------------------------------------------------------
 */
class MatchSeparator extends MatcherBaseClass {
  static getMostUsedSeparatorChar(password: string): string | undefined {
    const counts = new Map<string, number>()
    for (const char of password) {
      if (separatorRegex.test(char)) {
        counts.set(char, (counts.get(char) || 0) + 1)
      }
    }

    let maxChar: string | undefined
    let maxCount = 0

    for (const [char, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count
        maxChar = char
      }
    }

    if (maxCount < 2) {
      return undefined
    }

    return maxChar
  }

  static getSeparatorRegex(separator: string): RegExp {
    const escaped = separator.replace(ESCAPE_REGEX, '\\$&')
    return new RegExp(`([^${escaped}\n])(${escaped})(?!${escaped})`, 'g')
    // negative lookbehind can be added again in a few years when it is more supported by the browsers (currently 2023)
    // https://github.com/zxcvbn-ts/zxcvbn/issues/202
    // return new RegExp(`(?<!${separator})(${separator})(?!${separator})`, 'g')
  }

  match({ password }: SeparatorMatchOptions) {
    const result: SeparatorMatch[] = []

    if (password.length === 0) return result

    const mostUsedSpecial = MatchSeparator.getMostUsedSeparatorChar(password)
    if (mostUsedSpecial === undefined) return result

    const isSeparator = MatchSeparator.getSeparatorRegex(mostUsedSpecial)

    for (const match of password.matchAll(isSeparator)) {
      if (match.index === undefined) continue

      // add one to the index because we changed the regex from negative lookbehind to something simple.
      // this simple approach uses the first character before the separater too but we only need the index of the separater
      // https://github.com/zxcvbn-ts/zxcvbn/issues/202
      const i = match.index + 1
      result.push({
        pattern: 'separator',
        token: mostUsedSpecial,
        i,
        j: i,
      })
    }
    return result
  }
}

export default MatchSeparator
