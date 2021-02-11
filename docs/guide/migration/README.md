# Migration

## `zxcvbn 4.4.2` to `zxcvbn-ts 0.1.0`

- Everything is written in TypeScript, this should make it easier for other people to contribute and it will generate types that everybody can use.
- There are now some more options. This is how it changed

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
For example if you are from Germany you could also include the german package to improve efficiency.
You can even generate your own dictionaries if you want and include it.

- the userInputs options from before is now just a dictionary in the dictionary options with some special sanitizing.
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
  - the password list is newly generated this means that some passwords are at a different rank.
  - dates should be better recognized. At least the password list has more dates in them than before
  - Passwords as single tokens are now consistent rewarded for capitalization like in [#232](https://github.com/dropbox/zxcvbn/issues/232) described.
  - there are new keyboard layouts.
- the german language package should not be used without the english and common language package because it is not matured yet

