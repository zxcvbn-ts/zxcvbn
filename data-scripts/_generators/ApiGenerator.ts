import axios from 'axios'
import SimpleListGenerator, {
  SimpleListGeneratorDefaultOptions,
  SimpleListGeneratorOptions,
} from './SimpleListGenerator'
import { LooseObject } from '../_helpers/runtime'

interface Options extends SimpleListGeneratorOptions {
  requestConfig?: LooseObject
  mapFunction: (entry: any) => any
}

const defaultOptions: Options = {
  ...SimpleListGeneratorDefaultOptions,
  mapFunction: (entry: any) => entry,
}

interface ConstructorOptions {
  url: string
  options: Options
}

export default class ApiGenerator extends SimpleListGenerator<Options> {
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

  protected filterOccurrences() {
    if (this.options.hasOccurrences) {
      console.info('Removing occurrence info')
      this.data = this.data
        .filter((entry) => {
          return entry.occurrences >= this.options.minOccurrences
        })
        .map((entry) => entry.name)
    }
  }

  // eslint-disable-next-line max-statements
  public async run(): Promise<string[] | null> {
    console.info('Downloading')
    let data = []
    try {
      data = await this.getData()
    } catch (error: any) {
      console.info('!!!!!! ERROR: getData had an error !!!!!!', error.message)
      return null
    }
    if (this.options.mapFunction) {
      this.data = data.map(this.options.mapFunction)
    }
    this.filterOccurrences()
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.splitCompoundNames()
    this.normalizeDiacritics()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
