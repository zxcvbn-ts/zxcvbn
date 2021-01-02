# @zxcvbn-ts/language-de

The German dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-de --save`

#### yarn:

`yarn add @zxcvbn-ts/language-de`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnDePackage from '@zxcvbn-ts/language-de'

const password = 'somePassword'
const userInput = []
const options = {
  translations: zxcvbnDePackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnDePackage.dictionary,
  },
}

zxcvbn(password, userInputs, options)
```
