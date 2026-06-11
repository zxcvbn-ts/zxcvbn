# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ja@3.0.1...@zxcvbn-ts/language-ja@3.0.2) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/zxcvbn-ts/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ja@3.0.0...@zxcvbn-ts/language-ja@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ja@2.1.0...@zxcvbn-ts/language-ja@3.0.0) (2023-05-07)

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

# 2.1.0 (2022-07-17)

### Features

- **ja-language:** add improved wikipedia dictionary ([bd77ffe](https://github.com/zxcvbn-ts/zxcvbn/commit/bd77ffe29918bad04c049408b26133af524351f6))
- **ja-language:** add jp writing to romaji converter ([076ae97](https://github.com/zxcvbn-ts/zxcvbn/commit/076ae975ed46e5573c14a076931cc02cebe22bfe))
- **ja-language:** add wikipedia dictionary ([c05d37b](https://github.com/zxcvbn-ts/zxcvbn/commit/c05d37b7ebd3eff1811f400ecd23519ab1477276))
- **languages:** Added a japanese language package ([#119](https://github.com/zxcvbn-ts/zxcvbn/issues/119)) ([b554953](https://github.com/zxcvbn-ts/zxcvbn/commit/b554953093e2ef645fecbe5621e2915915f8e5a1))
