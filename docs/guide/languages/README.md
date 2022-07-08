# Languages

`zxcvbn-ts` is available for multiple languages. If your language is not supported you can set the options by yourself.

Current supported languages:

- German
- English
- Spain (Spain)
- French
- Italian
- Dutch (Belgium)
- Portuguese (Brazilian)
- Polish
- Japanese

## Feedback

By default, `zxcvbn-ts` uses `keys` as feedback. This way you can integrate `zxcvbn-ts` into your own translation system.
If you don't have an own translation system or want to use predefined translation you can use one of the language packs.
Each language pack has its own translation file that you can use like this:

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { translations } from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations,
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Dictionary

By default, `zxcvbn-ts` doesn't use any dictionaries to let the developer decide how much of the library will be used.
This makes the library tiny but inefficient compared to the original library.
It is recommended to use at least the common and english language package.

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Keyboard patterns

By default, `zxcvbn-ts` don't use any keyboard patterns to let the developer decided how much of the library will be used.
It is recommended to use at least the common keyboard patterns.

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

const password = 'somePassword'
const options = {
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Add a new language package

To add a missing language package you need to do the following things:

- Clone the repo.
- Install dependencies with `yarn install`.
- Create a new language package inside the `packages/languages` directory. You need following file structure:

```yaml
- src
  - translations.ts
- package.json
- README.md
- tsconfig.json
```

- Fill `src/translations.ts` with translations for your language.
- Adjust `README.md` file as appropriate.
- Find some reliable sources for some dictionaries. As a minimum, you need to have a source for `firstname`, `lastname` and `commonWords`.
  For common words you can check out <https://github.com/hermitdave/FrequencyWords> - there are a lot of languages available.
- Add your language and sources to the generator list in `./data-scripts/lists.ts`.

  There is a default generator that takes simple lists that have only single words per line and can have occurrences of that word with a space separator.
  For example something like this:

  ```txt
  John
  Debra
  Billy
  ```

  or:

  ```txt
  you 23123
  i 12345
  the 234
  ```

  If your list is more complex you need to write your own generator like the [password generator](./data-scripts/_generators/PasswordGenerator.ts) or the [keyboard generator](./data-scripts/_generators/KeyboardAdjacencyGraph.ts)

- Run `yarn generate:languageData`. This will generate the JSON files and `index.ts`.
- During debugging, it might be easy to only generate the language files for one
  language, use `yarn generate:languageData nl-be` for example.
- Create a pull request to the master branch.
- _(Optional)_ Use the Wikipedia extractor; one of the maintainers can do this but this will increase the time until it is merged.
  - Get the wikipedia dump for your language from <https://dumps.wikimedia.org/XXwiki/latest/XXwiki-latest-pages-articles.xml.bz2> where `XX` is your language like `en` or `de`.
  - Install [`wikiextractor`](https://github.com/attardi/wikiextractor): `pip
    install wikiextractor`. Currently, with v3.0.4 it only works correctly on Linux.
  - Run `wikiextractor`:

    ```sh
    wikiextractor --no-templates -o data-scripts/wikiExtractor/extracts XXwiki-latest-pages-articles.xml.bz2
    ```

  - Run `yarn run wikipediaExtractor` to generate `wikipedia.json` from all the files inside the `extracts` folder.
  - Move `wikipedia.json` into your language package.
