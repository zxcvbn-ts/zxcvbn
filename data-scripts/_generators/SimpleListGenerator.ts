import axios from 'axios'
import iconv from 'iconv-lite'

export interface SimpleListGeneratorOptions {
  splitter: string
  commentPrefixes: string[]
  removeDuplicates: boolean
  trimWhitespaces: boolean
  toLowerCase: boolean
  encoding?: string
  occurrenceSeparator: string
  hasOccurrences: boolean
  minOccurrences: number
  minLength: number
  clearLine: Function
}

export const SimpleListGeneratorDefaultOptions: SimpleListGeneratorOptions = {
  splitter: '\n',
  commentPrefixes: ['#', '//'],
  removeDuplicates: true,
  trimWhitespaces: true,
  toLowerCase: true,
  occurrenceSeparator: ' ',
  hasOccurrences: false,
  minOccurrences: 500,
  minLength: 2,
  clearLine: (entry: string) => entry,
}

interface ConstructorOptions {
  options: SimpleListGeneratorOptions
  url: string
}
export default class SimpleListGenerator<
  Options extends SimpleListGeneratorOptions = SimpleListGeneratorOptions,
> {
  public data: string[] = []

  protected readonly url: string

  protected options: Options

  constructor({ url, options }: ConstructorOptions) {
    this.url = url
    // @ts-ignore
    this.options = { ...SimpleListGeneratorDefaultOptions }
    Object.assign(this.options, options)
  }

  protected async getData() {
    const result = await axios.get(this.url, {
      responseType: this.options.encoding ? 'arraybuffer' : undefined,
    })
    if (this.options.encoding) {
      console.info(this.options.encoding)
      return iconv.decode(result.data, this.options.encoding)
    }
    return result.data
  }

  protected filterMinLength() {
    if (this.options.minLength) {
      console.info('Filtering password that are to short')
      this.data = this.data.filter((item) => {
        return item.length >= this.options.minLength
      })
    }
  }

  protected filterOccurrences() {
    if (this.options.hasOccurrences) {
      console.info('Removing occurrence info')
      const cleanRegex = new RegExp(`${this.options.occurrenceSeparator}+`, 'g')
      this.data = this.data
        .filter((entry) => {
          const occurrence: number = parseInt(
            entry.replace(cleanRegex, ' ').split(' ')[1],
            10,
          )
          return occurrence >= this.options.minOccurrences
        })
        .map((entry) => {
          return entry.replace(cleanRegex, ' ').split(' ')[0]
        })
    }
  }

  protected clearLine() {
    if (this.options.clearLine) {
      console.info('Clear line')
      this.data = this.data.map((line) => this.options.clearLine(line))
    }
  }

  protected commentPrefixes() {
    if (Array.isArray(this.options.commentPrefixes)) {
      console.info('Filtering comments')
      this.options.commentPrefixes.forEach((prefix) => {
        this.data = this.data.filter((l) => !l.startsWith(prefix))
      })
    }
  }

  protected trimWhitespaces() {
    if (this.options.trimWhitespaces) {
      console.info('Filtering whitespaces')
      this.data = this.data.map((l) => l.trim())
    }
  }

  protected convertToLowerCase() {
    if (this.options.toLowerCase) {
      console.info('Converting to lowercase')
      this.data = this.data.map((l) => l.toLowerCase())
    }
  }

  protected removeDuplicates() {
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
    this.clearLine()
    this.filterOccurrences()
    this.commentPrefixes()
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
