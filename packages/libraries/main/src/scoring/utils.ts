const LOG10 = Math.log(10)

export default {
  // binomial coefficients
  // src: http://blog.plover.com/math/choose.html
  nCk(n: number, k: number) {
    let count = n
    if (k > count) {
      return 0
    }
    if (k === 0) {
      return 1
    }
    let coEff = 1
    for (let i = 1; i <= k; i += 1) {
      coEff *= count
      coEff /= i
      count -= 1
    }
    return coEff
  },
  factorial(n: number) {
    let result = 1
    for (let i = 2; i <= n; i += 1) result *= i
    return result
  },
  log10(n: number) {
    if (n === 0) return 0
    return Math.log(n) / LOG10 // IE doesn't support Math.log10 :(
  },
}
