import { HaveIBeenPwnedConfig } from './types'

const isNodeJs =
  typeof process !== 'undefined' &&
  process.release &&
  process.release.name === 'node'

const textEncode = (text: string) => {
  if (isNodeJs) {
    const utf8 = decodeURI(encodeURIComponent(text))
    const result = new Uint8Array(utf8.length)
    for (let i = 0; i < utf8.length; i += 1) {
      result[i] = utf8.charCodeAt(i)
    }
    return result
  }
  try {
    // eslint-disable-next-line compat/compat
    return new TextEncoder().encode(text)
  } catch (error) {
    throw new Error(`No encoder found, ${error}`)
  }
}

const digestMessage = async (message: string) => {
  const data = textEncode(message)
  let hash = ''
  if (isNodeJs) {
    // eslint-disable-next-line global-require
    const crypto = require('crypto')
    hash = crypto.createHash('sha1').update(message).digest('hex').toUpperCase()
  } else if (crypto) {
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    hash = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }
  return hash
}

const pwnedUrl = 'https://api.pwnedpasswords.com/range/'

const defaultNetworkErrorHandler = (_error: Error | Response): false => {
  return false
}

export default async (
  password: string,
  {
    universalFetch,
    url = pwnedUrl,
    networkErrorHandler = defaultNetworkErrorHandler,
  }: HaveIBeenPwnedConfig,
) => {
  // we don't need to check passwords with a length smaller 2 which can happen for repeat matcher or if we don't have a fetch function
  if (!universalFetch || password.length < 2) {
    return null
  }
  const passwordHash = (await digestMessage(password)).toUpperCase()
  const range = passwordHash.slice(0, 5)
  const suffix = passwordHash.slice(5)
  const response = await universalFetch(`${url}${range}`, {
    method: 'GET',
    headers: {
      'Add-Padding': 'true',
    },
  }).catch((error) => {
    return networkErrorHandler(error)
  })

  if (typeof response === 'boolean') {
    return false
  }
  if (response.status >= 400) {
    return networkErrorHandler(response)
  }

  const result = await response.text()
  const resultArray = result.split('\r\n')

  return resultArray.find((entry: string) => {
    const passwordHasPart = entry.split(':')[0]
    return passwordHasPart === suffix
  })
}
