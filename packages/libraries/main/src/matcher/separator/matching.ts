import { SeparatorMatch } from '../../types'

interface SeparatorMatchOptions {
  password: string
}

/*
 *-------------------------------------------------------------------------------
 * separators (any semi-repeated special character) -----------------------------
 *-------------------------------------------------------------------------------
 */
class MatchSeparator {
  static getMostUsedSpecialChar(password: string): string | undefined {
    const mostUsedSpecials = [
      ...password
        .split('')
        .filter((c) => /[^\w]/.test(c))
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
    if (!mostUsedSpecials.length) return undefined
    const match = mostUsedSpecials[0]
    // If the special character is only used once, don't treat it like a separator
    if (match[1] < 2) return undefined
    return match[0]
  }

  static getSeparatorRegex(separator: string): RegExp {
    return new RegExp(`(?<!${separator})(${separator})(?!${separator})`, 'g')
  }

  // eslint-disable-next-line max-statements
  match({ password }: SeparatorMatchOptions) {
    const result: SeparatorMatch[] = []

    if (password.length === 0) return result

    const mostUsedSpecial = MatchSeparator.getMostUsedSpecialChar(password)
    if (mostUsedSpecial === undefined) return result

    const isSeparator = MatchSeparator.getSeparatorRegex(mostUsedSpecial)

    // eslint-disable-next-line no-restricted-syntax
    for (const match of password.matchAll(isSeparator)) {
      // eslint-disable-next-line no-continue
      if (match.index === undefined) continue
      const i = match.index
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
