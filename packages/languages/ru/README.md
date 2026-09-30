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

The common language package also exports the Russian ЙЦУКЕН keyboard graph as
`adjacencyGraphs.russian`. The graph covers the standard Russian letter layout,
including `ё` and shifted characters, so sequences such as `фыва`, `йцукен`,
and `ячсм` can be matched as keyboard patterns when the common package is
configured as shown above.

## Sources

- `commonWords.json` is generated from OpenSubtitles 2024 frequency data provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles).
- `firstnames.json` is generated from the first-name locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/first_name.ts).
- `lastnames.json` is generated from the surname locale data in [FakerJS](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/last_name.ts).
