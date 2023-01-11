import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

export interface LooseObject {
  [key: string]: any
}

export interface ListConfig {
  language: string
  filename: string
  generator: any
  options?: any
  url?: string
}

interface RegisterListOptions {
  language: string
  filename: string
  url?: string
  generator: any
  options?: LooseObject
}

export default class ListHandler {
  lists: ListConfig[] = []

  languages: Set<string> = new Set()

  // eslint-disable-next-line max-statements
  async generateData() {
    // eslint-disable-next-line no-restricted-syntax
    for (const options of this.lists) {
      console.info(
        `----------- Starting ${options.language} ${options.filename} -----------`,
      )
      // eslint-disable-next-line no-console
      console.time(options.filename)
      // eslint-disable-next-line new-cap
      const generator = new options.generator({
        options: options.options,
        url: options.url,
      })
      const folder = path.join(
        __dirname,
        '../../packages/languages/',
        options.language,
        'src',
      )
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
      }

      // eslint-disable-next-line no-await-in-loop
      const data = await generator.run()
      if (data) {
        fs.writeFileSync(
          path.join(folder, `${options.filename}.json`),
          JSON.stringify(data),
        )
      }
      // eslint-disable-next-line no-console
      console.timeEnd(options.filename)
      console.info(
        `----------- Finished ${options.language} ${options.filename} -----------`,
      )
      this.languages.add(options.language)
    }
  }

  async generateIndices() {
    const dataFolder = path.join(__dirname, '../../packages/languages/')

    const languages = fs
      .readdirSync(dataFolder)
      .filter((language) => this.languages.has(language))

    // eslint-disable-next-line max-statements
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

      const hasAdjacencyGraphs = files.includes('adjacencyGraphs.json')

      const filesToIgnore = ['translations', 'adjacencyGraphs']
      const dictionaryExports = files
        .map((file) => file.replace('.json', ''))
        .filter((file) => !filesToIgnore.includes(file))
        .join(',\n  ')

      const translations = isCommon ? '' : 'translations,'
      const adjacencyGraphs = hasAdjacencyGraphs ? 'adjacencyGraphs,' : ''

      fs.writeFileSync(
        indexPath,
        `${imports}

export default {
    dictionary: {
      ${dictionaryExports}
    },
    ${translations}
    ${adjacencyGraphs}
}`,
      )
      try {
        execSync(`eslint --ext .ts --fix --cache ${indexPath}`)
      } catch (error: any) {
        if (error.stdout) {
          console.error((error.stdout as Buffer).toString('utf8'))
          throw new Error(`Eslint failed for file ${indexPath}`)
        }
        throw error
      }
    })
  }

  async run() {
    await this.generateData()
    await this.generateIndices()
  }

  registerList(options: RegisterListOptions) {
    this.lists.push(options)
  }
}
