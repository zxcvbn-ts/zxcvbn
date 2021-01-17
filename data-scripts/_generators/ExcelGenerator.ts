import axios from 'axios'
import XLSX from 'xlsx'
import { promises as fs} from 'fs'

export type ExcelOptions = {
  url: string;
  /**
   * Row + column indicate a cell coordinate, and will include all cells 
   * under (and including) this cell until an empty cell is found
   */
  row: number;
  column: number;
}

export class ExcelGenerator {
  public options: ExcelOptions

  constructor(options: ExcelOptions) {
    this.options = options
  }

  public async run(output: string) {
    // Download the file
    console.info("Fetching excel file")
    const response = await axios.get(this.options.url, { responseType:'arraybuffer' })
    const data = new Uint8Array(response.data);

    console.info("Parsing file")
    const workbook = XLSX.read(data, {type:"array"})
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    if (!sheet['!ref']) {
      throw new Error("Missing ref in sheet")
    }
    const range = XLSX.utils.decode_range(sheet['!ref'])

    console.info("Reading values")
    const values: string[] = []

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
      values.push(value)
    }

    console.info("Saving to disk")

    const json = JSON.stringify(values)
    await fs.writeFile(output+".ts", `export default ${json}`)
  }
}
