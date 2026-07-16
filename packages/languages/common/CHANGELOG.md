# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.1.2...@zxcvbn-ts/language-common@4.1.3) (2026-07-16)

### Bug Fixes

- **common:** resolve broken adjacency graph import ([#330](https://github.com/zxcvbn-ts/zxcvbn/issues/330)) ([7d4712c](https://github.com/zxcvbn-ts/zxcvbn/commit/7d4712c2566d799d1378148416c5e4a04744c323))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@4.1.0...@zxcvbn-ts/language-common@4.1.1) (2026-06-13)

### Bug Fixes

- **common:** resolve issue with wrong type generation again ([#320](https://github.com/zxcvbn-ts/zxcvbn/issues/320)) ([acf40cc](https://github.com/zxcvbn-ts/zxcvbn/commit/acf40cc55292b390e0a56ce24f03147761058e47))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.4...@zxcvbn-ts/language-common@4.1.0) (2026-06-11)

### Bug Fixes

- **dictionaries:** remove gzip/base64 as it increases the bundle size in the browser ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### Features

- **package:** add dictionary compression ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))
- **package:** cleanup package json with publint ([74f6fff](https://github.com/zxcvbn-ts/zxcvbn/commit/74f6ffffcc93c90591523fe7047ed843cb25c3ac))
- **package:** revert cleanup package json with publint ([360ce9e](https://github.com/zxcvbn-ts/zxcvbn/commit/360ce9e28b464a573e5f92294027518a995b06c0))
- **package:** revert cleanup package json with publint ([0eca875](https://github.com/zxcvbn-ts/zxcvbn/commit/0eca875d6de5265278666299c0a06fc4a8c453a7))
- **packages:** modernize packages ([c2a6313](https://github.com/zxcvbn-ts/zxcvbn/commit/c2a6313ca0ca61de875f45338df3147c050549fe))
- Update to new common words list ([#314](https://github.com/zxcvbn-ts/zxcvbn/issues/314)) ([1bbd9db](https://github.com/zxcvbn-ts/zxcvbn/commit/1bbd9db5ed225b9aaa50781b5fa6348bf1852e74))
- use wordSequences correctly as dictionary ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b))

## [3.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.3...@zxcvbn-ts/language-common@3.0.4) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/zxcvbn-ts/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.1...@zxcvbn-ts/language-common@3.0.3) (2023-06-06)

### Bug Fixes

- **common:** resolve issue with wrong type generation ([852a906](https://github.com/zxcvbn-ts/zxcvbn/commit/852a9065cf18b488c9128a92aad0226f7ec0a5b5))

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.1...@zxcvbn-ts/language-common@3.0.2) (2023-05-12)

### Bug Fixes

- **common:** resolve issue with wrong type generation ([852a906](https://github.com/zxcvbn-ts/zxcvbn/commit/852a9065cf18b488c9128a92aad0226f7ec0a5b5))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@3.0.0...@zxcvbn-ts/language-common@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@2.0.1...@zxcvbn-ts/language-common@3.0.0) (2023-05-07)

- feat!: makes language packages tree shakeable (#176) ([3be6ae2](https://github.com/zxcvbn-ts/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#176](https://github.com/zxcvbn-ts/zxcvbn/issues/176) [#175](https://github.com/zxcvbn-ts/zxcvbn/issues/175)

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

## [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.2...@zxcvbn-ts/language-common@2.0.0) (2022-02-10)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [1.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.0...@zxcvbn-ts/language-common@1.0.2) (2021-12-15)

**Note:** Version bump only for package @zxcvbn-ts/language-common

## [1.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.0...@zxcvbn-ts/language-common@1.0.1) (2021-12-14)

**Note:** Version bump only for package @zxcvbn-ts/language-common

# [1.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@1.0.0-beta.0...@zxcvbn-ts/language-common@1.0.0) (2021-11-03)

### Bug Fixes

- **dictionaries:** delet userInput from lang dictionaries ([a8aee74](https://github.com/zxcvbn-ts/zxcvbn/commit/a8aee74aec1e01e8c9948a10be83422ba0ed1fbb))

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.2...@zxcvbn-ts/language-common@1.0.0-beta.0) (2021-06-09)

### Features

- **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))

## [0.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.0...@zxcvbn-ts/language-common@0.1.2) (2021-03-03)

### Bug Fixes

- **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))

## [0.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-common@0.1.0...@zxcvbn-ts/language-common@0.1.1) (2021-01-18)

### Bug Fixes

- **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))

# 0.1.0 (2021-01-05)

**Note:** Version bump only for package @zxcvbn-ts/language-common
