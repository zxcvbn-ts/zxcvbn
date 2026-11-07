import { FetchApi, HaveIBeenPwnedConfig } from './types'

const textEncode = (text: string) => {
  try {
    return new TextEncoder().encode(text)
  } catch (error: any) {
    throw new Error(`No encoder found, ${error}`)
  }
}

const digestMessage = async (message: string) => {
  const data = textEncode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

const pwnedUrl = 'https://api.pwnedpasswords.com/range/'

const defaultNetworkErrorHandler = (_error: Error | Response): false => {
  return false
}

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error(String(error))

const requestRange = async (
  password: string,
  universalFetch: FetchApi,
  url?: string,
) => {
  const passwordHash = await digestMessage(password)
  const range = passwordHash.slice(0, 5)
  const response = await universalFetch(`${url || pwnedUrl}${range}`, {
    method: 'GET',
    headers: {
      'Add-Padding': 'true',
    },
  })
  return { suffix: passwordHash.slice(5), response }
}

const hasSuccessStatus = (response: Response) =>
  typeof response.status === 'number' && response.status < 400

// the api answers with CRLF but proxies or custom endpoints may only use LF
const findEntry = (result: string, suffix: string) =>
  result.split(/\r?\n/).find((entry: string) => {
    const passwordHasPart = entry.split(':')[0]
    return passwordHasPart === suffix
  })

export default async (
  password: string,
  {
    universalFetch,
    url,
    networkErrorHandler = defaultNetworkErrorHandler,
  }: Partial<HaveIBeenPwnedConfig> = {},
) => {
  // we don't need to check passwords with a length smaller 2 which can happen for repeat matcher or if we don't have a fetch function
  if (!universalFetch || password.length < 2) {
    return null
  }
  // networkErrorHandler is never called inside a try block so a handler that throws on purpose isn't caught and called twice
  let request: Awaited<ReturnType<typeof requestRange>>
  try {
    request = await requestRange(password, universalFetch, url)
  } catch (error) {
    return networkErrorHandler(toError(error))
  }

  const { suffix, response } = request
  if (!hasSuccessStatus(response)) {
    return networkErrorHandler(response)
  }

  let result: string
  try {
    result = await response.text()
  } catch (error) {
    return networkErrorHandler(toError(error))
  }
  return findEntry(result, suffix)
}
