# @zxcvbn-ts/language-pl

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-pl)](https://www.npmjs.com/package/@zxcvbn-ts/language-pl)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-pl)](https://bundlephobia.com/package/@zxcvbn-ts/language-pl)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-pl)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Polish dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-pl`, `femaleFirstnames-pl`, `femaleLastnames-pl`, `maleFirstnames-pl`, `maleLastnames-pl`, `wikipedia-pl`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Polish.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-pl
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-pl
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-pl
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnPlPackage from '@zxcvbn-ts/language-pl'

const options = {
  translations: zxcvbnPlPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnPlPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Polish
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`pl`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- The first and last name lists are extracted from files on the [Polish Government Data Portal](https://dane.gov.pl/), licensed under CC0 1.0: the [first names](https://dane.gov.pl/pl/dataset/1667,lista-imion-wystepujacych-w-rejestrze-pesel-osoby-zyjace) and [last names](https://dane.gov.pl/pl/dataset/1681,nazwiska-osob-zyjacych-wystepujace-w-rejestrze-pesel) datasets. They are ranked by popularity and contain the names of individuals registered in the Polish Universal Electronic System for Population Register (PESEL), which may include foreigners such as refugees from Ukraine who were assigned a PESEL number following the Russian invasion of Ukraine.
- `wikipedia` is generated from the [Polish Wikipedia dump](https://dumps.wikimedia.org/plwiki/latest/plwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## Author

The Polish dictionary and language package was prepared by [Oskar Gmerek](https://oskargmerek.com) | [GitHub](https://github.com/oskar-gmerek)

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
