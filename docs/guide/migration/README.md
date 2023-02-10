# Migration

## `zxcvbn-ts 1.2.x` to `zxcvbn-ts 2.x.x`

To fix the typing for async and non async matcher we separated the matcher into two functions.
The non async original will be kept as `zxcvbn` and the async function will be named to `zxcvbnAsync`.
If you try to use an async matcher with the original function name it will throw an error.
This means if you don't have any async matcher in use you don't have to do anything. Maybe you can fix some types that were broken.

There is a new option for levenshtein calculation which can be activated to be stricter with the dictionary matcher.

- If you are using async matcher you need to move from `zxcvbn` to `zxcvnAsync`.
- `ZxcvbnOptions` export renamed to `zxcvbnOptions`
- `@zxcvbn-ts/matcher-pwned` needs `zxcvbnOptions` as the second parameter

## `zxcvbn-ts 0.3.x` to `zxcvbn-ts 1.x.x`

To decrease the bundle size of the core package the keyboard layout are now optional and can be customized.
This means that if you want to have the recommended scoring you need to add it to your `setOptions` call.

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  // The next line is now recommended to get a good scoring.
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

## `zxcvbn-ts 0.2.x` to `zxcvbn-ts 0.3.x`

We moved the options handling out of the **zxcvbn** call to improve performance.

Related [issue](https://github.com/zxcvbn-ts/zxcvbn/issues/31)

- @zxcvbn-ts/core has only named exports
- options need to be set by `zxcvbnOptions.setOptions`

Old

```js
import zxcvbn from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

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
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

The `zxcvbnOptions.setOptions` should be in another place as the **zxcvbn** call for example directly after you load your options.

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
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

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
