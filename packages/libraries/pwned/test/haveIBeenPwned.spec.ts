import haveIBeenPwned from '../src/haveIBeenPwned'
import { FetchApi } from '../src/types'

describe('haveIBeenPwned', () => {
  it('does not throw when called without a config object', async () => {
    await expect(haveIBeenPwned('P4$$w0rd')).resolves.toBeNull()
  })

  it('falls back to the default url when url is an empty string', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const universalFetch = jest.fn(async () => ({
      status: 200,
      text: () => '',
    })) as unknown as FetchApi
    await haveIBeenPwned('P4$$w0rd', { universalFetch, url: '' })
    expect(universalFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/api\.pwnedpasswords\.com\/range\//),
      expect.anything(),
    )
  })

  it('matches entries in LF-only responses, not just CRLF', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const universalFetch = jest.fn(async () => ({
      status: 200,
      text: () =>
        '008A205652858375D71117A63004CC75167:5\n3EA386688A0147AB736AABCEDE496610382:244',
    })) as unknown as FetchApi
    const result = await haveIBeenPwned('P4$$w0rd', { universalFetch })
    expect(result).toBe('3EA386688A0147AB736AABCEDE496610382:244')
  })

  it('treats a response without a numeric status as a network error, not a success', async () => {
    const networkErrorHandler = jest.fn(() => false as const)
    // eslint-disable-next-line @typescript-eslint/require-await
    const universalFetch = jest.fn(async () => ({
      text: () => 'whatever',
    })) as unknown as FetchApi
    const result = await haveIBeenPwned('P4$$w0rd', {
      universalFetch,
      networkErrorHandler,
    })
    expect(result).toBe(false)
    expect(networkErrorHandler).toHaveBeenCalled()
  })

  it('routes a crypto.subtle.digest rejection through networkErrorHandler instead of throwing', async () => {
    const digestSpy = jest
      .spyOn(crypto.subtle, 'digest')
      .mockRejectedValueOnce(new Error('digest unavailable'))
    const networkErrorHandler = jest.fn(() => false as const)
    const universalFetch = jest.fn() as unknown as FetchApi

    const result = await haveIBeenPwned('P4$$w0rd', {
      universalFetch,
      networkErrorHandler,
    })

    expect(result).toBe(false)
    expect(networkErrorHandler).toHaveBeenCalledWith(expect.any(Error))
    expect(universalFetch).not.toHaveBeenCalled()
    digestSpy.mockRestore()
  })

  it('routes a synchronous throw from universalFetch through networkErrorHandler', async () => {
    const networkErrorHandler = jest.fn(() => false as const)
    const universalFetch = jest.fn(() => {
      throw new Error('sync boom')
    }) as unknown as FetchApi

    const result = await haveIBeenPwned('P4$$w0rd', {
      universalFetch,
      networkErrorHandler,
    })

    expect(result).toBe(false)
    expect(networkErrorHandler).toHaveBeenCalledWith(expect.any(Error))
  })

  it('routes a response.text() rejection through networkErrorHandler', async () => {
    const networkErrorHandler = jest.fn(() => false as const)
    // eslint-disable-next-line @typescript-eslint/require-await
    const universalFetch = jest.fn(async () => ({
      status: 200,
      text: () => Promise.reject(new Error('stream error')),
    })) as unknown as FetchApi

    const result = await haveIBeenPwned('P4$$w0rd', {
      universalFetch,
      networkErrorHandler,
    })

    expect(result).toBe(false)
    expect(networkErrorHandler).toHaveBeenCalledWith(expect.any(Error))
  })

  it('normalizes a non-Error rejection before handing it to networkErrorHandler', async () => {
    const networkErrorHandler = jest.fn(() => false as const)
    // eslint-disable-next-line @typescript-eslint/require-await
    const universalFetch = jest.fn(async () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'boom'
    }) as unknown as FetchApi

    const result = await haveIBeenPwned('P4$$w0rd', {
      universalFetch,
      networkErrorHandler,
    })

    expect(result).toBe(false)
    expect(networkErrorHandler).toHaveBeenCalledWith(expect.any(Error))
  })
})
