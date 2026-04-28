# @zxcvbn-ts/language-ja

The Japanese dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-ja --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ja`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnJaPackage from '@zxcvbn-ts/language-ja'

const password = 'somePassword'
const options = {
  translations: zxcvbnJaPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnJaPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

- commonWords.json is generated from the OpenSubtitles 2024 dataset provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles). The dataset is licensed under ODC-BY (Open Data Commons Attribution License) and requires attribution when redistributed.
