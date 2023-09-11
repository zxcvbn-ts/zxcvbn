import axios from 'axios'
import SimpleListGenerator, {
  SimpleListGeneratorDefaultOptions,
  SimpleListGeneratorOptions,
} from './SimpleListGenerator'
import { LooseObject } from '../_helpers/runtime'

interface Options extends SimpleListGeneratorOptions {
  requestConfig?: LooseObject
  extractorFunction: (entry: any) => string[]
  pagination?: number
}

const defaultOptions: Options = {
  ...SimpleListGeneratorDefaultOptions,
  extractorFunction: (entry: any) => [entry.toString()],
}

interface ConstructorOptions {
  url: string
  options: Options
}

export default class HTMLGenerator extends SimpleListGenerator<Options> {
  public data: string[] = []

  constructor({ url, options }: ConstructorOptions) {
    super({ url, options })
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  protected async getData() {
    if (this.options.pagination) {
      const resultData: Buffer[] = []
      for (let i = 0; i < this.options.pagination; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await axios.get<Buffer>(
          this.url.replace('__PAGINATION__', String(i)),
          {
            ...this.options.requestConfig,
          },
        )
        resultData.push(result.data)
      }
      return resultData
    }
    const result = await axios.get<Buffer>(this.url, {
      ...this.options.requestConfig,
    })
    return [result.data]
  }

  protected extractData(data: Buffer[]) {
    console.info('Extracting data')
    const extractedData: string[][] = []
    data.forEach((entry) => {
      const result = this.options.extractorFunction(entry)
      extractedData.push(result)
    })

    return extractedData.flat()
  }

  public async run(): Promise<string[] | null> {
    console.info('Downloading')
    try {
      const data = await this.getData()
      this.data = this.extractData(data)
    } catch (error: any) {
      console.info('!!!!!! ERROR: getData had an error !!!!!!', error.message)
      return null
    }
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.splitCompoundNames()
    this.normalizeDiacritics()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
