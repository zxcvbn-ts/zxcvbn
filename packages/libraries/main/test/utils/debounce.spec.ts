import debounce from '../../src/utils/debounce'

describe('debounce', () => {
  it('should call handler immediately', () => {
    const testFn = vi.fn()
    const temp = debounce(testFn, 100, true)
    temp()
    expect(testFn).toHaveBeenCalledTimes(1)
  })

  it('should not call handler again once the timeout elapses in immediate mode', () => {
    vi.useFakeTimers()
    const testFn = vi.fn()
    const temp = debounce(testFn, 100, true)
    temp()
    expect(testFn).toHaveBeenCalledTimes(1)

    vi.runAllTimers()
    expect(testFn).toHaveBeenCalledTimes(1)
  })

  it('should debounce after timeout', () => {
    vi.useFakeTimers()
    const testFn = vi.fn()
    const temp = debounce(testFn, 100, false)
    temp()

    expect(testFn).not.toHaveBeenCalled()
    temp()
    vi.runAllTimers()
    expect(testFn).toHaveBeenCalledTimes(1)
  })
})
