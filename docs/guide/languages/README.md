# Languages

zxcvbn-ts is available for multiple languages. If your language is not supported you can set the options by yourself.

Current supported languages:
- German
- English
- Dutch (Belgium)

## Feedback
By default zxcvbn-ts uses `keys` as feedback. This way you can integrate zxcvbn-ts into your own translation system.
If you don't have a own translation system or want to use predefined translation you can use one of the language packs.
Each language pack has it's own translation file that you can use like this:

```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import { translations } from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations,
}

ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Dictionary
By default zxcvbn-ts don't use any dictionaries to let the developer decided how much of the library will be used.
This makes the library tiny but inefficient compared to the original library.
It is recommended to use at least the common and english language package.

```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Add a new language package

To add a missing language package you need to do the following things:

- Copy repo
- install dependencies with `yarn install`
- Create a new language package inside the packages directory. You need following file structure:
```
- src
    - translations.ts
- package.json
- README.md
- tsconfig.json 
```
- fill the translation file with the correct translations of your language
- adjust the README.md file example to your language 
- find some reliable sources for some dictionaries. At least you need to have a source for `firstname`, `lastname` and `commonWords`.
For common words you can check out https://github.com/hermitdave/FrequencyWords there are a lot of languages available.
- add your language and sources to the generator list in `./data-scripts/lists.ts`
- there is a default generator that takes simple lists that have only single words per line and can have occurrences of that word with a space separator.
For example something like this:

```
John
Debra
Billy
```
or:
```
you 23123
i 12345
the 234
```

If your list is more complex you need to write your own generator like the [password generator](./data-scripts/_generators/PasswordGenerator.ts) or the [keyboard generator](./data-scripts/_generators/KeyboardAdjacencyGraph.ts)

- Execute the npm script `generate:languageData` with `yarn generate:languageData`. This will generate the json files and the index.ts.
- During debugging, it might be easy to only generate the language files for one language, use `yarn generate:languageData nl-be`
- Create a pull request to the master branch
- use the wikipedia extractor (optional, one of the maintainer can do this but this will increase the time until it is merged)
    - get the wikipedia dump for your language from http://dumps.wikimedia.org/XXwiki/latest/XXwiki-latest-pages-articles.xml.bz2 where `XX` is your language like `en` or `de`
    - get the [wikiextractor](https://github.com/attardi/wikiextractor) written in python 3. Currently, with v3.0.4 it only works correctly on linux
    - use the wikiextractor with `python3 -m wikiextractor.WikiExtractor --no-templates -o extracts dewiki-latest-pages-articles.xml.bz2` (The output folder need to be the extracts folder inside the zxcvbn-ts repo)
    - execute `yarn run wikipediaExtractor` which generates `wikipedia.json` from all the files inside the extracts folder
    - move the `wikipedia.json` into your language package
