# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.1.2...@zxcvbn-ts/core@4.2.0) (2026-08-12)

### Bug Fixes

- **separator:** escape regex special characters in separators. `.` and `|` separators were not recognised (`.` acted as a wildcard), so passwords like `first.second.third` were rated stronger than they are, and passwords containing two or more backslashes threw an "Invalid regular expression" error ([#339](https://github.com/zxcvbn-ts/zxcvbn/issues/339)) ([557b595](https://github.com/zxcvbn-ts/zxcvbn/commit/557b5957b22ee38e1578a5bc7982c38d4b80dd86))
- **feedback:** stop sharing one mutable default feedback object between checks. Suggestions could pile up across calls (e.g. repeated "anotherWord" for custom matchers without feedback) and returned feedback objects were shared ([#340](https://github.com/zxcvbn-ts/zxcvbn/issues/340)) ([6771284](https://github.com/zxcvbn-ts/zxcvbn/commit/6771284a33b8f42e883d0da5ea8f84810effe07d))

### Features

- **options:** validate options at runtime. Invalid `l33tTable`, `dictionary`, `graphs`, `useLevenshteinDistance`, `levenshteinThreshold`, `l33tMaxSubstitutions`, `maxLength`, custom matchers or translations now throw in the `ZxcvbnFactory` constructor ([#334](https://github.com/zxcvbn-ts/zxcvbn/issues/334)) ([ac667c6](https://github.com/zxcvbn-ts/zxcvbn/commit/ac667c634fd00ce8ee22a5e368e14b496969eb94))

### Performance Improvements

- **scoring:** roughly halve the scoring time for long passwords ([#335](https://github.com/zxcvbn-ts/zxcvbn/issues/335)) ([59333b6](https://github.com/zxcvbn-ts/zxcvbn/commit/59333b6697207ab63ff430fea8946be0e92cc15e))

## [4.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.1.1...@zxcvbn-ts/core@4.1.2) (2026-06-16)

**Note:** Version bump only for package @zxcvbn-ts/core

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.1.0...@zxcvbn-ts/core@4.1.1) (2026-06-13)

**Note:** Version bump only for package @zxcvbn-ts/core

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.4...@zxcvbn-ts/core@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Bug Fixes

- **dictionary:** `userInputs` passed to a check are no longer added permanently to the shared dictionary, so they no longer leak into later checks ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([f1c2af7](https://github.com/zxcvbn-ts/zxcvbn/commit/f1c2af7d032a73e4829340c98a65035d3a53b120))
- **l33t:** use levenshtein distance for every full l33t substitution, not only the first one. This can change scores for l33t passwords ([#245](https://github.com/zxcvbn-ts/zxcvbn/issues/245)) ([846794e](https://github.com/zxcvbn-ts/zxcvbn/commit/846794e771be4b6b624770fba32d26439a74f5da))
- **feedback:** show feedback warnings for dictionaries named "names" ([#266](https://github.com/zxcvbn-ts/zxcvbn/issues/266)) ([062aa4a](https://github.com/zxcvbn-ts/zxcvbn/commit/062aa4a9e3e392bddc84906294603653788517ef))

### Features

- **matcher:** add a word sequence matcher (`wordSequence` pattern, `WordSequenceMatch` type) that detects passwords built from common word lists. Word sequence dictionaries are found by name prefix, so language specific keys like `diceware-common` work. Passphrases made of common words now score lower. The `Options` type is exported again ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))
- **scoring:** make the time estimation values configurable with the `timeEstimationValues` option. Values below the defaults (scoring 1e3, 1e6, 1e8, 1e10; attack times 100/h, 10/s, 1e4/s, 1e10/s) throw an error ([#250](https://github.com/zxcvbn-ts/zxcvbn/issues/250)) ([6738eb6](https://github.com/zxcvbn-ts/zxcvbn/commit/6738eb61900824d7470025191e22a9989912eade))
- **scoring:** add a `base` value to every crack time ([#253](https://github.com/zxcvbn-ts/zxcvbn/issues/253)) ([cd6f4ea](https://github.com/zxcvbn-ts/zxcvbn/commit/cd6f4ea53a94a0ac76de4bd3faef7c44842af433))
- **dictionary:** support language specific dictionary names. `DictionaryMatch.dictionaryName` is now `DictionaryNames | string`, and feedback matches dictionary names by substring (passwords, wikipedia, lastnames/firstnames, userInputs) ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))
- **translations:** support function based pluralization in `timeEstimation` translations. Plural keys accept `(value) => string`, singular keys stay strings ([#312](https://github.com/zxcvbn-ts/zxcvbn/issues/312)) ([01ece9e](https://github.com/zxcvbn-ts/zxcvbn/commit/01ece9e8ad7bf356637c82451fedae8816c20930))

### Performance Improvements

- **core:** reuse the matching, feedback and time estimation instances per factory instead of rebuilding them on every check ([4fc31f3](https://github.com/zxcvbn-ts/zxcvbn/commit/4fc31f33f790b249a69eefc9bd0b7dd7c9c44237))

### BREAKING CHANGES

- **core:** the `zxcvbnOptions` singleton and the `zxcvbn()` / `zxcvbnAsync()` functions are replaced by `new ZxcvbnFactory(options, customMatchers)` with `.check(password, userInputs)` and `.checkAsync(password, userInputs)`. `check()` now also truncates the password to `maxLength`, like the async variant already did ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3)) ([8c2e009](https://github.com/zxcvbn-ts/zxcvbn/commit/8c2e00994dda7933970202695aa84075f70bc454))
- **matcher:** custom matchers must extend `MatcherBaseClass`, and `Matcher.Matching` is typed as `MatcherConstructor`. The options are passed explicitly: `DefaultFeedbackFunction` is now `(options, match, isSoleMatch)`, `DefaultScoringFunction` is now `(match, options)`, and `MatchOptions` gains `userInputsOptions` ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))
- **scoring:** `crackTimesSeconds` and `crackTimesDisplay` are merged into `crackTimes`. Each of `onlineThrottlingXPerHour`, `onlineNoThrottlingXPerSecond`, `offlineSlowHashingXPerSecond` and `offlineFastHashingXPerSecond` is now `{ base, seconds, display }` ([#253](https://github.com/zxcvbn-ts/zxcvbn/issues/253)) ([53f4e73](https://github.com/zxcvbn-ts/zxcvbn/commit/53f4e731f02ff147bb3eda7e9cd1d4e6f3f2331e))
- **scoring:** the scoring thresholds are renamed as part of the new `timeEstimationValues` option ([#250](https://github.com/zxcvbn-ts/zxcvbn/issues/250)) ([6738eb6](https://github.com/zxcvbn-ts/zxcvbn/commit/6738eb61900824d7470025191e22a9989912eade))
- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The minified CDN build `dist/zxcvbn-ts.min.js` is no longer shipped; the IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.0.0-beta.3...@zxcvbn-ts/core@4.0.0-beta.4) (2026-05-13)

### Features

- **translations:** support function based pluralization in `timeEstimation` translations. Plural keys accept `(value) => string`, singular keys stay strings ([#312](https://github.com/zxcvbn-ts/zxcvbn/issues/312)) ([01ece9e](https://github.com/zxcvbn-ts/zxcvbn/commit/01ece9e8ad7bf356637c82451fedae8816c20930))

### Performance Improvements

- **core:** reuse the matching, feedback and time estimation instances per factory instead of rebuilding them on every check ([4fc31f3](https://github.com/zxcvbn-ts/zxcvbn/commit/4fc31f33f790b249a69eefc9bd0b7dd7c9c44237))

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.0.0-beta.2...@zxcvbn-ts/core@4.0.0-beta.3) (2026-03-04)

### Features

- **matcher:** add a word sequence matcher (`wordSequence` pattern, `WordSequenceMatch` type) that detects passwords built from common word lists, and export the `Options` type again ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

### BREAKING CHANGES

- **matcher:** custom matchers must extend `MatcherBaseClass`, and `Matcher.Matching` is now typed as `MatcherConstructor` (replaces `MatchingType`) ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.0.0-beta.1...@zxcvbn-ts/core@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.0.0-beta.0...@zxcvbn-ts/core@4.0.0-beta.1) (2024-09-30)

**Note:** Version bump only for package @zxcvbn-ts/core

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.4...@zxcvbn-ts/core@4.0.0-beta.0) (2024-07-31)

### Bug Fixes

- **dictionary:** `userInputs` passed to a check are no longer added permanently to the shared dictionary, so they no longer leak into later checks ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([f1c2af7](https://github.com/zxcvbn-ts/zxcvbn/commit/f1c2af7d032a73e4829340c98a65035d3a53b120))
- **l33t:** use levenshtein distance for every full l33t substitution, not only the first one ([#245](https://github.com/zxcvbn-ts/zxcvbn/issues/245)) ([846794e](https://github.com/zxcvbn-ts/zxcvbn/commit/846794e771be4b6b624770fba32d26439a74f5da))
- **feedback:** show feedback warnings for dictionaries named "names" ([#266](https://github.com/zxcvbn-ts/zxcvbn/issues/266)) ([062aa4a](https://github.com/zxcvbn-ts/zxcvbn/commit/062aa4a9e3e392bddc84906294603653788517ef))

### Features

- **scoring:** make the time estimation values configurable with the `timeEstimationValues` option. Values below the defaults (scoring 1e3, 1e6, 1e8, 1e10; attack times 100/h, 10/s, 1e4/s, 1e10/s) throw an error ([#250](https://github.com/zxcvbn-ts/zxcvbn/issues/250)) ([6738eb6](https://github.com/zxcvbn-ts/zxcvbn/commit/6738eb61900824d7470025191e22a9989912eade))
- **scoring:** add a `base` value to every crack time ([#253](https://github.com/zxcvbn-ts/zxcvbn/issues/253)) ([cd6f4ea](https://github.com/zxcvbn-ts/zxcvbn/commit/cd6f4ea53a94a0ac76de4bd3faef7c44842af433))
- **dictionary:** support language specific dictionary names. `DictionaryMatch.dictionaryName` is now `DictionaryNames | string`, and feedback matches dictionary names by substring (passwords, wikipedia, lastnames/firstnames, userInputs) ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### BREAKING CHANGES

- **core:** the `zxcvbnOptions` singleton and the `zxcvbn()` / `zxcvbnAsync()` functions are replaced by `new ZxcvbnFactory(options, customMatchers)` with `.check(password, userInputs)` and `.checkAsync(password, userInputs)`. `check()` now also truncates the password to `maxLength`, like the async variant already did ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3)) ([8c2e009](https://github.com/zxcvbn-ts/zxcvbn/commit/8c2e00994dda7933970202695aa84075f70bc454))
- **matcher:** the custom matcher API takes the options explicitly: `DefaultFeedbackFunction` is now `(options, match, isSoleMatch)`, `DefaultScoringFunction` is now `(match, options)`, `MatchingType` is now `new (options) => ...`, and `MatchOptions` gains `userInputsOptions` ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3))
- **scoring:** `crackTimesSeconds` and `crackTimesDisplay` are merged into `crackTimes`. Each of `onlineThrottlingXPerHour`, `onlineNoThrottlingXPerSecond`, `offlineSlowHashingXPerSecond` and `offlineFastHashingXPerSecond` is now `{ base, seconds, display }` ([#253](https://github.com/zxcvbn-ts/zxcvbn/issues/253)) ([53f4e73](https://github.com/zxcvbn-ts/zxcvbn/commit/53f4e731f02ff147bb3eda7e9cd1d4e6f3f2331e))
- **scoring:** the scoring thresholds are renamed as part of the new `timeEstimationValues` option ([#250](https://github.com/zxcvbn-ts/zxcvbn/issues/250)) ([6738eb6](https://github.com/zxcvbn-ts/zxcvbn/commit/6738eb61900824d7470025191e22a9989912eade))

## [3.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.3...@zxcvbn-ts/core@3.0.4) (2023-09-17)

### Bug Fixes

- **core:** resolve performance issue with l33t matcher ([3c02020](https://github.com/zxcvbn-ts/zxcvbn/commit/3c02020d002659d7d092b82a2bab6fda1bcc763a))
- **project:** resolve type issues ([5797375](https://github.com/zxcvbn-ts/zxcvbn/commit/57973751c169b6797caac78065807cf0b24e3480))

## [3.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.2...@zxcvbn-ts/core@3.0.3) (2023-07-17)

### Bug Fixes

- **regex-matcher:** process all entries found by regex matcher ([8033567](https://github.com/zxcvbn-ts/zxcvbn/commit/80335670516ac14634c9557ffca5e5c03bdcfcdf))
- **separator:** use missing separator scoring in estimation ([da2a834](https://github.com/zxcvbn-ts/zxcvbn/commit/da2a834ba6a7ff489a8b713147a8f5e638d1ed00))
- **spatial:** set correct default value for spatial turns ([0fa987d](https://github.com/zxcvbn-ts/zxcvbn/commit/0fa987d51c6b2a43ca05617c2cfe6676692a922c))
- **unmunger:** fix l33t match boundaries with uneven substitutions before the match ([#215](https://github.com/zxcvbn-ts/zxcvbn/issues/215)) ([0ebc6ff](https://github.com/zxcvbn-ts/zxcvbn/commit/0ebc6ff1fb909e50678d07868cba61531da9f25f))

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.1...@zxcvbn-ts/core@3.0.2) (2023-06-06)

### Bug Fixes

- **separator:** stop using lookbehind as the browser support is lacking ([fe0a0aa](https://github.com/zxcvbn-ts/zxcvbn/commit/fe0a0aa6a87e8beb364319b857dd16a881c146ea))
- **unmunger:** Allow multiple variants for substitution, get substituted passwords first ([#206](https://github.com/zxcvbn-ts/zxcvbn/issues/206)) ([d3a12a1](https://github.com/zxcvbn-ts/zxcvbn/commit/d3a12a11f2b25976ba2180664ff3e86718cbb0b7)), closes [#204](https://github.com/zxcvbn-ts/zxcvbn/issues/204)
- **user-inputs:** resolve memory leak with user inputs on the fly ([3f9bed2](https://github.com/zxcvbn-ts/zxcvbn/commit/3f9bed21b5d01f6f6863476822ca857355fba22f))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@3.0.0...@zxcvbn-ts/core@3.0.1) (2023-05-10)

### Bug Fixes

- **separator:** remove separator estimate special ([50f13e2](https://github.com/zxcvbn-ts/zxcvbn/commit/50f13e205f2c2141408fe6629ebaa75207b8a6cd))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.2.1...@zxcvbn-ts/core@3.0.0) (2023-05-07)

### Bug Fixes

- **matcher:** Separator matching cleanup ([#195](https://github.com/zxcvbn-ts/zxcvbn/issues/195)) ([e7e6908](https://github.com/zxcvbn-ts/zxcvbn/commit/e7e6908e223c4c93c4f5e9a510612d482cf98972))
- **languages:** makes language packages tree shakeable ([#176](https://github.com/zxcvbn-ts/zxcvbn/issues/176)) ([3be6ae2](https://github.com/zxcvbn-ts/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#175](https://github.com/zxcvbn-ts/zxcvbn/issues/175)

### Features

- **dictionary:** add diceware dictionary scoring ([#179](https://github.com/zxcvbn-ts/zxcvbn/issues/179)) ([5c5a74a](https://github.com/zxcvbn-ts/zxcvbn/commit/5c5a74ab2b77c58bfd1c3821d813fd59474e08e7))
- **dictionary:** levenshtein distance performance optimization ([#189](https://github.com/zxcvbn-ts/zxcvbn/issues/189)) ([3238a6b](https://github.com/zxcvbn-ts/zxcvbn/commit/3238a6be46319e62d469346612d4035234e01048))
- **index:** export all types from index ([#191](https://github.com/zxcvbn-ts/zxcvbn/issues/191)) ([38191d5](https://github.com/zxcvbn-ts/zxcvbn/commit/38191d596025fc49f00e8f8a1289c14a0abb1934))
- **matcher:** add Separator matcher ([#195](https://github.com/zxcvbn-ts/zxcvbn/issues/195)) ([cc9e0b4](https://github.com/zxcvbn-ts/zxcvbn/commit/cc9e0b41d779cb537f7ff125287500346d2f9949))

### BREAKING CHANGES

- Language packages no longer has a default export.
- pwned matcher packages no longer has a default export.
- new matcher can alter scoring

## [2.2.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.2.0...@zxcvbn-ts/core@2.2.1) (2023-02-06)

### Bug Fixes

- **debounce:** third parameter is not required ([6b5f90c](https://github.com/zxcvbn-ts/zxcvbn/commit/6b5f90c6070a41fe0fc0db79176a2f946c125a72))
- **js:** resolve issue with max stack size ([ce8b745](https://github.com/zxcvbn-ts/zxcvbn/commit/ce8b745fecc80b873231a0b8e29e1c6ffb6ec2f7))
- **main:** limit the used password string length to prevent redos attacks ([74315e9](https://github.com/zxcvbn-ts/zxcvbn/commit/74315e98e3206a94bf908a13fcd7f96b216f2173))

# [2.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.1.0...@zxcvbn-ts/core@2.2.0) (2023-01-27)

### Bug Fixes

- **l33t:** resolve dos with l33t attack ([4b1fd17](https://github.com/zxcvbn-ts/zxcvbn/commit/4b1fd17495979892968ffeea4b9e25d00a8c396d))
- **pwned:** resolve paths so they are usable ([d5737aa](https://github.com/zxcvbn-ts/zxcvbn/commit/d5737aa82ddea0928db4997f587ceee302ff79a3))

### Features

- **scoring:** strictly type score ([41b658d](https://github.com/zxcvbn-ts/zxcvbn/commit/41b658da9b71431f4efdf3a467e292ba7179e047))

# [2.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.5...@zxcvbn-ts/core@2.1.0) (2022-10-18)

### Features

- **add-matcher:** add name for matcher warning ([f6ec48f](https://github.com/zxcvbn-ts/zxcvbn/commit/f6ec48f0bbe8e8b5225ac83b664d18349e45125e))

## [2.0.5](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.4...@zxcvbn-ts/core@2.0.5) (2022-09-12)

**Note:** Version bump only for package @zxcvbn-ts/core

## [2.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.3...@zxcvbn-ts/core@2.0.4) (2022-08-04)

### Bug Fixes

- **types:** set correct sequence type ([c9d6a65](https://github.com/zxcvbn-ts/zxcvbn/commit/c9d6a6508e76133f2691eb9595ddc50ebd176982))

## [2.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.2...@zxcvbn-ts/core@2.0.3) (2022-07-17)

### Bug Fixes

- **levenshtein:** move levenshtein dependency into project ([0f3f0ef](https://github.com/zxcvbn-ts/zxcvbn/commit/0f3f0ef3782f2a12eca0a878c65249d4fbf74c72))

## [2.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.1...@zxcvbn-ts/core@2.0.2) (2022-07-17)

### Bug Fixes

- **const:** set correct names for one lower/upper case ([d920247](https://github.com/zxcvbn-ts/zxcvbn/commit/d920247f4af7eb1b607022270642d302c5f937f6))
- **date-splits:** add missing date split in 5 and add comments ([3694724](https://github.com/zxcvbn-ts/zxcvbn/commit/3694724173ec24dda98993b8a206f11b2720b62b))

## [2.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@2.0.0...@zxcvbn-ts/core@2.0.1) (2022-03-17)

**Note:** Version bump only for package @zxcvbn-ts/core

# [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@1.2.0...@zxcvbn-ts/core@2.0.0) (2022-02-09)

### Bug Fixes

- **translations:** transfer ZxcvbnOptions as parameter ([3ff0f75](https://github.com/zxcvbn-ts/zxcvbn/commit/3ff0f751890a24b8cbb39aad78875e13ed5e6b6d))

### Features

- **core:** add debounce helper ([5b41bcd](https://github.com/zxcvbn-ts/zxcvbn/commit/5b41bcd976b642f42f8873db5472094f687d0353))
- **dictionary:** add levenshtein distance ([475dc76](https://github.com/zxcvbn-ts/zxcvbn/commit/475dc766ca0ae8855c49658abfc57a66c7b92924))
- **dictionary:** set levenshtein vars over setOptions ([1121d84](https://github.com/zxcvbn-ts/zxcvbn/commit/1121d8408bc03017a08c0a97615ec837c07bab4b))
- **dictionary:** set rank for levenshtein matches ([ab453e3](https://github.com/zxcvbn-ts/zxcvbn/commit/ab453e329e6bb64b19460e965ce378d7a93c0811))

# [1.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@1.1.0...@zxcvbn-ts/core@1.2.0) (2021-12-15)

### Bug Fixes

- **pwned:** resolve repeat can be async too ([05298b1](https://github.com/zxcvbn-ts/zxcvbn/commit/05298b107085dfd1ca7a1914f4ac81443dcd6a39))
- **pwned:** resolve type issue ([d593332](https://github.com/zxcvbn-ts/zxcvbn/commit/d5933321bbb607ced1d7b54dc6c49f77352234ad))

### Features

- **project:** Add HaveIBeenPwned matcher ([#66](https://github.com/zxcvbn-ts/zxcvbn/issues/66)) ([5c4141c](https://github.com/zxcvbn-ts/zxcvbn/commit/5c4141cd34f6566fe753ce76572f74bb8229b414))

# [1.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@1.0.0...@zxcvbn-ts/core@1.1.0) (2021-12-14)

### Features

- **dictionary:** add parameter to add userInputs on the fly ([df3d6f5](https://github.com/zxcvbn-ts/zxcvbn/commit/df3d6f5fae1edf3b921a746f5f196a574d365809))
- **matcher:** add optional have i been pwned matcher ([5685a2c](https://github.com/zxcvbn-ts/zxcvbn/commit/5685a2c9b234f04006e8546e1cc909a313def2bb))
- **project:** explain async behaviour ([9fd8d5c](https://github.com/zxcvbn-ts/zxcvbn/commit/9fd8d5c79bb90d35bae54e5f980993a2d38d79f8))
- **project:** export ZxcvbnResult type ([632ab81](https://github.com/zxcvbn-ts/zxcvbn/commit/632ab81e154906f9e151e84e9a3e3c125fd66add))
- **project:** move pwned matcher into own package ([26290d7](https://github.com/zxcvbn-ts/zxcvbn/commit/26290d7ac43174ca9fcecabc5869b79965702cc3))

# [1.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@1.0.0-beta.0...@zxcvbn-ts/core@1.0.0) (2021-11-03)

### Features

- **matcher:** add support for async matcher ([8b73e31](https://github.com/zxcvbn-ts/zxcvbn/commit/8b73e3177ef6bf38b35d129f722d67fb11f18683))
- **options:** addMatcher only informs instead of error for available matcher ([160ac97](https://github.com/zxcvbn-ts/zxcvbn/commit/160ac9784f06bdf616bde5b5b0ba5ee57a2c9968))

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.3.0...@zxcvbn-ts/core@1.0.0-beta.0) (2021-06-09)

### Bug Fixes

- **main:** fix internal match types ([#41](https://github.com/zxcvbn-ts/zxcvbn/issues/41)) ([968e5d5](https://github.com/zxcvbn-ts/zxcvbn/commit/968e5d5b3ce48a7dd09a4c66fcbc2543be785e5b))
- **main:** use internal matcher parts separately ([#55](https://github.com/zxcvbn-ts/zxcvbn/issues/55)) ([792a94f](https://github.com/zxcvbn-ts/zxcvbn/commit/792a94f99623bd528a3b2a65035c049c4d2d4c40))
- **scoring:** Add support for blank passwords ([#51](https://github.com/zxcvbn-ts/zxcvbn/issues/51)) ([4c8482b](https://github.com/zxcvbn-ts/zxcvbn/commit/4c8482bfbc329baf1eeb67611b4a7f7624fc55cd))
- **scoring:** resolve spatial wrong guesses ([fe38131](https://github.com/zxcvbn-ts/zxcvbn/commit/fe381314cd61d3b0aeb9b42e496f5c02ba28acb1))

### Features

- **dictionaries:** remove single chars ([#40](https://github.com/zxcvbn-ts/zxcvbn/issues/40)) ([97dc856](https://github.com/zxcvbn-ts/zxcvbn/commit/97dc8562a4176f34c10fbb1cefce8d55cfbae25a))
- **feedback:** add warning for userInputs dictionary ([#38](https://github.com/zxcvbn-ts/zxcvbn/issues/38)) ([c7dd4a2](https://github.com/zxcvbn-ts/zxcvbn/commit/c7dd4a27cdd787b91b0234d88fbf3340738e9027))
- **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))
- **matcher:** Make matcher customizable ([#48](https://github.com/zxcvbn-ts/zxcvbn/issues/48)) ([8667485](https://github.com/zxcvbn-ts/zxcvbn/commit/866748556b576d15266725e44d6c99d38165cc95))

# [0.3.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.2.0...@zxcvbn-ts/core@0.3.0) (2021-03-03)

### Bug Fixes

- **main:** resolve performance issues ([e8142cb](https://github.com/zxcvbn-ts/zxcvbn/commit/e8142cb6b1bb242aa433325e6a560b600aa10100))

### BREAKING CHANGES

- **main:** the library serves now only named exports and the options need to be set with `zxcvbnOptions.setOptions`

# [0.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.1.0...@zxcvbn-ts/core@0.2.0) (2021-01-18)

### Bug Fixes

- **feedback:** get feedback for gendered firstnames ([41ce7f5](https://github.com/zxcvbn-ts/zxcvbn/commit/41ce7f500220f77b81382a6185d4f3801579c737))
- **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))

### Features

- **keyboard:** Add new AZERTY keyboard layout ([#17](https://github.com/zxcvbn-ts/zxcvbn/issues/17)) ([f0a7382](https://github.com/zxcvbn-ts/zxcvbn/commit/f0a7382e9b4a140b97967c3c546f2217d64a5e14))
- **translations:** improve straight row translation ([#22](https://github.com/zxcvbn-ts/zxcvbn/issues/22)) ([9e1f6e0](https://github.com/zxcvbn-ts/zxcvbn/commit/9e1f6e073f2baf5fb72a9eb507a7f0ad59dd32e9))

# [0.1.0](https://github.com/dropbox/zxcvbn/compare/v4.4.2...zxcvbn-ts:@zxcvbn-ts/core@0.1.0) (2021-01-05)

## Features

- **project:** I18n support for feedback and dictionaries. By default, the feedback are now keys
- **project:** All dictionaries are optional but highly recommend (wished feature in some issues)
- **project:** Dictionaries are separated from the core library this means zxcvbn-ts is relative small without dictionaries
- **project:** The project is a monorepo with a core library `@zxcvbn-ts/core` and language packages `@zxcvbn-ts/language-en`. At the beginner, there is only a German and English language package.
- **graphs:** Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it. For example if you develop a Russian website the keyboard layouts are pretty much useless.
- **graphs:** Now you could add a Russian keyboard layout by yourself for a fast implementation and create a PR for the long run.
- **graphs:** Multiple keyboard layouts are used which means that every layout that is added to the library will be checked against by default.
- **tests:** Tests are now made with jest, so we get a coverage
- **setup:** Included eslint/prettier for consistent code
- **setup:** There is an esm, commonJS and browser build use it as needed
- **docs:** Added static-page docs https://zxcvbn-ts.github.io/zxcvbn/
