# Getting started

## Install

### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en --save`

### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en`

## Usage

### Bundler like webpack
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

### As script tag
For example with the CDN jsdelivr
```
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@zxcvbn-ts/core@0.2.0/dist/zxcvbn-ts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-common@0.2.0/dist/zxcvbn-ts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-en@0.2.0/dist/zxcvbn-ts.js"></script>
  </head>
  <body>
    <script>
      ;(function () {
        // all package will be available under zxcvbnts
        const options = {
          translations: zxcvbnts['language-en'].translations,
          dictionary: {
            ...zxcvbnts['language-common'].dictionary,
            ...zxcvbnts['language-en'].dictionary,
          },
        }
        console.log(zxcvbnts.core('somePassword', options))
      })()
    </script>
  </body>
</html>
```

## Output

```
result.guesses            # estimated guesses needed to crack password
result.guessesLog10      # order of magnitude of result.guesses

result.crackTimesSeconds # dictionary of back-of-the-envelope crack time
                          # estimations, in seconds, based on a few scenarios:
{
  # online attack on a service that ratelimits password auth attempts.
  onlineThrottling100PerHour

  # online attack on a service that doesn't ratelimit,
  # or where an attacker has outsmarted ratelimiting.
  onlineNoThrottling10PerSecond

  # offline attack. assumes multiple attackers,
  # proper user-unique salting, and a slow hash function
  # w/ moderate work factor, such as bcrypt, scrypt, PBKDF2.
  offlineSlowHashing1e4PerSecond

  # offline attack with user-unique salting but a fast hash
  # function like SHA-1, SHA-256 or MD5. A wide range of
  # reasonable numbers anywhere from one billion - one trillion
  # guesses per second, depending on number of cores and machines.
  # ballparking at 10B/sec.
  offlineFastHashing1e10PerSecond
}

result.crackTimesDisplay # same keys as result.crackTimesSeconds,
                           # with friendlier display string values:
                           # "less than a second", "3 hours", "centuries", etc.

result.score      # Integer from 0-4 (useful for implementing a strength bar)

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

We highly recommend to always use the common and english language package for a useful scoring result.
If your own language is available as a package you should include it as well. If your language is missing feel free to open a PR, in the meantime you can extend the default set.

The `esm` build is for modern browser and includes ES5 or higher.
If you want to use it and want to include own polyfills you need to transpile it within your build process.

## Change prior to original library
- I18n support for feedback and dictionaries. By default, the feedback are keys now
- All dictionaries are optional but highly recommend (wished feature in some issues)
- Dictionaries are separated from the core library. This means zxcvbn-ts is relative small without dictionaries
- The project is a monorepo with a core library `@zxcvbn-ts/core` and language packages `@txcvbn-ts/language-en`. At the beginning, there is only a German and English language package.
- Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it. For example if you develop a Russian website the keyboard layouts are pretty much useless. 
  Now you could add a Russian keyboard layout by yourself for a fast implementation and create a PR for the long run.
- Multiple keyboard layouts are used which means that every layout that is added to the library will be checked against by default.
- Tests are now made with jest, so we get a coverage
- Included eslint/prettier for consistent code
- Added static-page docs https://zxcvbn-ts.github.io/zxcvbn/
- There is an esm, commonJS and browser build use it as needed
