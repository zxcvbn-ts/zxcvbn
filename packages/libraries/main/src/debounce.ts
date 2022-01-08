export type Procedure = (...args: any[]) => void

/**
 * @link https://davidwalsh.name/javascript-debounce-function
 */
export default <F extends Procedure>(
  func: F,
  wait: number,
  isImmediate: boolean,
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return function debounce(this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this
    const later = () => {
      timeout = undefined
      if (!isImmediate) {
        func.apply(context, args)
      }
    }
    const shouldCallNow = isImmediate && !timeout
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
    if (shouldCallNow) {
      return func.apply(context, args)
    }
    return undefined
  }
}
