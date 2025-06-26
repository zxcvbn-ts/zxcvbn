export default (pattern: string, prefixes: string[], suffixes: string[]) => {
  const result: [string, number, number][] = []
  const slicedPrefixes = prefixes.slice()
  const slicedSuffixes = suffixes.slice()
  const combined = [slicedPrefixes, slicedSuffixes]
  combined.forEach((lst) => {
    if (!lst.includes('')) {
      lst.unshift('')
    }
  })
  slicedPrefixes.forEach((prefix) => {
    slicedSuffixes.forEach((suffix) => {
      const [i, j] = [prefix.length, prefix.length + pattern.length - 1]
      result.push([prefix + pattern + suffix, i, j])
    })
  })
  return result
}
