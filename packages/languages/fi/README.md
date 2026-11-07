# @zxcvbn-ts/language-fi

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-fi)](https://www.npmjs.com/package/@zxcvbn-ts/language-fi)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-fi)](https://bundlephobia.com/package/@zxcvbn-ts/language-fi)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-fi)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Finnish dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-fi`, `femaleFirstnames-fi`, `lastnames-fi`, `maleFirstnames-fi`, `wikipedia-fi`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Finnish.

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-fi
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-fi
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-fi
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnFiPackage from '@zxcvbn-ts/language-fi'

const options = {
  translations: zxcvbnFiPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFiPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Finnish
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords` is generated from the [OpenSubtitles 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) word frequency list (`fi`) provided via OPUS, licensed under [ODC-BY](https://opendatacommons.org/licenses/by/1-0/).
- `maleFirstnames`, `femaleFirstnames` and `lastnames` are generated from the name statistics of the Finnish Digital and Population Data Services Agency on [avoindata.fi](https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a). The data is updated regularly and its download links contain the export date, so they change over time.
- `wikipedia` is generated from the [Finnish Wikipedia dump](https://dumps.wikimedia.org/fiwiki/latest/fiwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
