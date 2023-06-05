import { SEPERATOR_CHARS } from '../../data/const'
import { SeparatorMatch } from '../../types'

interface SeparatorMatchOptions {
  password: string
}

const separatorRegex = new RegExp(`[${SEPERATOR_CHARS.join('')}]`)

/*
 *-------------------------------------------------------------------------------
 * separators (any semi-repeated special character) -----------------------------
 *-------------------------------------------------------------------------------
 */
class MatchSeparator {
  static getMostUsedSeparatorChar(password: string): string | undefined {
    const mostUsedSeperators = [
      ...password
        .split('')
        .filter((c) => separatorRegex.test(c))
        .reduce((memo, c) => {
          const m = memo.get(c)
          if (m) {
            memo.set(c, m + 1)
          } else {
            memo.set(c, 1)
          }
          return memo
        }, new Map())
        .entries(),
    ].sort(([_a, a], [_b, b]) => b - a)
    if (!mostUsedSeperators.length) return undefined
    const match = mostUsedSeperators[0]
    // If the special character is only used once, don't treat it like a separator
    if (match[1] < 2) return undefined
    return match[0]
  }

  static getSeparatorRegex(separator: string): RegExp {
    return new RegExp(`([^${separator}\n])(${separator})(?!${separator})`, 'g')
    // negative lookbehind can be added again in a few years when it is more supported by the browsers (currently 2023)
    // https://github.com/zxcvbn-ts/zxcvbn/issues/202
    // return new RegExp(`(?<!${separator})(${separator})(?!${separator})`, 'g')
  }

  // eslint-disable-next-line max-statements
  match({ password }: SeparatorMatchOptions) {
    const result: SeparatorMatch[] = []

    if (password.length === 0) return result

    const mostUsedSpecial = MatchSeparator.getMostUsedSeparatorChar(password)
    if (mostUsedSpecial === undefined) return result

    const isSeparator = MatchSeparator.getSeparatorRegex(mostUsedSpecial)

    // eslint-disable-next-line no-restricted-syntax
    for (const match of password.matchAll(isSeparator)) {
      // eslint-disable-next-line no-continue
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
