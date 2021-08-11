import axios from 'axios'
import { promises as fs } from 'fs'
import * as JSZip from 'jszip'

export type Options = {
  url: string
  row: number
  column: number
  trimWhitespaces?: boolean
  toLowerCase?: boolean
  removeDuplicates?: boolean
  /**
   * The occurrences count should be the cell after (right side) of the name.
   * Set to undefined if occurrences are missing in the excel file
   */
  minOccurrences?: number
  valueColumn: number
  occurrenceColumn: number
  separator: string
}

export class TxtGenerator {
  public options: Options = {
    url: '',
    row: 1,
    column: 0,
    occurrenceColumn: 1,
    valueColumn: 0,
    separator: '\t', // default tab separator
    trimWhitespaces: true,
    toLowerCase: true,
    removeDuplicates: true,
  }

  values: string[] = []

  constructor(options: Options) {
    Object.assign(this.options, options)
  }

  private trimWhitespaces() {
    if (this.options.trimWhitespaces) {
      console.info('Filtering whitespaces')
      this.values = this.values.map((l) => l.trim())
    }
  }

  private convertToLowerCase() {
    if (this.options.toLowerCase) {
      console.info('Converting to lowercase')
      this.values = this.values.map((l) => l.toLowerCase())
    }
  }

  private removeDuplicates() {
    if (this.options.removeDuplicates) {
      console.info('Filtering duplicates')
      this.values = this.values.filter((item, pos) => {
        return this.values.indexOf(item) === pos
      })
    }
  }

  // eslint-disable-next-line max-statements
  public async run(output: string) {
    // Download the file
    console.info('Fetching file')
    const response = await axios.get(this.options.url, {
      responseType: 'arraybuffer',
    })
    const data = new Uint8Array(response.data)

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
        } else if (!this.values.includes(line[this.options.valueColumn])) {
          this.values.push(line[this.options.valueColumn])
        }
      }
    }
    // remove empty values
    this.values = this.values.filter((l) => l.length > 0)
    // get from requested row number
    this.values = this.values.slice(this.options.row)

    this.trimWhitespaces()
    this.convertToLowerCase()
    this.removeDuplicates()

    console.info('Saving to disk')
    const json = JSON.stringify(this.values)
    await fs.writeFile(`${output}.json`, json)
  }
}
