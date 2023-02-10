# @zxcvbn-ts/language-id

The Indonesia dictionary and language package for zxcvbn-ts

## Sources

- `commonWords.json` list is generated from the 2018 full wordlist in [FrequencyWords](https://github.com/hermitdave/FrequencyWords) repository.
- `names.json` source is based on [this gist](https://gist.github.com/bagaswastu/35c80cdd8c32ca0b6aafa119e80e93ef) and currently is fetched from [Wikitionary](https://en.wiktionary.org/wiki/Appendix:Indonesian_given_names). The list will be updated later from several articles or blogs.
- `wikipedia.json` is generated from [Indonesia Wikipedia dump](https://dumps.wikimedia.org/idwiki/latest/idwiki-latest-pages-articles.xml.bz2).

## Install

#### npm:

`npm install @zxcvbn-ts/language-id --save`

#### yarn:

`yarn add @zxcvbn-ts/language-id`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnIdPackage from '@zxcvbn-ts/language-id'

const password = 'somePassword'
const options = {
  translations: zxcvbnIdPackage.translations,
  graphs: zxcvbnCommonPackage.adjacidcyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnIdPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
