# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-pl@3.0.1...@zxcvbn-ts/language-pl@3.0.2) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/zxcvbn-ts/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-pl@3.0.0...@zxcvbn-ts/language-pl@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-pl@2.2.0...@zxcvbn-ts/language-pl@3.0.0) (2023-05-07)

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

# [2.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-pl@2.1.0...@zxcvbn-ts/language-pl@2.2.0) (2022-09-12)

### Features

- **languages:** update dictionaries ([7f67d3a](https://github.com/zxcvbn-ts/zxcvbn/commit/7f67d3a71ef3b1136fc965c21d9febbfa3e74193))

# 2.1.0 (2022-05-20)

### Bug Fixes

- **polish:** interpunctuation errror in translations ([1751799](https://github.com/zxcvbn-ts/zxcvbn/commit/175179992d4861d6ea7b04c1bb406010f8428ab9))

### Features

- **languages:** addd polish language package ([#108](https://github.com/zxcvbn-ts/zxcvbn/issues/108)) ([fff3146](https://github.com/zxcvbn-ts/zxcvbn/commit/fff3146ee508901f20e053b295d018d143ad9b88))
