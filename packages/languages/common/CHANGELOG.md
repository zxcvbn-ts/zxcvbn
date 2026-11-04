# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.1.2...@zxcvbn-ts/language-common@4.1.3) (2026-07-16)

### Bug Fixes

- **common:** export `adjacencyGraphs` as a plain object again. In 4.1.1 and 4.1.2 the ESM build exported it wrapped as `{ default: {...} }`, so the spatial matcher found no keyboard patterns (qwerty, dvorak, keypad) and passwords like `qwertyuiop` were rated stronger than they are. With @zxcvbn-ts/core 4.2.0 the new runtime option checks throw on that shape ([#330](https://github.com/zxcvbn-ts/zxcvbn/issues/330)) ([7d4712c](https://github.com/zxcvbn-ts/zxcvbn/commit/7d4712c2566d799d1378148416c5e4a04744c323))

## [4.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.1.1...@zxcvbn-ts/language-common@4.1.2) (2026-06-16)

### Bug Fixes

- **common:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.1.0...@zxcvbn-ts/language-common@4.1.1) (2026-06-13)

### Bug Fixes

- **common:** fix the published type declarations. `adjacencyGraphs` was re-exported straight from a JSON file, which TypeScript could not resolve ([#320](https://github.com/zxcvbn-ts/zxcvbn/issues/320)) ([acf40cc](https://github.com/zxcvbn-ts/zxcvbn/commit/acf40cc55292b390e0a56ce24f03147761058e47))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.4...@zxcvbn-ts/language-common@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime with `@zxcvbn-ts/dictionary-compression`, which is now a dependency ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The minified CDN build `dist/zxcvbn-ts.min.js` is no longer shipped; the IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))

- **common:** the dictionary keys are renamed: `diceware` is now `diceware-common` and `passwords` is now `passwords-common`. This only affects code that reads the keys directly ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.0.0-beta.3...@zxcvbn-ts/language-common@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-common

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.0.0-beta.2...@zxcvbn-ts/language-common@4.0.0-beta.3) (2026-03-04)

### Bug Fixes

- **dictionaries:** ship the dictionaries without gzip/base64 encoding again, as it increased the bundle size in the browser. The decompression now comes from the external `@zxcvbn-ts/dictionary-compression` ^3.0.1 ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.0.0-beta.1...@zxcvbn-ts/language-common@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed. The package now depends on `@zxcvbn-ts/dictionary-compression` ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.0.0-beta.0...@zxcvbn-ts/language-common@4.0.0-beta.1) (2024-09-30)

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.4...@zxcvbn-ts/language-common@4.0.0-beta.0) (2024-07-31)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [3.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.3...@zxcvbn-ts/language-common@3.0.4) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/zxcvbn-ts/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.2...@zxcvbn-ts/language-common@3.0.3) (2023-06-06)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.1...@zxcvbn-ts/language-common@3.0.2) (2023-05-12)

### Bug Fixes

- **common:** resolve issue with wrong type generation ([852a906](https://github.com/zxcvbn-ts/zxcvbn/commit/852a9065cf18b488c9128a92aad0226f7ec0a5b5))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.0...@zxcvbn-ts/language-common@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@2.0.1...@zxcvbn-ts/language-common@3.0.0) (2023-05-07)

### Bug Fixes

- **languages:** make language packages tree shakeable ([#176](https://github.com/zxcvbn-ts/zxcvbn/issues/176)) ([3be6ae2](https://github.com/zxcvbn-ts/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#175](https://github.com/zxcvbn-ts/zxcvbn/issues/175)

### Features

- **dictionary:** add diceware dictionary scoring ([#179](https://github.com/zxcvbn-ts/zxcvbn/issues/179)) ([5c5a74a](https://github.com/zxcvbn-ts/zxcvbn/commit/5c5a74ab2b77c58bfd1c3821d813fd59474e08e7))

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

## [2.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@2.0.0...@zxcvbn-ts/language-common@2.0.1) (2022-03-17)

**Note:** Version bump only for package @zxcvbn-ts/language-common

# [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.2...@zxcvbn-ts/language-common@2.0.0) (2022-02-09)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [1.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.1...@zxcvbn-ts/language-common@1.0.2) (2021-12-15)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [1.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.0...@zxcvbn-ts/language-common@1.0.1) (2021-12-14)

**Note:** Version bump only for package @zxcvbn-ts/language-common

# [1.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.0-beta.0...@zxcvbn-ts/language-common@1.0.0) (2021-11-03)

### Bug Fixes

- **dictionaries:** delete userInput from lang dictionaries ([a8aee74](https://github.com/zxcvbn-ts/zxcvbn/commit/a8aee74aec1e01e8c9948a10be83422ba0ed1fbb))

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.2...@zxcvbn-ts/language-common@1.0.0-beta.0) (2021-06-09)

### Features

- **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))

## [0.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.1...@zxcvbn-ts/language-common@0.1.2) (2021-03-03)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [0.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.0...@zxcvbn-ts/language-common@0.1.1) (2021-01-18)

### Bug Fixes

- **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))

# 0.1.0 (2021-01-05)

**Note:** Version bump only for package @zxcvbn-ts/language-common
