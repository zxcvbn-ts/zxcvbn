# @zxcvbn-ts/language-tr

The Turkish dictionary and translation package for zxcvbn-ts

## Sources

- `commonWords.json` is generated from Turkish OpenSubtitles 2024 frequency data provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles).
- `firstnames.json` is generated from the Turkish first-name locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/first_name.ts).
- `lastnames.json` is generated from the Turkish surname locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/last_name.ts).
- `wikipedia.json` is generated from the Turkish Wikipedia pages/articles dump at <https://dumps.wikimedia.org/trwiki/latest/trwiki-latest-pages-articles.xml.bz2>.
- `wordSequences.json` contains manually curated Turkish sequence lists for numbers, weekdays, months, seasons, colors, directions, planets, and zodiac signs.

## Install

#### npm:

`npm install @zxcvbn-ts/language-tr --save`

#### yarn:

`yarn add @zxcvbn-ts/language-tr`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnTrPackage from '@zxcvbn-ts/language-tr'

const password = 'somePassword'
const options = {
  translations: zxcvbnTrPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnTrPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
