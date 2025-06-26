import path from 'path'
import fs from 'fs'

const DENY_LIST = ['adjacencyGraphs.json']
const LANGUAGES_PATH = path.join(__dirname, '..', 'packages', 'languages')

type LanguageRankingsTable = Record<
  string,
  {
    file: string
    rank: number
  }
>

const main = async () => {
  const forceLanguage = process.argv.length > 2 ? process.argv[2] : undefined

  const languages = fs
    .readdirSync(LANGUAGES_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const promises = languages.map(async (language) => {
    console.info(`loading ${language} files...`)
    if (forceLanguage !== undefined && language !== forceLanguage) {
      return
    }
    const languagePath = path.join(LANGUAGES_PATH, language, 'src')
    const files = fs
      .readdirSync(languagePath, {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name)
      .filter(
        (fileName) =>
          fileName.endsWith('.json') && !DENY_LIST.includes(fileName),
      )

    const languageRankTable: LanguageRankingsTable = {}

    await Promise.all(
      files
        .map((file) => async () => {
          const words = await import(path.join(languagePath, file))
          words.default.forEach((word: string, rank: number) => {
            // if this is the first time seeing this word OR it has a better rank, keep it
            if (
              !languageRankTable[word] ||
              rank < languageRankTable[word].rank
            ) {
              languageRankTable[word] = { file, rank }
            }
            // otherwise, skip it
          })
        })
        .map(async (job) => {
          await job()
        }),
    )

    console.info(`re-sorting ${language} words...`)
    const groupedByFile = Object.entries(languageRankTable).reduce(
      (
        acc: Record<string, { word: string; rank: number }[]>,
        [word, { file, rank }],
      ) => {
        if (acc[file] === undefined) {
          acc[file] = []
        }
        acc[file].push({ word, rank })
        return acc
      },
      {},
    )

    console.info(`re-writing ${language} files...`)
    Object.entries(groupedByFile).forEach(([file, words]) => {
      const sorted = words
        .sort((a, b) => a.rank - b.rank)
        .map(({ word }) => word)
      const json = JSON.stringify(sorted)
      fs.writeFileSync(path.join(languagePath, file), json)
    })
    console.info(`finished ${language}!`)
  })

  await Promise.all(promises)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
