# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fi@3.0.0...@zxcvbn-ts/language-fi@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fi@2.2.0...@zxcvbn-ts/language-fi@3.0.0) (2023-05-07)

- feat!: makes language packages tree shakeable (#176) ([3be6ae2](https://github.com/zxcvbn-ts/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#176](https://github.com/zxcvbn-ts/zxcvbn/issues/176) [#175](https://github.com/zxcvbn-ts/zxcvbn/issues/175)

### BREAKING CHANGES

- Language packages no longer has a default export.

Instead of importing language packages with
`import package from '@zxcvbn-ts/language-en'`

You will now have to import it either like this
`import { dictionary, translation } from '@zxcvbn-ts/language-en'`

or like this
`import * as package from '@zxcvbn-ts/language-en'`

The reason for the change is so that you can tree shake the
dictionary and translations.

# [2.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fi@2.1.0...@zxcvbn-ts/language-fi@2.2.0) (2022-09-12)

### Features

- **generator:** Simplify generators ([#140](https://github.com/zxcvbn-ts/zxcvbn/issues/140)) ([c3edeb8](https://github.com/zxcvbn-ts/zxcvbn/commit/c3edeb84de4f0e9a67aa9b07095b174059a6863a))
- **languages:** update dictionaries ([86ce647](https://github.com/zxcvbn-ts/zxcvbn/commit/86ce647b5dc675f68e205adcc16646dbfca593e7))
- **languages:** update dictionaries ([7f67d3a](https://github.com/zxcvbn-ts/zxcvbn/commit/7f67d3a71ef3b1136fc965c21d9febbfa3e74193))

# 2.1.0 (2022-08-04)

### Features

- **language:** add Finnish dictionary and language package ([#133](https://github.com/zxcvbn-ts/zxcvbn/issues/133)) ([321d8fe](https://github.com/zxcvbn-ts/zxcvbn/commit/321d8fe1daaa0293f314d0a2940de0a867130d76))
- **languages:** add finnish wikipedia ([9b9332e](https://github.com/zxcvbn-ts/zxcvbn/commit/9b9332e8ea491c9dc0e0b5a7e23ed1e40c3d3e5b))
