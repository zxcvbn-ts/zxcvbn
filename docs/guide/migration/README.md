# Migration

## `zxcvbn-ts 0.2.x` to `zxcvbn-ts 0.3.x`

We moved the options handling out of the **zxcvbn** call to improve performance. 

Related [issue](https://github.com/zxcvbn-ts/zxcvbn/issues/31)

- @zxcvbn-ts/core has only named exports
- options need to be set by `ZxcvbnOptions.setOptions`

Old

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbn(password, options)
```

New

```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```

The `ZxcvbnOptions.setOptions` should be in another place as the **zxcvbn** call for example directly after you load your options.

## `zxcvbn 4.4.2` to `zxcvbn-ts 0.1.0`

- Everything is written in TypeScript, this should make it easier for other people to contribute, and it will generate types that everybody can use.
- There are now some more options. This is how it changed:

Old

```js
import zxcvbn from 'zxcvbn'

const password = 'somePassword'
zxcvbn(password)
```

New

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbn(password, options)
```

It is a lot more but this is the configuration to improve the handling. This way you could add some more dictionaries.
E.g. if you are from Germany you could also include the German package to improve efficacy.
You can even generate your own dictionaries and include them.

- the userInputs options from before is now just a dictionary in the dictionary part of options with specific sanitizing.
  If you are using it you need to move the parameter into the options like this:

```js
import zxcvbn from '@zxcvbn-ts/core'

const password = 'somePassword'
const options = {
  dictionary: {
    userInputs: ['someEmail@email.de'],
  },
}

zxcvbn(password, options)
```
- there are a few things that will slightly change the password crack estimation:
  - the password list is newly generated: this means that some passwords are in a different rank.
  - dates should be recognized better
  - passwords as single tokens are now consistently ranked better for capitalization like in [#232](https://github.com/dropbox/zxcvbn/issues/232) described.
  - there are new keyboard layouts.
- the german language package should not be used without the english and common language package because it is not matured yet

