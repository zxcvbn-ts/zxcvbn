// eslint-disable-next-line import/extensions
import compress from '@zxcvbn-ts/dictionary-compression/compress'

const json = () => {
  return {
    name: 'json',

    transform: function transform(json, id) {
      if (id.slice(-5) !== '.json') {
        return null
      }

      try {
        const parsed = JSON.parse(json)
        let code
        if (Array.isArray(parsed)) {
          let encoded = compress(parsed)
          if (Array.isArray(encoded)) {
            encoded = JSON.stringify(encoded)
          }
          code = `
import decompress from '@zxcvbn-ts/dictionary-compression/decompress'

export default decompress("${encoded}")`
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
