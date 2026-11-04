# @zxcvbn-ts/matcher-pwned

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/matcher-pwned)](https://www.npmjs.com/package/@zxcvbn-ts/matcher-pwned)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/matcher-pwned)](https://bundlephobia.com/package/@zxcvbn-ts/matcher-pwned)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/matcher-pwned)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)

An async matcher for [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn) that checks whether a password appeared in a data breach, using the [Have I Been Pwned](https://haveibeenpwned.com/Passwords) Pwned Passwords API.

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Matcher guide](https://zxcvbn-ts.github.io/zxcvbn/guide/matcher/#zxcvbn-ts-matcher-pwned) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/)

The password never leaves the client. Only the first 5 characters of its SHA-1 hash are sent ([k-anonymity](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange)), and the request asks for padded responses so the response size doesn't reveal the match either. A password found in a breach is rated with a score of `0` and gets a warning and a suggestion.

## Installation

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/matcher-pwned
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}
const customMatchers = {
  pwned: matcherPwnedFactory(fetch, {}),
}
const zxcvbn = new ZxcvbnFactory(options, customMatchers)

// the pwned matcher is async, so use checkAsync instead of check
const result = await zxcvbn.checkAsync('somePassword')
```

## Options

```js
matcherPwnedFactory(fetch, config)
```

### `fetch`

A `fetch` implementation: the global `fetch` in browsers and Node.js 18+, or a fetch package on older Node.js versions.

### `config`

| Property              | Default                                  | Description                                                                                                                                          |
|-----------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`                 | `https://api.pwnedpasswords.com/range/`  | The range API endpoint. Point it to your own instance if you host a copy of the Pwned Passwords list instead of calling Have I Been Pwned directly. |
| `networkErrorHandler` | returns `false`                          | Called with the `Error` or failed `Response` when the request fails. The default silently skips the pwned check.                                    |

## Check as late as possible

Don't run this matcher on every keystroke. Searching incrementally as the user types [can let a third party with access to the inbound requests (e.g. at Cloudflare) work out the password](https://blog.quarkslab.com/passbolt-a-bold-use-of-haveibeenpwned.html) ([source](https://haveibeenpwned.com/API/v3#PwnedPasswordsIncrementalSearching)). Check once the whole password has been entered, for example on the [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event of the password field, or at least [debounce](https://zxcvbn-ts.github.io/zxcvbn/guide/examples/#debounce) the check.

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)
