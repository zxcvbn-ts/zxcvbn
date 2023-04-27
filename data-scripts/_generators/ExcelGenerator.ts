import axios from 'axios'
import XLSX from 'xlsx'
import SimpleListGenerator, {
  SimpleListGeneratorDefaultOptions,
  SimpleListGeneratorOptions,
} from './SimpleListGenerator'

export interface Options extends SimpleListGeneratorOptions {
  url: string
  /**
   * Row + column indicate a cell coordinate, and will include all cells
   * under (and including) this cell until an empty cell is found
   */
  row: number
  column: number
  sheetName?: string
}

const defaultOptions: Options = {
  ...SimpleListGeneratorDefaultOptions,
  url: '',
  row: 1,
  column: 1,
}

interface ConstructorOptions {
  options: Options
}

export class ExcelGenerator extends SimpleListGenerator<Options> {
  data: string[] = []

  constructor({ options }: ConstructorOptions) {
    super({ url: '', options })
    this.options = { ...defaultOptions }
    Object.assign(this.options, options)
  }

  async fetchValues() {
    // Download the file
    console.info('Fetching excel file')
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

    console.info('Parsing file')
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet =
      workbook.Sheets[this.options.sheetName ?? workbook.SheetNames[0]]

    if (!sheet['!ref']) {
      throw new Error('Missing ref in sheet')
    }
    const range = XLSX.utils.decode_range(sheet['!ref'])

    return {
      sheet,
      range,
    }
  }

  // eslint-disable-next-line complexity,max-statements
  readSheet(range: XLSX.Range, sheet: XLSX.WorkSheet) {
    console.info('Reading values')

    // Loop until we reach an emtpy cell or the end
    for (
      let row = range.s.r + this.options.row - 1;
      row <= range.e.r;
      row += 1
    ) {
      const cellAddress = { c: this.options.column + range.s.c - 1, r: row }
      /* if an A1-style address is needed, encode the address */
      const cellRef = XLSX.utils.encode_cell(cellAddress)
      const cell = sheet[cellRef] as XLSX.CellObject | undefined
      if (!cell) {
        break
      }
      const value = `${cell.w ?? cell.v ?? ''}`
      if (value.length === 0) {
        break
      }

      if (this.options.minOccurrences) {
        const cellAddressMin = { c: this.options.column + range.s.c, r: row }
        /* if an A1-style address is needed, encode the address */
        const cellRefMin = XLSX.utils.encode_cell(cellAddressMin)
        const cellMin = sheet[cellRefMin] as XLSX.CellObject | undefined
        if (!cellMin) {
          throw new Error(`Missing occurence at ${cellRefMin}`)
        }
        const occurrence = cellMin.v

        if (typeof occurrence !== 'number') {
          throw new Error(`Expecting number at ${cellRefMin}`)
        }

        if (occurrence < this.options.minOccurrences) {
          // Don't add this one
          // eslint-disable-next-line no-continue
          continue
        }
      }
      this.data.push(value)
    }
  }

  public async run(): Promise<string[] | null> {
    const values = await this.fetchValues()

    if (!values) {
      return null
    }

    this.readSheet(values.range, values.sheet)
    this.trimWhitespaces()
    this.convertToLowerCase()
    this.splitCompoundNames()
    this.normalizeDiacritics()
    this.removeDuplicates()
    this.filterMinLength()
    return this.data
  }
}
