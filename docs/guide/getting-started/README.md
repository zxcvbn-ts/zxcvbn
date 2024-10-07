# Getting started

## Installation

### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en --save`

### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en`

## Usage

### Bundler like webpack

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

We highly recommend always using the common and English language packages for the optimal scoring result.
If your language is available as a package, you should import it as well. If your language is missing, feel free to open a PR. For the time being, you could extend the default set.

The `esm` build is for modern browsers and includes ES5 or higher.
If you want to use it and want to include your own polyfills, you need to transpile it within your build process.

## Change prior to original library

- I18n support for feedback, dictionaries and keyboard patterns. By default, the feedback are keys now
- All dictionaries are optional, but the `en` dictionary is highly recommend (wished feature in some issues)
- Dictionaries are separate from the core library. This means zxcvbn-ts is relatively small without its dictionaries
- compress dictionaries for smaller bundle size => up to 33% smaller dictionaries while having more entries
- The project is a monorepo with a core library `@zxcvbn-ts/core` and language packages `@txcvbn-ts/language-en`.
- Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it.
  E.g., if you are developing a Russian website, you need to include a Cyrillic keyboard set. Create a PR so that others can benefit from it.
- You can use multiple keyboard layouts, which means that the library will check against them by default.
- the tests are Jest based, so we get a coverage score
- eslint/prettier for consistent code style
- Added static page docs https://zxcvbn-ts.github.io/zxcvbn/
- esm, commonJS
- Custom matcher can be added which means you can create your own matcher
- Async matcher can be added which means you can create a matcher that makes an API call
- [haveibeenpwned](https://haveibeenpwned.com/Passwords) matcher
- included debounce helper
- levenshtein check for the dictionaries
- diceware dictionary
- extended l33t matcher for substitutions like `|_| => u`
