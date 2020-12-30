import { SimpleListGenerator } from './_generators/SimpleListGenerator'
import { PasswordGenerator } from './_generators/PasswordGenerator'
import ListHandler from './_helpers/runtime'
import { KeyboardAdjacencyGraph } from './_generators/KeyboardAdjacencyGraph'

const lists = {
  // en: {
  //   commonWords: {
  //     source:
  //       'https://github.com/hermitdave/FrequencyWords/raw/master/content/2018/en/en_50k.txt',
  //     options: { hasOccurrences: true },
  //   },
  //   firstnames: {
  //     source:
  //       'https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.txt',
  //   },
  //   lastnames: {
  //     source:
  //       'https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt',
  //   },
  // },
  // de: {
  //   commonWords: {
  //     source:
  //       'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt',
  //     options: { hasOccurrences: true },
  //   },
  //   firstnames: {
  //     source:
  //       'https://gist.githubusercontent.com/hrueger/2aa48086e9720ee9b87ec734889e1b15/raw',
  //   },
  //   lastnames: {
  //     source:
  //       'https://gist.githubusercontent.com/hrueger/6599d1ac1e03b4c3dc432d722ffcefd0/raw',
  //   },
  // },
  common: {
    passwords: {
      generator: PasswordGenerator,
      customList: true,
    },
    // keyboardLayouts: {
    //   generator: KeyboardAdjacencyGraph,
    // },
  },
}

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
          data.options
        )
      }
    })
  })

  await listHandler.run()
}

main()
