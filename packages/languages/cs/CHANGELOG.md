# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@3.0.1...@zxcvbn-ts/language-cs@4.1.0) (2026-06-11)

### Bug Fixes

- **dictionaries:** remove gzip/base64 as it increases the bundle size in the browser ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### Features

- Add word sequence matcher ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))
- **package:** add dictionary compression ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))
- **package:** cleanup package json with publint ([74f6fff](https://github.com/zxcvbn-ts/zxcvbn/commit/74f6ffffcc93c90591523fe7047ed843cb25c3ac))
- **package:** revert cleanup package json with publint ([360ce9e](https://github.com/zxcvbn-ts/zxcvbn/commit/360ce9e28b464a573e5f92294027518a995b06c0))
- **package:** revert cleanup package json with publint ([0eca875](https://github.com/zxcvbn-ts/zxcvbn/commit/0eca875d6de5265278666299c0a06fc4a8c453a7))
- **packages:** modernize packages ([c2a6313](https://github.com/zxcvbn-ts/zxcvbn/commit/c2a6313ca0ca61de875f45338df3147c050549fe))
- Update to new common words list ([#314](https://github.com/zxcvbn-ts/zxcvbn/issues/314)) ([1bbd9db](https://github.com/zxcvbn-ts/zxcvbn/commit/1bbd9db5ed225b9aaa50781b5fa6348bf1852e74))
- use wordSequences correctly as dictionary ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))
- use wordSequences correctly as dictionary ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b))

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-cs@3.0.0...@zxcvbn-ts/language-cs@3.0.1) (2023-05-10)

### Bug Fixes

- **language:** set sideEffects to false to make it treeshakeable ([3c7c4c3](https://github.com/zxcvbn-ts/zxcvbn/commit/3c7c4c3e8091b5c8b6e8493da5ea9bd8517827e2))

# 3.0.0 (2023-05-07)

### Features

- **language:** add pagination and diacritics for czech ([8d7fcc8](https://github.com/zxcvbn-ts/zxcvbn/commit/8d7fcc85bdbbe89e3bdb3945b9b870d1fd2c2f92))
- **languages:** add support for czech language ([#135](https://github.com/zxcvbn-ts/zxcvbn/issues/135)) ([a209561](https://github.com/zxcvbn-ts/zxcvbn/commit/a20956159826f8717194037baff4158c63f88fbe))

# 2.0.0 (2022-08-08)

Initial release

## Data sources

- First names - https://krestnijmeno.prijmeni.cz/oblast/3000-ceska_republika/muzska_jmena&page=1
  - last update from The Ministry of the Interior of the Czech Republic in 2017
- Last names - https://www.prijmeni.cz/oblast/3000-ceska_republika&page=1
  - last update from The Ministry of the Interior of the Czech Republic in 2017
- Common words - https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/cs/cs_full.txt
  - last update in 2018
