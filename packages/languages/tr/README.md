# @zxcvbn-ts/language-tr

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-tr)](https://www.npmjs.com/package/@zxcvbn-ts/language-tr)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-tr)](https://bundlephobia.com/package/@zxcvbn-ts/language-tr)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-tr)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Turkish dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-tr`, `firstnames-tr`, `lastnames-tr`, `wikipedia-tr`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Turkish.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-tr
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-tr
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-tr
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnTrPackage from '@zxcvbn-ts/language-tr'

const options = {
  translations: zxcvbnTrPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnTrPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Turkish
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`tr`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- `firstnames` is generated from the [Faker](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/first_name.ts) `tr` locale data.
- `lastnames` is generated from the [Faker](https://github.com/faker-js/faker/blob/main/src/locales/tr/person/last_name.ts) `tr` locale data.
- `wikipedia` is generated from the [Turkish Wikipedia dump](https://dumps.wikimedia.org/trwiki/latest/trwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated Turkish sequences for numbers, weekdays, months, seasons, colors, directions, planets and zodiac signs.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
