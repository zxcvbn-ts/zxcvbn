# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@3.0.0...@zxcvbn-ts/language-nl-be@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@2.1.1...@zxcvbn-ts/language-nl-be@3.0.0) (2023-05-07)

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

## [2.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@2.1.0...@zxcvbn-ts/language-nl-be@2.1.1) (2023-01-27)

### Bug Fixes

- **language:** German string in Dutch translations to Dutch ([#150](https://github.com/zxcvbn-ts/zxcvbn/issues/150)) ([23207d2](https://github.com/zxcvbn-ts/zxcvbn/commit/23207d2fcbfa1cdac521bce6349caef65094b483))

# [2.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@2.0.1...@zxcvbn-ts/language-nl-be@2.1.0) (2022-09-12)

### Features

- **languages:** update dictionaries ([7f67d3a](https://github.com/zxcvbn-ts/zxcvbn/commit/7f67d3a71ef3b1136fc965c21d9febbfa3e74193))

## [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@1.2.0...@zxcvbn-ts/language-nl-be@2.0.0) (2022-02-10)

**Note:** Version bump only for package @zxcvbn-ts/language-nl-be

# [1.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@1.0.0...@zxcvbn-ts/language-nl-be@1.2.0) (2021-12-15)

### Features

- **project:** Add HaveIBeenPwned matcher ([#66](https://github.com/zxcvbn-ts/zxcvbn/issues/66)) ([5c4141c](https://github.com/zxcvbn-ts/zxcvbn/commit/5c4141cd34f6566fe753ce76572f74bb8229b414))

# [1.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@1.0.0...@zxcvbn-ts/language-nl-be@1.1.0) (2021-12-14)

### Features

- **language:** add new translations ([0a87424](https://github.com/zxcvbn-ts/zxcvbn/commit/0a874242d139314907d7b33db1cdb85d2363d338))

# [1.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@1.0.0-beta.0...@zxcvbn-ts/language-nl-be@1.0.0) (2021-11-03)

### Bug Fixes

- **dictionaries:** delet userInput from lang dictionaries ([a8aee74](https://github.com/zxcvbn-ts/zxcvbn/commit/a8aee74aec1e01e8c9948a10be83422ba0ed1fbb))

### Features

- **translations:** improve user input feedback ([57ce211](https://github.com/zxcvbn-ts/zxcvbn/commit/57ce211883018e08a454b9dfc1983ac19ced9787))

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-nl-be@0.3.0...@zxcvbn-ts/language-nl-be@1.0.0-beta.0) (2021-06-09)

### Features

- **dictionaries:** remove single chars ([#40](https://github.com/zxcvbn-ts/zxcvbn/issues/40)) ([97dc856](https://github.com/zxcvbn-ts/zxcvbn/commit/97dc8562a4176f34c10fbb1cefce8d55cfbae25a))
- **feedback:** add warning for userInputs dictionary ([#38](https://github.com/zxcvbn-ts/zxcvbn/issues/38)) ([c7dd4a2](https://github.com/zxcvbn-ts/zxcvbn/commit/c7dd4a27cdd787b91b0234d88fbf3340738e9027))
- **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))

# 0.3.0 (2021-03-03)

### Features

- **languages:** add nl-be language package ([#20](https://github.com/zxcvbn-ts/zxcvbn/issues/20)) ([8c3547e](https://github.com/zxcvbn-ts/zxcvbn/commit/8c3547ed732f7c1483361cb9189bdd29a646902b))
- **scripts:** Add wikipedia extractor ([#26](https://github.com/zxcvbn-ts/zxcvbn/issues/26)) ([7efecd5](https://github.com/zxcvbn-ts/zxcvbn/commit/7efecd5bc5f54c4786e4091f79e6eba77fee5498))

# 0.2.0 (2021-01-18)

### Features

- **languages:** add nl-be language package ([#20](https://github.com/zxcvbn-ts/zxcvbn/issues/20)) ([8c3547e](https://github.com/zxcvbn-ts/zxcvbn/commit/8c3547ed732f7c1483361cb9189bdd29a646902b))

# 0.1.0 (2021-01-17)

**Note:** Version bump only for package @zxcvbn-ts/language-nl-be
