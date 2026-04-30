# @zxcvbn-ts/language-pl

The Polish dictionary and language package for zxcvbn-ts

## Install

### npm:

`npm install @zxcvbn-ts/language-pl --save`

### yarn:

`yarn add @zxcvbn-ts/language-pl`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnPlPackage from '@zxcvbn-ts/language-pl'

const password = 'somePassword'
const options = {
  translations: zxcvbnPlPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnPlPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

1. The first and last name data used as a dictionary for zxcvbn-ts are extracted from files available on the [Polish Government Data Portal](https://dane.gov.pl/).
   * These lists are ranked by popularity and consist of the names of individuals registered in the Polish Universal Electronic System for Population Register (PESEL). They may also include the names of foreigners, such as refugees from Ukraine, who were assigned a PESEL number following the Russian invasion of Ukraine.
   * [Last Names Dataset](https://dane.gov.pl/pl/dataset/1681,nazwiska-osob-zyjacych-wystepujace-w-rejestrze-pesel) (CC0 1.0 licensed)
   * [First Names Dataset](https://dane.gov.pl/pl/dataset/1667,lista-imion-wystepujacych-w-rejestrze-pesel-osoby-zyjace) (CC0 1.0 licensed)
2. `commonWords.json` is generated from the [OPUS](https://opus.nlpl.eu/datasets/OpenSubtitles) 2024 OpenSubtitles list, which is licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).

## Author

The Polish dictionary and language package was prepared by [Oskar Gmerek](https://oskargmerek.com) | [GitHub](https://github.com/oskar-gmerek)
