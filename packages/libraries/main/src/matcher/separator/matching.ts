import { IS_SEPARATOR } from '../../data/const'
import { SeparatorMatch } from '../../types'

interface SeparatorMatchOptions {
  password: string
}

/*
 *-------------------------------------------------------------------------------
 * separators (/[ ._,-]/) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchSeparator {
  // eslint-disable-next-line max-statements
  match({ password }: SeparatorMatchOptions) {
    const result: SeparatorMatch[] = []
    const passwordLength = password.length
    if (passwordLength === 0) return []
    for (let i = 0; i < passwordLength; i += 1) {
      if (IS_SEPARATOR.test(password[i])) {
        result.push({
          pattern: 'separator',
          i,
          j: i,
          token: password.slice(i, i + 1),
        })
      }
    }
    return result
  }
}

export default MatchSeparator
