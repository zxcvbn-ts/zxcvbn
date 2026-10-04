# @zxcvbn-ts/language-common

The common dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-common --save`

#### yarn:

`yarn add @zxcvbn-ts/language-common`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

const password = 'somePassword'
const options = {
  ...zxcvbnCommonPackage,
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

- passwords.json is derived from Mark Burnett's ten million passwords release (https://medium.com/xato-security/today-i-am-releasing-ten-million-passwords-b6278bbe7495), as in the original zxcvbn: "Mark Burnett for releasing his 10M password corpus and for his 2005 book, Perfect Passwords: Selection, Protection, Authentication."
- diceware.json is the EFF wordlist from https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases, obtained via https://github.com/dmuth/diceware. The EFF website states that its original material is licensed under CC BY 4.0 (https://www.eff.org/copyright).

See NOTICE.md and THIRD_PARTY_LICENSES.md.
