import debounce from '../../src/utils/debounce'

describe('debounce', () => {
  it('should call handler immediately', async () => {
    const testFn = jest.fn()
    const temp = debounce(testFn, 100, true)
    temp()
    expect(testFn).toHaveBeenCalledTimes(1)
  })

  it('should debounce after timeout', async () => {
    jest.useFakeTimers()
    const testFn = jest.fn()
    const temp = debounce(testFn, 100, false)
    temp()

    expect(testFn).not.toHaveBeenCalled()
    temp()
    jest.runAllTimers()
    expect(testFn).toHaveBeenCalledTimes(1)
  })
})
