import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

interface LooseObject {
  [key: string]: any
}

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
    // eslint-disable-next-line no-restricted-syntax
    for (const options of this.lists) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      // eslint-disable-next-line no-console
      console.time(options.filename)
      // eslint-disable-next-line new-cap
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
      // eslint-disable-next-line no-await-in-loop
      const data = JSON.stringify(await generator.run())
      fs.writeFileSync(path.join(folder, `${options.filename}.json`), `${data}`)
      // eslint-disable-next-line no-console
      console.timeEnd(options.filename)
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
      this.languages.add(options.language)
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const options of this.listsCustom) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      // eslint-disable-next-line no-console
      console.time(options.filename)
      // eslint-disable-next-line new-cap
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
      // eslint-disable-next-line no-await-in-loop
      await generator.run(path.join(folder, `${options.filename}`))
      // eslint-disable-next-line no-console
      console.timeEnd(options.filename)
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
      this.languages.add(options.language)
    }
  }

  async generateIndices() {
    const dataFolder = path.join(__dirname, '../../packages/')

    const languages = fs
      .readdirSync(dataFolder)
      .filter((language) => this.languages.has(language))

    languages.forEach((language) => {
      const isCommon = language === 'common'
      const languageFolder = path.join(dataFolder, language, 'src')
      const files = fs
        .readdirSync(languageFolder)
        .filter((file) => file.endsWith('.json'))

      if (!isCommon) {
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
          console.error((e.stdout as Buffer).toString('utf8'))
          throw new Error(`Eslint failed for file ${indexPath}`)
        }
        throw e
      }
    })
  }

  async run() {
    await this.generateData()
    await this.generateIndices()
  }

  registerCustomList(
    language: string,
    filename: string,
    generator: any,
    options?: LooseObject,
  ) {
    this.listsCustom.push({ language, filename, generator, options })
  }

  registerList(
    language: string,
    filename: string,
    url: string,
    generator: any,
    options?: LooseObject,
  ) {
    this.lists.push({ language, filename, url, generator, options })
  }
}
