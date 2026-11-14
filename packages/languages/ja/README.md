# @zxcvbn-ts/language-ja

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-ja)](https://www.npmjs.com/package/@zxcvbn-ts/language-ja)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-ja)](https://bundlephobia.com/package/@zxcvbn-ts/language-ja)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-ja)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Japanese dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-ja`, `firstnames-ja`, `lastnames-ja`, `wikipedia-ja`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Japanese.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ja
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ja
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ja
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnJaPackage from '@zxcvbn-ts/language-ja'

const options = {
  translations: zxcvbnJaPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnJaPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Japanese
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`ja`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- `firstnames` and `lastnames` are taken from [tomoyukikashiro/zxcvbn-japanese-data](https://github.com/tomoyukikashiro/zxcvbn-japanese-data).
- `wikipedia` is generated from the [Japanese Wikipedia dump](https://dumps.wikimedia.org/jawiki/latest/jawiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
