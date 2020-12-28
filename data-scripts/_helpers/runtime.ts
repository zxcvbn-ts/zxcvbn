import * as fs from 'fs'
import * as path from 'path'

export interface CustomListConfig {
  language: string
  filename: string
  generator: any
  options?: any
}

export interface ListConfig extends CustomListConfig {
  url: string
}

export default class ListHandler {
  lists: ListConfig[] = []
  listsCustom: CustomListConfig[] = []

  async generateData() {
    for (const options of this.lists) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      console.time(options.filename);
      const generator = new options.generator(options.url, options.options)
      const folder = path.join(__dirname, '../../data/', options.language)
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
      }
      fs.writeFileSync(
        path.join(folder, `${options.filename}.json`),
        JSON.stringify(await generator.run()),
      )
      console.timeEnd(options.filename);
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
    }
    for (const options of this.listsCustom) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      const generator = new options.generator(options.options)
      const folder = path.join(__dirname, '../../data/', options.language)
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
      }
      await generator.run(path.join(folder, `${options.filename}`))
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
    }
  }
  async generateIndices() {
    const dataFolder = path.join(__dirname, '../../data/')
    for (const language of fs.readdirSync(dataFolder)) {
      const languageFolder = path.join(dataFolder, language)
      const files = fs
        .readdirSync(languageFolder)
        .filter((f) => f.endsWith('.json'))
      fs.writeFileSync(
        path.join(languageFolder, 'index.js'),
        `${files
          .map((f) => `import ${f.replace('.json', '')} from "./${f}"`)
          .join('\n')}

export default {
    ${files.map((f) => f.replace('.json', '')).join(',\n    ')}
}`,
      )
    }
  }

  async run() {
    await this.generateData()
    await this.generateIndices()
  }

  registerCustomList(
    language: string,
    filename: string,
    generator: any,
    options?,
  ) {
    this.listsCustom.push({ language, filename, generator, options })
  }

  registerList(
    language: string,
    filename: string,
    url: string,
    generator: any,
    options?,
  ) {
    this.lists.push({ language, filename, url, generator, options })
  }
}
