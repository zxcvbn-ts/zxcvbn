# @zxcvbn-ts/language-ru

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-ru)](https://www.npmjs.com/package/@zxcvbn-ts/language-ru)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-ru)](https://bundlephobia.com/package/@zxcvbn-ts/language-ru)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-ru)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Russian dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-ru`, `firstnames-ru`, `lastnames-ru`, `wikipedia-ru`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Russian.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ru
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ru
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ru
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnRuPackage from '@zxcvbn-ts/language-ru'

const options = {
  translations: zxcvbnRuPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnRuPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Russian
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`ru`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- `firstnames` is generated from the [Faker](https://github.com/faker-js/faker/blob/3b184d6e52a721c227c6e9c58731bdf008f43532/src/locales/ru/person/first_name.ts) `ru` locale data.
- `lastnames` is generated from the [Faker](https://github.com/faker-js/faker/blob/3b184d6e52a721c227c6e9c58731bdf008f43532/src/locales/ru/person/last_name.ts) `ru` locale data.
- `wikipedia` is generated from the [Russian Wikipedia dump](https://dumps.wikimedia.org/ruwiki/latest/ruwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
