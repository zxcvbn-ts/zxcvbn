# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@4.1.0...@zxcvbn-ts/language-en@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@3.0.2...@zxcvbn-ts/language-en@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### Features

- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-en`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))
- **dictionaries:** ship the dictionaries compressed and decompress them at runtime with `@zxcvbn-ts/dictionary-compression`, which is now a dependency ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The minified CDN build `dist/zxcvbn-ts.min.js` is no longer shipped; the IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))

- **dictionaries:** the dictionary keys are renamed: `commonWords` is now `commonWords-en`, `firstnames` is now `firstnames-en`, `lastnames` is now `lastnames-en`, `wikipedia` is now `wikipedia-en`. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.3 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@4.0.0-beta.3...@zxcvbn-ts/language-en@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-en

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@4.0.0-beta.2...@zxcvbn-ts/language-en@4.0.0-beta.3) (2026-03-04)

### Bug Fixes

- **dictionaries:** ship the dictionaries without gzip/base64 encoding again, as it increased the bundle size in the browser. The decompression now comes from the external `@zxcvbn-ts/dictionary-compression` ^3.0.1 ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### Features

- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, as a separate `wordSequences` export ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@4.0.0-beta.1...@zxcvbn-ts/language-en@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed. The package now depends on `@zxcvbn-ts/dictionary-compression` ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@4.0.0-beta.0...@zxcvbn-ts/language-en@4.0.0-beta.1) (2024-09-30)

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@3.0.2...@zxcvbn-ts/language-en@4.0.0-beta.0) (2024-07-31)

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### BREAKING CHANGES

- **dictionaries:** the dictionary keys are renamed: `commonWords` is now `commonWords-en`, `firstnames` is now `firstnames-en`, `lastnames` is now `lastnames-en`, `wikipedia` is now `wikipedia-en`. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@3.0.1...@zxcvbn-ts/language-en@3.0.2) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/zxcvbn-ts/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@3.0.0...@zxcvbn-ts/language-en@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@2.1.0...@zxcvbn-ts/language-en@3.0.0) (2023-05-07)

- feat!: makes language packages tree shakeable (#176) ([3be6ae2](https://github.com/zxcvbn-ts/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#176](https://github.com/zxcvbn-ts/zxcvbn/issues/176) [#175](https://github.com/zxcvbn-ts/zxcvbn/issues/175)

### BREAKING CHANGES

- Language packages no longer has a default export.

Instead of importing language packages with
`import package from '@zxcvbn-ts/language-en'`

You will now have to import it either like this
`import { dictionary, translations } from '@zxcvbn-ts/language-en'`

or like this
`import * as package from '@zxcvbn-ts/language-en'`

The reason for the change is so that you can tree shake the
dictionary and translations.

# [2.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@2.0.1...@zxcvbn-ts/language-en@2.1.0) (2022-09-12)

### Features

- **languages:** update dictionaries ([7f67d3a](https://github.com/zxcvbn-ts/zxcvbn/commit/7f67d3a71ef3b1136fc965c21d9febbfa3e74193))

## [2.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@2.0.0...@zxcvbn-ts/language-en@2.0.1) (2022-03-17)

**Note:** Version bump only for package @zxcvbn-ts/language-en

# [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@1.2.0...@zxcvbn-ts/language-en@2.0.0) (2022-02-09)

**Note:** Version bump only for package @zxcvbn-ts/language-en

# [1.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@1.1.0...@zxcvbn-ts/language-en@1.2.0) (2021-12-15)

### Features

- **project:** Add HaveIBeenPwned matcher ([#66](https://github.com/zxcvbn-ts/zxcvbn/issues/66)) ([5c4141c](https://github.com/zxcvbn-ts/zxcvbn/commit/5c4141cd34f6566fe753ce76572f74bb8229b414))

# [1.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@1.0.0...@zxcvbn-ts/language-en@1.1.0) (2021-12-14)

### Features

- **language:** add new translations ([0a87424](https://github.com/zxcvbn-ts/zxcvbn/commit/0a874242d139314907d7b33db1cdb85d2363d338))

# [1.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@1.0.0-beta.0...@zxcvbn-ts/language-en@1.0.0) (2021-11-03)

### Bug Fixes

- **dictionaries:** delete userInput from lang dictionaries ([a8aee74](https://github.com/zxcvbn-ts/zxcvbn/commit/a8aee74aec1e01e8c9948a10be83422ba0ed1fbb))

### Features

- **translations:** improve user input feedback ([57ce211](https://github.com/zxcvbn-ts/zxcvbn/commit/57ce211883018e08a454b9dfc1983ac19ced9787))

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@0.3.0...@zxcvbn-ts/language-en@1.0.0-beta.0) (2021-06-09)

### Features

- **dictionaries:** remove single chars ([#40](https://github.com/zxcvbn-ts/zxcvbn/issues/40)) ([97dc856](https://github.com/zxcvbn-ts/zxcvbn/commit/97dc8562a4176f34c10fbb1cefce8d55cfbae25a))
- **feedback:** add warning for userInputs dictionary ([#38](https://github.com/zxcvbn-ts/zxcvbn/issues/38)) ([c7dd4a2](https://github.com/zxcvbn-ts/zxcvbn/commit/c7dd4a27cdd787b91b0234d88fbf3340738e9027))
- **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))

# [0.3.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@0.2.0...@zxcvbn-ts/language-en@0.3.0) (2021-03-03)

**Note:** Version bump only for package @zxcvbn-ts/language-en

# [0.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-en@0.1.0...@zxcvbn-ts/language-en@0.2.0) (2021-01-18)

### Bug Fixes

- **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))

### Features

- **translations:** improve straight row translation ([#22](https://github.com/zxcvbn-ts/zxcvbn/issues/22)) ([9e1f6e0](https://github.com/zxcvbn-ts/zxcvbn/commit/9e1f6e073f2baf5fb72a9eb507a7f0ad59dd32e9))

# 0.1.0 (2021-01-05)

**Note:** Version bump only for package @zxcvbn-ts/language-en
