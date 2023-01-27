import axios from 'axios'
import * as JSZip from 'jszip'
import SimpleListGenerator, {
  SimpleListGeneratorDefaultOptions,
  SimpleListGeneratorOptions,
} from './SimpleListGenerator'

export interface Options extends SimpleListGeneratorOptions {
  url: string
  row: number
  column: number
  valueColumn: number
  occurrenceColumn: number
  separator: string
}

const defaultOptions: Options = {
  ...SimpleListGeneratorDefaultOptions,
  url: '',
  row: 1,
  column: 0,
  occurrenceColumn: 1,
  valueColumn: 0,
  separator: '\t', // default tab separator
}

interface ConstructorOptions {
  options: Options
}
export class TxtGenerator extends SimpleListGenerator<Options> {
  data: string[] = []

  constructor({ options }: ConstructorOptions) {
    super({ url: '', options })
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  // eslint-disable-next-line max-statements,complexity
  public async run() {
    // Download the file
    console.info('Fetching file')
    let data
    try {
      const response = await axios.get(this.options.url, {
        responseType: 'arraybuffer',
      })
      data = new Uint8Array(response.data)
    } catch (error: any) {
      console.info('!!!!!! ERROR: getData had an error !!!!!!', error.message)
      return null
    }

    let content = []

    content = await JSZip.loadAsync(data)
      .then((zip) => {
        const keys = Object.keys(zip.files)
        const zipObject = zip.file(keys[0]) as JSZip.JSZipObject
        return zipObject.async('string')
      })
      .then((text) => {
        const allTextLines = text.split(/\r/)
        return allTextLines
      })
    for (let i = 0; i < content.length; i += 1) {
      if (i > this.options.row) {
        // split content
        const regexString = this.options.separator
        const regexp = new RegExp(regexString, 'g')
        const line = content[i].split(regexp)

        // If no occurrence found in file, use 0 by default
        let occurrence = 0
        if (line[this.options.occurrenceColumn]) {
          occurrence = parseInt(line[this.options.occurrenceColumn], 10)
        }
        if (Number.isNaN(+occurrence)) {
          throw new Error(
            `Expecting number at column ${this.options.occurrenceColumn}`,
          )
        }
        if (
          this.options.minOccurrences &&
          occurrence < this.options.minOccurrences
        ) {
          // Don't add this one
          // eslint-disable-next-line no-continue
          continue
        } else if (!this.data.includes(line[this.options.valueColumn])) {
          this.data.push(line[this.options.valueColumn])
        }
      }
    }
    // get from requested row number
    this.data = this.data.slice(this.options.row)

    this.trimWhitespaces()
    this.convertToLowerCase()
    this.removeDuplicates()
    this.filterMinLength()

    return this.data
  }
}
