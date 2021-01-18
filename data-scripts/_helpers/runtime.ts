import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

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
  languages: Set<string> = new Set()

  async generateData() {
    for (const options of this.lists) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      console.time(options.filename)
      const generator = new options.generator(options.url, options.options)
      const folder = path.join(
        __dirname,
        '../../packages/',
        options.language,
        'src',
      )
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
      }
      const data = JSON.stringify(await generator.run())
      fs.writeFileSync(
        path.join(folder, `${options.filename}.json`),
        `${data}`,
      )
      console.timeEnd(options.filename)
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
      this.languages.add(options.language)
    }
    for (const options of this.listsCustom) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      const generator = new options.generator(options.options)

      const folder = path.join(
        __dirname,
        '../../packages/',
        options.language,
        'src',
      )
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
      }
      await generator.run(path.join(folder, `${options.filename}`))
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
      this.languages.add(options.language)
    }
  }
  async generateIndices() {
    const dataFolder = path.join(__dirname, '../../packages/')
    const nonLanguagePackage = ['main']
    const languages = fs
      .readdirSync(dataFolder)
      .filter((language) => !nonLanguagePackage.includes(language))
      .filter((language) => this.languages.has(language))
    for (const language of languages) {
      const isCommon = language === 'common'
      const languageFolder = path.join(dataFolder, language, 'src')
      const files = fs
        .readdirSync(languageFolder)
        .filter((file) => file.endsWith('.json'))

      if(!isCommon){
        files.push('translations')
      }

      const indexPath = path.join(languageFolder, 'index.ts')
      const imports = files
        .map((file) => `import ${file.replace('.json', '')} from "./${file}"`)
        .join('\n')
      const dictionaryExports = files
        .map((file) => file.replace('.json', ''))
        .filter((file) => file !== 'translations')
        .join(',\n  ')

      const translations = isCommon ? '' : 'translations,'

      fs.writeFileSync(
        indexPath,
        `${imports}

const userInputs: string[] = []

export default {
    dictionary: {
      userInputs,
      ${dictionaryExports}
    },
    ${translations}
}`,
      )
      try {
        execSync(`eslint --ext .ts --fix --cache ${indexPath}`)
      } catch (e) {
        if (e.stdout) {
          console.error((e.stdout as Buffer).toString('utf8'));
          throw new Error("Eslint failed for file "+indexPath)
        }
        throw e
      }
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
