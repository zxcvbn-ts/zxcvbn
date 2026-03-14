# @zxcvbn-ts/language-hr

The Croatian dictionary and language package for zxcvbn-ts

## Sources

- `commonWords.json` is generated from the Croatian 2018 word-frequency list in [FrequencyWords](https://github.com/hermitdave/FrequencyWords).
- `firstnames.json` is generated from the Croatian first-name locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/hr/person/first_name.ts).
- `lastnames.json` is generated from the Croatian surname locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/hr/person/last_name.ts).
- `wikipedia.json` is generated from the Croatian Wikipedia dump at <https://dumps.wikimedia.org/hrwiki/latest/hrwiki-latest-pages-articles.xml.bz2> using the repo's documented `wikiextractor` plus `yarn wikipediaExtractor` flow.
- The official Croatian Bureau of Statistics search tool for names and surnames is available at <https://web.dzs.hr/app/imena/default.aspx>, but it is query-based rather than a directly downloadable bulk list, so it is not used for generation in this first pass.

## Install

#### npm:

`npm install @zxcvbn-ts/language-hr --save`

#### yarn:

`yarn add @zxcvbn-ts/language-hr`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnHrPackage from '@zxcvbn-ts/language-hr'

const password = 'somePassword'
const options = {
  translations: zxcvbnHrPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnHrPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
