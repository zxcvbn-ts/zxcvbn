# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-id@3.0.0...@zxcvbn-ts/language-id@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-id@2.1.0...@zxcvbn-ts/language-id@3.0.0) (2023-05-07)

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

# 2.1.0 (2022-09-12)

### Features

- **languages:** add Indonesia support ([#139](https://github.com/zxcvbn-ts/zxcvbn/issues/139)) ([b201f2f](https://github.com/zxcvbn-ts/zxcvbn/commit/b201f2f95008b5e6bed87b03faf7cc3dac2e96a0))
