import axios from 'axios'
import XLSX from 'xlsx'
import { promises as fs} from 'fs'

export type Options = {
  url: string;
  /**
   * Row + column indicate a cell coordinate, and will include all cells 
   * under (and including) this cell until an empty cell is found
   */
  row: number;
  column: number;
  trimWhitespaces?: boolean;
  toLowerCase?: boolean;
  removeDuplicates?: boolean;
  sheetName?: string;
  /**
   * The occurences count should be the cell after (right side) of the name.
   * Set to undefined if occurences are missing in the excel file
   */
  minOccurrences?: number
}

const defaultOptions: Options = {
  url: "",
  row: 1,
  column: 1,
  trimWhitespaces: true,
  toLowerCase: true,
  removeDuplicates: true
}

export class ExcelGenerator {
  public options: Options
  values: string[] = []

  constructor(options: Options) {
    this.options = Object.assign({}, defaultOptions)
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
        return this.values.indexOf(item) == pos
      })
    }
  }

  public async run(output: string) {
    // Download the file
    console.info("Fetching excel file")
    const response = await axios.get(this.options.url, { responseType:'arraybuffer' })
    const data = new Uint8Array(response.data);

    console.info("Parsing file")
    const workbook = XLSX.read(data, {type:"array" })
    const sheet = workbook.Sheets[this.options.sheetName ?? workbook.SheetNames[0]]

    if (!sheet['!ref']) {
      throw new Error("Missing ref in sheet")
    }
    const range = XLSX.utils.decode_range(sheet['!ref'])

    console.info("Reading values")

    // Loop until we reach an emtpy cell or the end
    for(var row = range.s.r + this.options.row - 1; row <= range.e.r; row++) {
      const cell_address = {c: this.options.column + range.s.c - 1, r: row };
      /* if an A1-style address is needed, encode the address */
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = sheet[cell_ref] as XLSX.CellObject | undefined
      if (!cell) {
        break
      }
      const value = (cell.w ?? cell.v ?? "")+""
      if (value.length === 0) {
        break
      }

      if (this.options.minOccurrences) {
        const cell_address = {c: this.options.column + range.s.c, r: row };
        /* if an A1-style address is needed, encode the address */
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        const cell = sheet[cell_ref] as XLSX.CellObject | undefined 
        if (!cell) {
          throw new Error("Missing occurence at "+cell_ref)
        }
        const occurence = cell.v

        if (typeof occurence !== "number") {
          throw new Error("Expecting number at "+cell_ref)
        }

        if (occurence < this.options.minOccurrences) {
          // Don't add this one
          continue
        }

      }
      this.values.push(value)
    }

    this.trimWhitespaces()
    this.convertToLowerCase()
    this.removeDuplicates()

    console.info("Saving to disk")

    const json = JSON.stringify(this.values)
    await fs.writeFile(output+".json", json)
  }
}
