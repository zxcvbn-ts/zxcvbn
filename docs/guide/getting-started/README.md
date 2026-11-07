# Getting started

Every package ships an ESM build (`dist/index.mjs`) and a CommonJS build (`dist/index.cjs`), both compiled to ES2018 without polyfills.
If you need to support older browsers, transpile the packages and add the needed polyfills within your build process.

## Installation
::: code-tabs

@tab npm

```shell
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```

@tab yarn

```shell
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```

@tab pnpm

```shell
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```
:::
## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Recommended setup

This is the setup the rest of the guide refers to. It follows the [best practices](../best-practices/): the common and English packages plus the language of your users, the keyboard layouts, the Levenshtein distance check, and the optional [pwned matcher](../pwned-matcher/).
Create the instance once, in its own module, and import it wherever you check passwords.

```ts
// zxcvbn.ts
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import type { OptionsType } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
// the language of your users, if there is a package for it
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'
// optional, needs `npm install @zxcvbn-ts/matcher-pwned`
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const options: OptionsType = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnDePackage.dictionary,
    // words that belong to your application, e.g. its name
    userInputs: ['yourAppName'],
  },
  useLevenshteinDistance: true,
}

const customMatchers = {
  pwned: matcherPwnedFactory(fetch),
}

export const zxcvbn = new ZxcvbnFactory(options, customMatchers)
```

```ts
import { zxcvbn } from './zxcvbn'

// pass the user's own data, so a password built from it isn't overestimated
const result = await zxcvbn.checkAsync(password, [username, email])
```

The dictionaries are large, so in a browser you should [lazy load](../lazy-loading/) them, and if you check while the user types, [debounce](../examples/) the check.

## check and checkAsync

`check` is synchronous and `checkAsync` returns a promise. Both take the password and optional [user inputs](../filtering-custom-words/), and return the same [result](#output).

As soon as one matcher is asynchronous, like the [pwned matcher](../pwned-matcher/), you have to use `checkAsync`. `check` throws this error instead of returning a result:

```
You are using a Promised matcher, please use `checkAsync` for it.
```

Without asynchronous matchers both work, so `checkAsync` is the safe choice if you might add one later.
Invalid options throw an error when the `ZxcvbnFactory` is created, see [option validation](../options/#validation).

## Output

`check` and `checkAsync` return a `ZxcvbnResult`:

```ts
interface ZxcvbnResult {
  // the password that was checked, cut to `maxLength`
  password: string
  // estimated guesses needed to crack the password
  guesses: number
  // order of magnitude of guesses
  guessesLog10: number
  // Integer from 0-4 (useful for implementing a strength bar).
  // The thresholds are configurable with the `timeEstimationValues` option, by default:
  // 0 too guessable: risky password. (guesses < 10^3)
  // 1 very guessable: protection from throttled online attacks. (guesses < 10^6)
  // 2 somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
  // 3 safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
  // 4 very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
  score: 0 | 1 | 2 | 3 | 4
  // back-of-the-envelope crack time estimations based on a few scenarios
  crackTimes: {
    // online attack on a service that ratelimits password auth attempts.
    onlineThrottlingXPerHour: CrackTime
    // online attack on a service that doesn't ratelimit,
    // or where an attacker has outsmarted ratelimiting.
    onlineNoThrottlingXPerSecond: CrackTime
    // offline attack. assumes multiple attackers,
    // proper user-unique salting, and a slow hash function
    // w/ moderate work factor, such as bcrypt, scrypt, PBKDF2.
    offlineSlowHashingXPerSecond: CrackTime
    // offline attack with user-unique salting but a fast hash
    // function like SHA-1, SHA-256 or MD5. A wide range of
    // reasonable numbers anywhere from one billion - one trillion
    // guesses per second, depending on number of cores and machines.
    // ballparking at 10B/sec.
    offlineFastHashingXPerSecond: CrackTime
  }
  // verbal feedback to help choose better passwords.
  // For a score above 2 the warning is null and the suggestions are empty.
  feedback: {
    // explains what's wrong, eg. 'this is a top-10 common password'. Can be null
    warning: string | null
    // a possibly-empty list of suggestions to help choose a less
    // guessable password. eg. 'Add another word or two'
    suggestions: string[]
  }
  // the list of patterns that zxcvbn based the guess calculation on.
  sequence: MatchExtended[]
  // how long it took zxcvbn to calculate an answer, in milliseconds.
  calcTime: number
}

interface CrackTime {
  // the seconds in which the password is cracked
  seconds: number
  // friendlier display string: "less than a second", "3 hours", "centuries", etc.
  display: string
  // the number used in the display, to use it with your own translation system and the default translation keys.
  // null for "less than a second" and "centuries"
  base: number | null
}
```
