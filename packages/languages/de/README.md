# @zxcvbn-ts/language-de

The German dictionary and language package for **zxcvbn-ts**

## Install

#### npm:

`npm install @zxcvbn-ts/language-de --save`

#### yarn:

`yarn add @zxcvbn-ts/language-de`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'

const password = 'somePassword'
const options = {
  translations: zxcvbnDePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnDePackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

- commonWords.json is generated from the OpenSubtitles 2024 dataset provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles). The dataset is licensed under ODC-BY (Open Data Commons Attribution License) and requires attribution when redistributed.
