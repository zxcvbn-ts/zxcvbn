import { compressSync, strToU8 } from 'fflate'
import { encodeBase85 } from '@alttiri/base85'

const isCompactDoubleQuotedString = (string: string) => {
  // eslint-disable-next-line no-control-regex
  return !string.match(/[\x00-\x1f\u2028\u2029\\"]/)
}

const compressWithPrefix = (parsed: string[]) => {
  if (!Array.isArray(parsed)) {
    return parsed
  }
  if (
    !parsed.every(
      (entry) =>
        typeof entry === 'string' && isCompactDoubleQuotedString(entry),
    )
  ) {
    // Should be rare enough, so don't bother escape them.
    return parsed
  }

  const deltas: string[] = []
  let last = ''
  parsed.forEach((entry) => {
    let prefixLen = 0
    const maxPrefixLen = Math.min(entry.length, last.length, 25)
    while (
      prefixLen < maxPrefixLen &&
      entry.charAt(prefixLen) === last.charAt(prefixLen)
    ) {
      prefixLen += 1
    }
    deltas.push(String.fromCharCode(65 + prefixLen) + entry.slice(prefixLen))
    last = entry
  })

  return deltas
}

export default function compress(data: string[]) {
  const compressedWithPrefix = compressWithPrefix(data)
  const compressedWithGzip = compressSync(
    strToU8(compressedWithPrefix.join('')),
    {
      level: 9,
      mem: 12,
    },
  )

  return encodeBase85(compressedWithGzip)
}
