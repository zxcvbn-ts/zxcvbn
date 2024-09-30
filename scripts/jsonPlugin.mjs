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
        let code
        if (Array.isArray(parsed)) {
          const data = parsed.join(',')
          const dataBuf = strToU8(data)
          const compressed = compressSync(dataBuf, { level: 9, mem: 12 })
          const encoded = encodeBase85(compressed)

          code = `
          import { decompressSync, strFromU8 } from 'fflate'
          import { decodeBase85 } from '@alttiri/base85'

          const encoded = "${encoded}"

          const decoded = decodeBase85(encoded)
          const decompressedBuf = decompressSync(decoded)
          const decompressed = strFromU8(decompressedBuf);
          const decompressedArray = decompressed.split(',')
          export default decompressedArray`
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
