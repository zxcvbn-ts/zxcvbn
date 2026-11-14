const LOG10 = Math.log(10)

// factorials[n] = n!, extended when a larger one is asked for
const factorials: number[] = [1]

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
    for (let i = factorials.length; i <= n; i += 1) {
      factorials[i] = factorials[i - 1] * i
    }
    return factorials[n]
  },
  log10(n: number) {
    if (n === 0) return 0
    return Math.log(n) / LOG10 // IE doesn't support Math.log10 :(
  },
}
