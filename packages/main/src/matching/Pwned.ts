import { sorted } from '~/helper'
import { ExtendedMatch } from '../types'
import Options from '~/Options'

const isNodeJs =
  typeof process !== 'undefined' && process.release.name === 'node'
/*
 * -------------------------------------------------------------------------------
 *  Have i been pwned matching ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class MatchPwned {
  async match(password: string) {
    const matches: ExtendedMatch[] = []
    const pwned = await this.checkPassword(password)
    if (pwned) {
      // @ts-ignore
      matches.push({
        pattern: 'pwned',
        pwnedAmount: parseInt(pwned.split(':')[1], 10),
      })
    }
    return sorted(matches)
  }

  async checkPassword(password: string) {
    const passwordHash = (await this.digestMessage(password)).toUpperCase()
    const range = passwordHash.slice(0, 5)
    const suffix = passwordHash.slice(5)
    const response = await Options.fetch(
      `https://api.pwnedpasswords.com/range/${range}`,
      {
        method: 'GET',
      },
    )
    const result = await response.text()
    const resultArray = result.split('\r\n')

    return resultArray.find((entry) => {
      const passwordHasPart = entry.split(':')[0]
      return passwordHasPart === suffix
    })
  }

  async digestMessage(message) {
    const data = this.textEncode(message)
    let hash = ''
    if (isNodeJs) {
      // eslint-disable-next-line global-require
      const crypto = require('crypto')
      hash = crypto.createHash('sha1').update(message).digest('hex').toUpperCase()
    } else {
      const hashBuffer = await crypto.subtle.digest('SHA-1', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      hash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    }
    return hash
  }

  textEncode(str) {
    if (!isNodeJs && window.TextEncoder) {
      return new TextEncoder().encode(str)
    }
    const utf8 = unescape(encodeURIComponent(str))
    const result = new Uint8Array(utf8.length)
    for (let i = 0; i < utf8.length; i += 1) {
      result[i] = utf8.charCodeAt(i)
    }
    return result
  }
}

export default MatchPwned
