# Migration Guide

This guide provides information on how to migrate between different versions of `zxcvbn-ts`.

## Table of Contents

- [3.x.x to 4.x.x](#3xx-to-4xx)
  - [Move from singleton options to class-based approach](#move-from-singleton-options-to-class-based-approach)
  - [Custom matcher setup changed](#custom-matcher-setup-changed)
  - [Scoring thresholds naming changed in the output](#scoring-thresholds-naming-changed-in-the-output)
  - [Language packages dictionary keys changed](#language-packages-dictionary-keys-changed)
  - [Distribution files changed extension](#distribution-files-changed-extension)
- [2.x.x to 3.x.x](#2xx-to-3xx)
- [1.2.x to 2.x.x](#12x-to-2xx)
- [0.3.x to 1.x.x](#03x-to-1xx)
- [0.2.x to 0.3.x](#02x-to-03x)
- [zxcvbn 4.4.2 to zxcvbn-ts 4.x.x](#migration-from-zxcvbn-4-4-2-to-zxcvbn-ts-4-x-x)

---

## 3.x.x to 4.x.x

### Move from singleton options to class-based approach

The previous singleton-based approach (`zxcvbnOptions.setOptions`) has been replaced by a class-based approach using `ZxcvbnFactory`. This allows for multiple instances with different configurations.

**Old (3.x.x):**
```ts
zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

**New (4.x.x):**
```ts
const zxcvbn = new ZxcvbnFactory(options, customMatcher)

// Synchronous check
const result = zxcvbn.check(password)

// Asynchronous check (required if using async matchers like pwned)
const asyncResult = await zxcvbn.checkAsync(password)
```


### Custom matcher setup changed

Generally, options no longer need to be transferred separately. Here is an example using the `pwned` matcher.

**Old (3.x.x):**
```ts
zxcvbnOptions.setOptions(options)

const pwnedOptions = {
  url: '...',
  networkErrorHandler: () => {}
}
const matcherPwned = matcherPwnedFactory(crossFetch, pwnedOptions)
zxcvbnOptions.addMatcher('pwned', matcherPwned)

zxcvbn(password)
```

**New (4.x.x):**
```ts
const pwnedConfig = {
  url: '...',
  networkErrorHandler: () => {}
}
const customMatcher = {
  pwned: matcherPwnedFactory(fetch, pwnedConfig),
}

const zxcvbn = new ZxcvbnFactory(options, customMatcher)
await zxcvbn.checkAsync(password)
```

### Scoring thresholds naming changed in the output

The output structure for crack times has been unified and renamed for better clarity.

**Old (3.x.x):**
```json
{
  "crackTimesSeconds": {
    "offlineFastHashing1e10PerSecond": 0.1,
    "offlineSlowHashing1e4PerSecond": 100
    // ...
  },
  "crackTimesDisplay": {
    "offlineFastHashing1e10PerSecond": "less than a second",
    "offlineSlowHashing1e4PerSecond": "1 minute"
    // ...
  }
}
```

**New (4.x.x):**
```json
{
  "crackTimes": {
    "onlineThrottlingXPerHour": {
      "base": null,
      "seconds": 3600,
      "display": "1 hour"
    },
    "onlineNoThrottlingXPerSecond": {
      "base": null,
      "seconds": 1,
      "display": "1 second"
    },
    "offlineSlowHashingXPerSecond": {
      "base": null,
      "seconds": 100,
      "display": "1 minute"
    },
    "offlineFastHashingXPerSecond": {
      "base": null,
      "seconds": 0.1,
      "display": "less than a second"
    }
  }
}
```

### Language packages dictionary keys changed

The dictionary keys in the language packages have changed from generic names to language-specific names (e.g., `commonWords-en` instead of `commonWords`) to prevent collisions when using multiple languages.

**Old (3.x.x):**
```ts
import { dictionary } from '@zxcvbn-ts/language-en'
/*
{
  commonWords: [...],
  firstnames: [...],
  lastnames: [...],
  wikipedia: [...]
}
*/
```

**New (4.x.x):**
```ts
import { dictionary } from '@zxcvbn-ts/language-en'
/*
{
  'commonWords-en': [...],
  'firstnames-en': [...],
  'lastnames-en': [...],
  'wikipedia-en': [...]
}
*/
```

Additionally, language packages now export `wordSequences`.

### Distribution files changed extension

The distribution files in the packages changed their extensions to follow Node.js ESM/CJS standards.

**Old:**
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ESM)

**New:**
- `dist/index.cjs` (CommonJS)
- `dist/index.mjs` (ESM)

---

## 2.x.x to 3.x.x

### Language packages no longer have a default export

**Old (2.x.x):**
```ts
import package from '@zxcvbn-ts/language-en'
```

**New (3.x.x):**
```ts
import { dictionary, translations } from '@zxcvbn-ts/language-en'
// or
import * as enPackage from '@zxcvbn-ts/language-en'
```

### Pwned matcher doesn't have a default export anymore

**Old (2.x.x):**
```ts
import matcherPwnedFactory from '@zxcvbn-ts/matcher-pwned'
```

**New (3.x.x):**
```ts
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'
```

---

## 1.2.x to 2.x.x

To fix typing for async and non-async matchers, we separated the logic into two functions.

- If you are using an async matcher (e.g., pwned), you **must** use `zxcvbnAsync`.
- `ZxcvbnOptions` export was renamed to `zxcvbnOptions`.
- `@zxcvbn-ts/matcher-pwned` now requires `zxcvbnOptions` as the second parameter.

---

## 0.3.x to 1.x.x

To decrease the bundle size of the core package, keyboard layouts are now optional and customizable. You need to add them to your `setOptions` call to maintain recommended scoring.

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  // Recommended to get accurate scoring for keyboard patterns
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
}

zxcvbnOptions.setOptions(options)
zxcvbn(password)
```

---

## 0.2.x to 0.3.x

Options handling was moved out of the `zxcvbn` call to improve performance (see [issue #31](https://github.com/zxcvbn-ts/zxcvbn/issues/31)).

- `@zxcvbn-ts/core` now has only named exports.
- Options must be set via `zxcvbnOptions.setOptions(options)`.

---

## Migration from zxcvbn 4.4.2 to zxcvbn-ts 4.x.x

This guide helps you migrate from the original `zxcvbn` (version 4.4.2) to the modern `zxcvbn-ts` (version 4.x.x).

### Why Migrate?

- **TypeScript Support**: Native type definitions for better developer experience.
- **Modular Architecture**: Dictionaries are separate packages, allowing you to reduce your bundle size by only including what you need.
- **Internationalization (i18n)**: Support for multiple languages, including translations for feedback.
- **Modern Standards**: Uses ESM/CJS standards and is optimized for modern build tools.
- **Extensibility**: Easily add custom matchers or extend existing logic.

### Key Differences

#### 1. Package Installation

The original `zxcvbn` was a single package. `zxcvbn-ts` is modular. You need to install the core package and the language packages you want to use.

**Old:**
```bash
npm install zxcvbn
```

**New:**
```bash
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```

#### 2. Initialization and Usage

In `zxcvbn` 4.4.2, you would import a single function. In `zxcvbn-ts` 4.x.x, you use `ZxcvbnFactory` to create an instance with your desired configuration.

**Old:**
```ts
import zxcvbn from 'zxcvbn'

const result = zxcvbn('password')
```

**New:**
```ts
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { adjacencyGraphs, dictionary } from '@zxcvbn-ts/language-common'
import { dictionary as enDictionary, translations } from '@zxcvbn-ts/language-en'

const options = {
  translations,
  graphs: adjacencyGraphs,
  dictionary: {
    ...dictionary,
    ...enDictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
const result = zxcvbn.check('password')
```

#### 3. Asynchronous Matching

If you use asynchronous matchers (like the Pwned matcher), you must use the `checkAsync` method.

**New:**
```ts
const result = await zxcvbn.checkAsync('password')
```

#### 4. Output Structure

The output structure is mostly compatible, but there are some changes in how crack times and feedback are handled to support internationalization and better clarity.

- **Feedback**: `warning` and `suggestions` are now translated if you provide `translations` in options.
- **Crack Times**: The naming has been unified under the `crackTimes` object.

**Old (zxcvbn 4.4.2):**
```json
{
  "crack_times_seconds": {
    "online_throttling_100_per_hour": 3600,
    ...
  },
  "crack_times_display": {
    "online_throttling_100_per_hour": "1 hour",
    ...
  }
}
```

**New (zxcvbn-ts 4.x.x):**
```json
{
  "crackTimes": {
    "onlineThrottlingXPerHour": {
      "seconds": 3600,
      "display": "1 hour",
      "base": null
    },
    ...
  }
}
```

#### 5. Custom Dictionaries and User Inputs

In `zxcvbn` 4.4.2, user inputs were passed as a second argument to the `zxcvbn` function. In `zxcvbn-ts`, they are part of the `dictionary` object in options, or can be passed to the `check` method.

**Old:**
```ts
zxcvbn('password', ['user', 'inputs'])
```

**New:**
```ts
// Option A: During factory creation
const options = {
  dictionary: {
    ...baseDictionaries,
    userInputs: ['user', 'inputs']
  }
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check('password')

// Option B: During check (on the fly)
zxcvbn.check('password', ['user', 'inputs'])
```

### Summary Table

| Feature | zxcvbn 4.4.2 | zxcvbn-ts 4.x.x |
| :--- | :--- | :--- |
| **Language** | JavaScript | TypeScript |
| **Bundle Size** | Fixed (~800KB) | Modular (Core is ~25KB) |
| **I18n** | English only | Multi-language support |
| **Async Support** | No | Yes (`checkAsync`) |
| **Setup** | Import and use | Factory-based configuration |

