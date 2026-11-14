# @zxcvbn-ts/language-ku

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-ku)](https://www.npmjs.com/package/@zxcvbn-ts/language-ku)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-ku)](https://bundlephobia.com/package/@zxcvbn-ts/language-ku)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-ku)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Kurdish (Kurmanjî dialect) dictionaries and feedback translations for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`: `commonWords-ku`, `firstnames-ku`, `lastnames-ku`, `wikipedia-ku`, word sequence lists. Passwords built from these words are recognized and get a lower score.
- `translations`: the warnings and suggestions returned in `result.feedback`, in Kurdish (Kurmanjî dialect).

Use it together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common), which provides the common password list and the keyboard adjacency graphs. You can combine several language packages by spreading more dictionaries into `dictionary`.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ku
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ku
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-ku
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnKuPackage from '@zxcvbn-ts/language-ku'

const options = {
  translations: zxcvbnKuPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnKuPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
console.log(result.feedback) // { warning, suggestions } in Kurdish (Kurmanjî dialect)
```

The dictionaries are fairly large. To keep them out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `commonWords`, `firstnames` and `lastnames` were contributed with the initial Kurdish support ([#289](https://github.com/zxcvbn-ts/zxcvbn/pull/289)). Their sources were not documented.
- `wikipedia` is generated from the [Kurdish Wikipedia dump](https://dumps.wikimedia.org/kuwiki/latest/kuwiki-latest-pages-articles.xml.bz2).
- `wordSequences` contains manually curated sequences (numbers, weekdays, months, …) used by the word sequence matcher.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
