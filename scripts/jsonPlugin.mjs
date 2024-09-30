import { compressSync, strToU8 } from 'fflate'
import { encodeBase85 } from '@alttiri/base85'

const isCompactDoubleQuotedString = (string) => {
  // eslint-disable-next-line no-control-regex
  return !string.match(/[\x00-\x1f\u2028\u2029\\"]/)
}

const compressWithPrefix = (parsed) => {
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

  const deltas = []
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

function compress(data) {
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
const json = () => {
  return {
    name: 'json',

    // eslint-disable-next-line no-shadow
    transform: function transform(json, id) {
      if (id.slice(-5) !== '.json') {
        return null
      }

      try {
        const parsed = JSON.parse(json)
        let code
        if (Array.isArray(parsed)) {
          const encoded = compress(parsed)

          code = `
import { decompress } from '@zxcvbn-ts/dictionary-compression'

export default () => {
  const encoded = "${encoded}"
  return decompress(encoded)
}`
        } else {
          const data = JSON.stringify(parsed)
          code = `export default ${data}`
        }

        return {
          code,
          map: { mappings: '' },
        }
      } catch (err) {
        const message = 'Could not parse JSON file'
        const position = parseInt(/[\d]/.exec(err.message)[0], 10)
        this.warn({
          message,
          id,
          position,
        })
        return null
      }
    },
  }
}

export default json
