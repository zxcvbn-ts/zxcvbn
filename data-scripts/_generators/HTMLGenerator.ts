import axios from 'axios'
import SimpleListGenerator, {
  SimpleListGeneratorDefaultOptions,
  SimpleListGeneratorOptions,
} from './SimpleListGenerator'
import { LooseObject } from '../_helpers/runtime'

interface Options extends SimpleListGeneratorOptions {
  requestConfig?: LooseObject
  extractorFunction: (entry: any) => string[]
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
  public data: any[] = []

  constructor({ url, options }: ConstructorOptions) {
    super({ url, options })
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  protected async getData() {
    const result = await axios.get(this.url, { ...this.options.requestConfig })
    return result.data
  }

  protected extractData(data: Buffer) {
    console.info('Extracting data')
    return this.options.extractorFunction(data)
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
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
