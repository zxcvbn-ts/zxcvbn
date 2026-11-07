# Pwned matcher

`@zxcvbn-ts/matcher-pwned` is an async matcher that checks whether a password appeared in a data breach, using the [Have I Been Pwned](https://haveibeenpwned.com/Passwords) Pwned Passwords API.
A password found in a breach gets the score `0`, together with the `pwned` warning and suggestion.

## Installation

::: code-tabs

@tab npm

```shell
npm install @zxcvbn-ts/matcher-pwned
```

@tab yarn

```shell
yarn add @zxcvbn-ts/matcher-pwned
```

@tab pnpm

```shell
pnpm add @zxcvbn-ts/matcher-pwned
```
:::

## Usage

Add the matcher with the second parameter of `ZxcvbnFactory`, as in the [recommended setup](../getting-started/#recommended-setup).
Because it is asynchronous you have to use `checkAsync`; `check` [throws an error](../getting-started/#check-and-checkasync).

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const customMatchers = {
  pwned: matcherPwnedFactory(fetch, {
    // optional, see below
    url: 'https://api.pwnedpasswords.com/range/',
    networkErrorHandler: () => false,
  }),
}
const zxcvbn = new ZxcvbnFactory(options, customMatchers)

const result = await zxcvbn.checkAsync(password)
```

A match looks like this; `pwnedAmount` is how often the password appeared in breaches:

```js
// the amount is just an example, it grows with every new breach
{ pattern: 'pwned', pwnedAmount: 1234567, token: 'password', i: 0, j: 7 }
```

## How the password is checked

The password itself is never sent. The matcher hashes it with SHA-1 and only sends the first 5 characters of the hash to `${url}${prefix}`.
The API answers with every known hash suffix that starts with this prefix, and the matcher compares them with the rest of the hash locally ([k-anonymity](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange)).
The request sets the `Add-Padding: true` header, so the size of the response doesn't reveal anything either.

The hash is calculated with the Web Crypto API (`crypto.subtle`), which browsers only provide in secure contexts (HTTPS or localhost). In Node.js it needs the global `crypto` object, which Node.js 20 and later provide.
Passwords shorter than 2 characters are not checked.

## Options

```js
matcherPwnedFactory(fetch, config)
```

### fetch

A `fetch` implementation: the global `fetch` in browsers and Node.js 18+, or a fetch package on older Node.js versions.

### config

| Property              | Default                                 | Description                                                                                                              |
|-----------------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `url`                 | `https://api.pwnedpasswords.com/range/` | The range API endpoint. The hash prefix is appended to it. Use it to point to your own copy of the Pwned Passwords list. |
| `networkErrorHandler` | returns `false`                         | Called when the request fails, see below.                                                                                |

### networkErrorHandler

The handler is called with an `Error` when the request or reading the response fails, or with the `Response` when the API answers with a status of 400 or higher.

By default it returns `false`, which means the check **fails open**: if the API is not reachable, the password is rated as if the pwned matcher wasn't there, without any warning. A breached password can then get a better score than it should.
If that isn't acceptable for you, at least log the error, or throw it, so `checkAsync` rejects and you can handle it yourself:

```js
const customMatchers = {
  pwned: matcherPwnedFactory(fetch, {
    networkErrorHandler: (error) => {
      // log and continue without the pwned check
      console.warn('pwned check failed', error)
      return false
      // or let checkAsync reject
      // throw error instanceof Error ? error : new Error(`pwned check failed with ${error.status}`)
    },
  }),
}
```

## Check as late as possible

Don't run this matcher on every keystroke. Searching incrementally as the user types [can let a third party with access to the inbound requests (e.g. at Cloudflare) work out the password](https://blog.quarkslab.com/passbolt-a-bold-use-of-haveibeenpwned.html) ([source](https://haveibeenpwned.com/API/v3#PwnedPasswordsIncrementalSearching)).
Check once the whole password has been entered, for example on the [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event of the password field, or at least [debounce](../examples/#debounce) the check. This also keeps the number of API requests down.

## Using haveIBeenPwned directly

The package also exports the request function on its own, if you only want to know whether a password was breached, without the rest of zxcvbn-ts:

```js
import { haveIBeenPwned } from '@zxcvbn-ts/matcher-pwned'

const entry = await haveIBeenPwned(password, {
  universalFetch: fetch,
  // optional, same as above
  url: 'https://api.pwnedpasswords.com/range/',
  networkErrorHandler: () => false,
})
```

It resolves to:

- the matching line of the API response (`HASHSUFFIX:count`, e.g. `1E4C9B93F3F0682250B6CF8331B7EE68FD8:1234567` for `password`) if the password was found,
- `undefined` if it wasn't found,
- `null` if no fetch function was passed or the password is shorter than 2 characters,
- the return value of `networkErrorHandler` (`false` by default) if the request failed.
