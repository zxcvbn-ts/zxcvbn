# @zxcvbn-ts/language-pl

The Polish dictionary and language package for zxcvbn-ts

## Install

### npm:

`npm install @zxcvbn-ts/language-pl --save`

### yarn:

`yarn add @zxcvbn-ts/language-pl`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnPlPackage from '@zxcvbn-ts/language-pl'

const password = 'somePassword'
const options = {
  translations: pl.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...pl.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## Sources

1. First and last names data use to be a dictionary for zxcvbn-ts are extracted from files based on Polish Government Public Datasets (Public Domain) and available publicly on <https://github.com/oskar-gmerek/polish_database> (MIT licensed)
   [*] Data is based on Last and First names registered under Polish Universal Electronic System for Population Register and may contains also names of foreigners registered under this Register, (ex. refugees from Ukraine who were given a PESEL number after the Russian Invasion of Ukraine)
   [*] Lastnames https://dane.gov.pl/pl/dataset/1681,nazwiska-osob-zyjacych-wystepujace-w-rejestrze-pesel
   [*] Firstnames https://dane.gov.pl/pl/dataset/1667,lista-imion-wystepujacych-w-rejestrze-pesel-osoby-zyjace
2. Common Words data use to be a dictionary for zxcvbn-ts are extracted from files available on https://opus.nlpl.eu/OpenSubtitles2018.php .Files based on that data and used to generate zxcvbn-ts dictionary are available publicly on <https://github.com/hermitdave/FrequencyWords> (MIT licensed)

## Author

The Polish dictionary and language package was prepared by [Oskar Gmerek](https://oskargmerek.com) | [GitHub](https://github.com/oskar-gmerek)
