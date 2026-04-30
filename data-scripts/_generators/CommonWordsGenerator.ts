import SimpleListGenerator, { ConstructorOptions } from './SimpleListGenerator'
import axios from 'axios'
import zlib from 'zlib'

// https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/de.freq.gz
export default class CommonWordsGenerator extends SimpleListGenerator {
  public data: string[] = []

  constructor(constructorOptions: ConstructorOptions) {
    super({
      ...constructorOptions,
      options: {
        ...constructorOptions.options,
        minOccurrences: 1000,
        hasOccurrences: true,
      },
    })
  }

  protected async getData() {
    const result = await axios.get(this.url, {
      responseType: 'arraybuffer',
    })

    const decompressed = zlib.gunzipSync(result.data)

    return decompressed.toString('utf-8')
  }

  protected clearLine() {
    console.info('Clear line')
    this.data = this.data.map((line) => {
      const entry = line.trimStart().split(' ')
      return entry[1] + ' ' + entry[0]
    })
  }
}
