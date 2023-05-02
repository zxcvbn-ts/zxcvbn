# @zxcvbn-ts/matcher-pwned

The pwned matcher is an async matcher that will make a k-anonymity password request to the [have i been pwned](https://haveibeenpwned.com/) api.


## Installation

#### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned --save`

#### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const password = 'somePassword'

const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
zxcvbnOptions.addMatcher('pwned', matcherPwned)

// @zxcvbn-ts/matcher-pwned is async so zxcvbn will return a promise
zxcvbn(password).then((result) => {
  
})
```

## Options

### fetch
This needs to be some fetch function either the default browser fetch or a fetch package from nodejs

### url
This is the url to the haveibeenpwned api. By default, it is set to `https://api.pwnedpasswords.com/range/`.
This option can be used if you don't trust haveibeenpwned and download their list to host your own instance of pwnedpasswords

### Can't resolve 'crypto' Error

If you get this error in node browser builds you can fix this by adding this to your package.json
```
"browser": {
"crypto": false
}
```
