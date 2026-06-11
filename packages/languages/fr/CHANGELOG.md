# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@3.0.1...@zxcvbn-ts/language-fr@3.0.2) (2023-09-17)

### Bug Fixes

- **docs:** resolve typo ([3785f0a](https://github.com/jeromes80/zxcvbn/commit/3785f0a0ef5400dbcbd666512370a67cb651c46d))

## [3.0.1](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@3.0.0...@zxcvbn-ts/language-fr@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/jeromes80/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@2.2.0...@zxcvbn-ts/language-fr@3.0.0) (2023-05-07)

- feat!: makes language packages tree shakeable (#176) ([3be6ae2](https://github.com/jeromes80/zxcvbn/commit/3be6ae2ae3f4ff7ade756df50c60274cbc2b0e20)), closes [#176](https://github.com/jeromes80/zxcvbn/issues/176) [#175](https://github.com/jeromes80/zxcvbn/issues/175)

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

# [2.2.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@2.1.0...@zxcvbn-ts/language-fr@2.2.0) (2022-09-12)

### Features

- **languages:** update dictionaries ([d3b0cd6](https://github.com/jeromes80/zxcvbn/commit/d3b0cd62c020e0a50a6fa3b00bb842d0dd3b1eb8))
- **languages:** update dictionaries ([7f67d3a](https://github.com/jeromes80/zxcvbn/commit/7f67d3a71ef3b1136fc965c21d9febbfa3e74193))

# [2.1.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@2.0.1...@zxcvbn-ts/language-fr@2.1.0) (2022-05-20)

### Features

- **languages:** swap french firstnames with lastnames ([bb85a14](https://github.com/jeromes80/zxcvbn/commit/bb85a142ff851b6666561cde542d0136c039bd22))

# [1.2.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@1.0.0...@zxcvbn-ts/language-fr@1.2.0) (2021-12-15)

### Features

- **project:** Add HaveIBeenPwned matcherr ([#66](https://github.com/jeromes80/zxcvbn/issues/66)) ([5c4141c](https://github.com/jeromes80/zxcvbn/commit/5c4141cd34f6566fe753ce76572f74bb8229b414))

# [1.1.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@1.0.0...@zxcvbn-ts/language-fr@1.1.0) (2021-12-14)

### Features

- **language:** add new translations ([0a87424](https://github.com/jeromes80/zxcvbn/commit/0a874242d139314907d7b33db1cdb85d2363d338))

# [1.0.0](https://github.com/jeromes80/zxcvbn/compare/@zxcvbn-ts/language-fr@1.0.0-beta.0...@zxcvbn-ts/language-fr@1.0.0) (2021-11-03)

### Bug Fixes

- **dictionaries:** delet userInput from lang dictionaries ([a8aee74](https://github.com/jeromes80/zxcvbn/commit/a8aee74aec1e01e8c9948a10be83422ba0ed1fbb))

### Features

- **translations:** improve user input feedback ([57ce211](https://github.com/jeromes80/zxcvbn/commit/57ce211883018e08a454b9dfc1983ac19ced9787))

# 1.0.0-beta.0 (2021-06-09)

### Features

- **languages:** Add deduplication functionality ([#54](https://github.com/jeromes80/zxcvbn/issues/54)) ([d98c49f](https://github.com/jeromes80/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))
- **languages:** add FR Dictionnary ([#30](https://github.com/jeromes80/zxcvbn/issues/30)) ([502bdcf](https://github.com/jeromes80/zxcvbn/commit/502bdcf007ace72f42ec8aca5e1ea3c69e319483))
- **matcher:** Make matcher customizable ([#48](https://github.com/jeromes80/zxcvbn/issues/48)) ([8667485](https://github.com/jeromes80/zxcvbn/commit/866748556b576d15266725e44d6c99d38165cc95))
