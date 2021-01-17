import { SimpleListGenerator } from './_generators/SimpleListGenerator'
import ListHandler from './_helpers/runtime'
import lists from './lists'

const main = async () => {
  const listHandler = new ListHandler()

  Object.keys(lists).forEach((language) => {
    const languageLists = lists[language]
    Object.keys(languageLists).forEach((name) => {
      const data = languageLists[name]

      if (data.customList) {
        listHandler.registerCustomList(language, name, data.generator)
      } else {
        listHandler.registerList(
          language,
          name,
          data.source,
          data.generator || SimpleListGenerator,
          data.options,
        )
      }
    })
  })

  await listHandler.run()
}

main()
