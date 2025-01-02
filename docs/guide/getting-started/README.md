# Getting started
The `.mjs` build is for modern browsers and includes ES5 or higher.
If you want to use it and want to include your own polyfills, you need to transpile it within your build process.

## Installation

::: code-tabs#shell

@tab pnpm

pnpm create @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
@tab yarn

yarn create @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
@tab npm

npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
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

## Output

```
result.guesses            # estimated guesses needed to crack password
result.guessesLog10      # order of magnitude of result.guesses

result.crackTimes # dictionary of back-of-the-envelope crack time
                          # estimations, in seconds, based on a few scenarios:
{
  # online attack on a service that ratelimits password auth attempts.
  onlineThrottlingXPerHour

  # online attack on a service that doesn't ratelimit,
  # or where an attacker has outsmarted ratelimiting.
  onlineNoThrottlingXPerSecond

  # offline attack. assumes multiple attackers,
  # proper user-unique salting, and a slow hash function
  # w/ moderate work factor, such as bcrypt, scrypt, PBKDF2.
  offlineSlowHashingXPerSecond

  # offline attack with user-unique salting but a fast hash
  # function like SHA-1, SHA-256 or MD5. A wide range of
  # reasonable numbers anywhere from one billion - one trillion
  # guesses per second, depending on number of cores and machines.
  # ballparking at 10B/sec.
  offlineFastHashingXPerSecond
}

Every scenarios has a few properties
{
  # the seconds in which the password is cracked
  seconds 
  # with friendlier display string values: "less than a second", "3 hours", "centuries", etc.
  display 
  # the number which is used in the display to use a custom translation system and the default translation keys.
  base 
}


result.score      # Integer from 0-4 (useful for implementing a strength bar). Is configurable in the options with timeEstimationValues other wise a default value is used.

  0 # too guessable: risky password. (guesses < 10^3)

  1 # very guessable: protection from throttled online attacks. (guesses < 10^6)

  2 # somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)

  3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)

  4 # very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)

result.feedback   # verbal feedback to help choose better passwords. set when score <= 2.

  result.feedback.warning     # explains what's wrong, eg. 'this is a top-10 common password'.
                              # not always set -- sometimes an empty string

  result.feedback.suggestions # a possibly-empty list of suggestions to help choose a less
                              # guessable password. eg. 'Add another word or two'

result.sequence   # the list of patterns that zxcvbn based the
                  # guess calculation on.

result.calcTime  # how long it took zxcvbn to calculate an answer,
                  # in milliseconds.
```
