# @zxcvbn-ts/language-ru

The Russian language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-ru --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ru`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnRuPackage from '@zxcvbn-ts/language-ru'

const password = 'somePassword'
const options = {
  translations: zxcvbnRuPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnRuPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

- `commonWords.json` is generated from OpenSubtitles 2024 frequency data provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles).
- `firstnames.json` is generated from the first-name locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/first_name.ts).
- `lastnames.json` is generated from the surname locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/last_name.ts).