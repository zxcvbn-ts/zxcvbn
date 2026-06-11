# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
