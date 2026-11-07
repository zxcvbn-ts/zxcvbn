# @zxcvbn-ts/language-nl-be

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-nl-be)](https://www.npmjs.com/package/@zxcvbn-ts/language-nl-be)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-nl-be)](https://bundlephobia.com/package/@zxcvbn-ts/language-nl-be)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-nl-be)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Belgian Dutch dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator. It contains Dutch words specific to Belgium as well as common Dutch words.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `boysFirstnames-nl-be`, `commonWords-nl-be`, `girlsFirstnames-nl-be`, `lastnames-nl-be`, `wikipedia-nl-be`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Belgian Dutch.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-nl-be
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-nl-be
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-nl-be
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnNlBePackage from '@zxcvbn-ts/language-nl-be'

const options = {
  translations: zxcvbnNlBePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnNlBePackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Belgian Dutch
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`nl`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- `boysFirstnames`, `girlsFirstnames` and `lastnames` are generated from open data published by [Statbel](https://statbel.fgov.be/nl/themas/bevolking/namen-en-voornamen).
- `wikipedia` is generated from the [Dutch Wikipedia dump](https://dumps.wikimedia.org/nlwiki/latest/nlwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
