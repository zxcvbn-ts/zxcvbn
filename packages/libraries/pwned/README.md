# @zxcvbn-ts/matcher-pwned

The pwned matcher is an async matcher that will make a k-anonymity password request to the [have i been pwned](https://haveibeenpwned.com/) api.


## Installation

#### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned --save`

#### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const matcherPwned = matcherPwnedFactory(fetch)
const customMatcher = {
  pwned: matcherPwned
}

const zxcvbn = new ZxcvbnFactory(options, customMatcher)

const password = 'somePassword'
// @zxcvbn-ts/matcher-pwned is async so zxcvbn will return a promise
zxcvbn.checkAsync(password).then((result) => {
  
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

## Warning
Incremental searching involves performing a search for the password as each character is typed by the user, for example via an asynchronous request from their browser. [This may provide a 3rd party (namely someone with access to view inbound requests at Cloudflare) with the ability to observe the API requests with sufficient information to discern the original password being searched for.](https://blog.quarkslab.com/passbolt-a-bold-use-of-haveibeenpwned.html) Waiting until the entire password is entered before checking Pwned Passwords (for example, when [the blur event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) is raised on the password field), mitigates this risk.

Source: https://haveibeenpwned.com/api/v3#PwnedPasswordsIncrementalSearching
