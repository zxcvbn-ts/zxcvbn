import axios from 'axios'
import iconv from 'iconv-lite'

type Options = {
  splitter: string
  commentPrefixes: string[]
  removeDuplicates: boolean
  trimWhitespaces: boolean
  toLowerCase: boolean
  encoding?: string
  hasOccurrences: boolean
  minOccurrences: number
  minLength: number
}

const defaultOptions: Options = {
  splitter: '\n',
  commentPrefixes: ['#', '//'],
  removeDuplicates: true,
  trimWhitespaces: true,
  toLowerCase: true,
  hasOccurrences: false,
  minOccurrences: 500,
  minLength: 2,
}

export default class SimpleListGenerator {
  public data: any[] = []

  private readonly url: string

  private readonly options: Options

  constructor(url: string, options: any) {
    this.url = url
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  private async getData() {
    const result = await axios.get(this.url, {
      responseType: this.options.encoding ? 'arraybuffer' : undefined,
    })
    if (this.options.encoding) {
      console.info(this.options.encoding)
      return iconv.decode(result.data, this.options.encoding)
    }
    return result.data
  }

  private filterMinLength() {
    if (this.options.minLength) {
      console.info('Filtering password that are to short')
      this.data = this.data.filter((item) => {
        return item.length >= this.options.minLength
      })
    }
  }

  private filterOccurrences() {
    if (this.options.hasOccurrences) {
      console.info('Removing occurrence info')
      this.data = this.data
        .filter((entry) => {
          return (
            entry.replace(/  +/g, ' ').split(' ')[1] >=
            this.options.minOccurrences
          )
        })
        .map((entry) => {
          return entry.replace(/  +/g, ' ').split(' ')[0]
        })
    }
  }

  private commentPrefixes() {
    if (Array.isArray(this.options.commentPrefixes)) {
      console.info('Filtering comments')
      this.options.commentPrefixes.forEach((prefix) => {
        this.data = this.data.filter((l) => !l.startsWith(prefix))
      })
    }
  }

  private trimWhitespaces() {
    if (this.options.trimWhitespaces) {
      console.info('Filtering whitespaces')
      this.data = this.data.map((l) => l.trim())
    }
  }

  private convertToLowerCase() {
    if (this.options.toLowerCase) {
      console.info('Converting to lowercase')
      this.data = this.data.map((l) => l.toLowerCase())
    }
  }

  private removeDuplicates() {
    if (this.options.removeDuplicates) {
      console.info('Filtering duplicates')
      this.data = this.data.filter((item, pos) => {
        return this.data.indexOf(item) === pos
      })
    }
  }

  public async run(): Promise<string[]> {
    console.info('Downloading')
    const data = await this.getData()
    this.data = data.split(this.options.splitter)
    this.filterOccurrences()
    this.commentPrefixes()
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
