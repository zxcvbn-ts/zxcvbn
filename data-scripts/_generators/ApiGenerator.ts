import axios from 'axios'

type Options = {
  requestConfig?: object
  mapFunction: Function
  hasOccurrences: boolean
  minOccurrences: number
  trimWhitespaces: boolean
  toLowerCase: boolean
  minLength: number
}

const defaultOptions: Options = {
  mapFunction: (entry: any) => entry,
  trimWhitespaces: true,
  toLowerCase: true,
  minLength: 2,
  hasOccurrences: false,
  minOccurrences: 500,
}

export default class ApiGenerator {
  public data: any[] = []

  private readonly url: string

  private readonly options: Options

  constructor(url: string, options: any) {
    this.url = url
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  private async getData() {
    const result = await axios.get(this.url, { ...this.options.requestConfig })
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
          return entry.occurrences >= this.options.minOccurrences
        })
        .map((entry) => entry.name)
    }
  }

  private trimWhitespaces() {
    if (this.options.trimWhitespaces) {
      console.info('Filtering whitespaces')
      this.data = this.data.map((l) => {
        return l.trim()
      })
    }
  }

  private convertToLowerCase() {
    if (this.options.toLowerCase) {
      console.info('Converting to lowercase')
      this.data = this.data.map((l) => l.toLowerCase())
    }
  }

  public async run(): Promise<string[]> {
    console.info('Downloading')
    const data = await this.getData()
    this.data = data.map(this.options.mapFunction)
    this.filterOccurrences()
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.filterMinLength()
    return this.data
  }
}
