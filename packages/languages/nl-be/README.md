# @zxcvbn-ts/language-nl-be

Contains Dutch words specific to Belgium and common Dutch words

## Install

#### npm:

`npm install @zxcvbn-ts/language-nl-be --save`

#### yarn:

`yarn add @zxcvbn-ts/language-nl-be`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnNlBePackage from '@zxcvbn-ts/language-nl-be'

const password = 'somePassword'
const options = {
  translations: zxcvbnNlBePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnNlBePackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

- commonWords.json is generated from the OpenSubtitles 2024 dataset provided via OPUS (https://opus.nlpl.eu/datasets/OpenSubtitles). The dataset is licensed under ODC-BY (Open Data Commons Attribution License) and requires attribution when redistributed.
- First and last names (open data) from statbel
https://statbel.fgov.be/nl/themas/bevolking/namen-en-voornamen/voornamen-van-meisjes-en-jongens#panel-13
https://statbel.fgov.be/nl/themas/bevolking/namen-en-voornamen/familienamen#figures
