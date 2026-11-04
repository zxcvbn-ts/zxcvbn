# @zxcvbn-ts/language-common

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/language-common)](https://www.npmjs.com/package/@zxcvbn-ts/language-common)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/language-common)](https://bundlephobia.com/package/@zxcvbn-ts/language-common)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/language-common)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

Language-independent data for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a realistic password strength estimator: the most common passwords, the diceware wordlist and the keyboard adjacency graphs.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Languages guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

## What's included

- `dictionary`
  - `passwords-common`: frequently used passwords, ranked by popularity
  - `diceware-common`: the EFF diceware wordlist, so diceware-style passphrases are recognized word by word
- `adjacencyGraphs`: keyboard layouts (`qwerty`, `qwertz`, `azerty`, `dvorak`, `keypad`, `keypadMac`) used by the spatial matcher to detect keyboard patterns like `qwertz` or `1qaz2wsx`

This package has no feedback translations. Almost every setup should include it, and add one or more language packages (for example [`@zxcvbn-ts/language-en`](https://www.npmjs.com/package/@zxcvbn-ts/language-en)) for dictionaries and translated feedback.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

const options = {
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
console.log(result.score) // 0 (weak) to 4 (strong)
```

With a language package:

```js
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}
```

The password list is fairly large. To keep it out of your main bundle, see [lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/).

## Sources

- `passwords` is derived from [Mark Burnett's ten million passwords release](https://medium.com/xato-security/today-i-am-releasing-ten-million-passwords-b6278bbe7495), as in the original zxcvbn: "Mark Burnett for releasing his 10M password corpus and for his 2005 book, Perfect Passwords: Selection, Protection, Authentication." The source author states in that article that he released the data set to the public domain.
- `diceware` is the [EFF wordlist](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases), obtained via [dmuth/diceware](https://github.com/dmuth/diceware). The EFF website states that its original material is licensed under [CC BY 4.0](https://www.eff.org/copyright).

See [NOTICE.md](NOTICE.md) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). The bundled data keeps the licenses of its sources listed above.
