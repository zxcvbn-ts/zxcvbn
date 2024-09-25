import { compressSync, strToU8 } from 'fflate'
import { encodeBase85 } from '@alttiri/base85'

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
        var code
        if (Array.isArray(parsed)) {
          const data = parsed.join(',')
          const data_buf = strToU8(data)
          const compressed = compressSync(data_buf, { level: 9, mem: 12 })
          const encoded = encodeBase85(compressed)

          code = `
          import { decompressSync, strFromU8 } from 'fflate'
          import { decodeBase85 } from '@alttiri/base85'

          const encoded = "${encoded}"

          const decoded = decodeBase85(encoded)
          const decompressed_buf = decompressSync(decoded)
          const decompressed = strFromU8(decompressed_buf);
          const decompressed_array = decompressed.split(',')
          export default decompressed_array`
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
