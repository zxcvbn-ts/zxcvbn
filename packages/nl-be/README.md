# @zxcvbn-ts/language-nl-be

Contains Dutch words specific to Belgium and common Dutch words

## Install

#### npm:

`npm install @zxcvbn-ts/language-nl @zxcvbn-ts/language-nl-be --save`

#### yarn:

`yarn add @zxcvbn-ts/language-nl @zxcvbn-ts/language-nl-be`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnNlBePackage from '@zxcvbn-ts/language-nl-be'

const password = 'somePassword'
const options = {
  translations: zxcvbnNlBePackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnNlBePackage.dictionary,
  },
}

zxcvbn(password, options)
```

## Sources

First and last names (open data) from statbel
https://statbel.fgov.be/nl/themas/bevolking/namen-en-voornamen/voornamen-van-meisjes-en-jongens#panel-13
https://statbel.fgov.be/nl/themas/bevolking/namen-en-voornamen/familienamen#figures