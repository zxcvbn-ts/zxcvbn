# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@4.1.0...@zxcvbn-ts/language-cs@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@3.0.1...@zxcvbn-ts/language-cs@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### Features

- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-cs`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))
- **dictionaries:** ship the dictionaries compressed and decompress them at runtime with `@zxcvbn-ts/dictionary-compression`, which is now a dependency ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))

- **dictionaries:** the dictionary keys are renamed: `commonWords` is now `commonWords-cs`, `firstnames` is now `firstnames-cs`, `lastnames` is now `lastnames-cs`, `wikipedia` is now `wikipedia-cs`. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.3 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@4.0.0-beta.3...@zxcvbn-ts/language-cs@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-cs

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@4.0.0-beta.2...@zxcvbn-ts/language-cs@4.0.0-beta.3) (2026-03-04)

### Bug Fixes

- **dictionaries:** ship the dictionaries without gzip/base64 encoding again, as it increased the bundle size in the browser. The decompression now comes from the external `@zxcvbn-ts/dictionary-compression` ^3.0.1 ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### Features

- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, as a separate `wordSequences` export ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@4.0.0-beta.1...@zxcvbn-ts/language-cs@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed. The package now depends on `@zxcvbn-ts/dictionary-compression` ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@4.0.0-beta.0...@zxcvbn-ts/language-cs@4.0.0-beta.1) (2024-09-30)

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@3.0.1...@zxcvbn-ts/language-cs@4.0.0-beta.0) (2024-07-31)

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### BREAKING CHANGES

- **dictionaries:** the dictionary keys are renamed: `commonWords` is now `commonWords-cs`, `firstnames` is now `firstnames-cs`, `lastnames` is now `lastnames-cs`, `wikipedia` is now `wikipedia-cs`. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@3.0.0...@zxcvbn-ts/language-cs@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# 3.0.0 (2023-05-07)

### Features

- **language:** add pagination and diacritics for czech ([8d7fcc8](https://github.com/zxcvbn-ts/zxcvbn/commit/8d7fcc85bdbbe89e3bdb3945b9b870d1fd2c2f92))
- **languages:** add support for czech language ([#135](https://github.com/zxcvbn-ts/zxcvbn/issues/135)) ([a209561](https://github.com/zxcvbn-ts/zxcvbn/commit/a20956159826f8717194037baff4158c63f88fbe))

### Data sources

- First names - https://krestnijmeno.prijmeni.cz/oblast/3000-ceska_republika/muzska_jmena&page=1
  - last update from The Ministry of the Interior of the Czech Republic in 2017
- Last names - https://www.prijmeni.cz/oblast/3000-ceska_republika&page=1
  - last update from The Ministry of the Interior of the Czech Republic in 2017
- Common words - https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/cs/cs_full.txt
  - last update in 2018
