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
        const data = Array.isArray(parsed)
          ? `"${parsed.join(',')}".split(',')`
          : JSON.stringify(parsed)

        const code = `export default ${data}`

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
