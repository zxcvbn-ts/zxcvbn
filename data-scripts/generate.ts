import SimpleListGenerator from './_generators/SimpleListGenerator'
import ListHandler from './_helpers/runtime'
import lists from './lists'

const main = async () => {
  const listHandler = new ListHandler()
  const forceLanguage = process.argv.length > 2 ? process.argv[2] : undefined

  Object.keys(lists).forEach((language) => {
    if (forceLanguage !== undefined && language !== forceLanguage) {
      return
    }
    const languageLists = lists[language]
    Object.keys(languageLists).forEach((name) => {
      const data = languageLists[name]

      listHandler.registerList({
        language,
        filename: name,
        url: data.source,
        generator: data.generator ?? SimpleListGenerator,
        options: data.options,
      })
    })
  })

  await listHandler.run()
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
