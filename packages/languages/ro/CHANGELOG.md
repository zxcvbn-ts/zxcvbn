# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ro@4.1.1...@zxcvbn-ts/language-ro@4.1.2) (2026-07-16)

### Bug Fixes

- **translations:** the l33t suggestion said to avoid substituting "@" for "@"; it now says "@" for "a" ([#325](https://github.com/zxcvbn-ts/zxcvbn/issues/325)) ([dcca1e3](https://github.com/zxcvbn-ts/zxcvbn/commit/dcca1e38652bf76d2e43600c21ee455f78cb4f10))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ro@4.1.0...@zxcvbn-ts/language-ro@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ro@4.0.0-beta.3...@zxcvbn-ts/language-ro@4.1.0) (2026-06-11)

First stable release. It includes every change from `4.0.0-beta.3` to `4.0.0-beta.4`.

### Features

- **languages:** add the Romanian language package with translated feedback messages and dictionaries (common words, first names, last names, Wikipedia). Its dictionaries are compressed and decompressed at runtime with `@zxcvbn-ts/dictionary-compression` ([#267](https://github.com/zxcvbn-ts/zxcvbn/issues/267)) ([032a9b4](https://github.com/zxcvbn-ts/zxcvbn/commit/032a9b494b7dc8456e26c7f3716d1f71a4536cbe))
- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-ro`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

### BREAKING CHANGES

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.3 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ro@4.0.0-beta.3...@zxcvbn-ts/language-ro@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-ro

# 4.0.0-beta.3 (2026-03-04)

### Features

- **languages:** add the Romanian language package with translated feedback messages and dictionaries (common words, first names, last names, Wikipedia). The word sequences are a separate `wordSequences` export ([#267](https://github.com/zxcvbn-ts/zxcvbn/issues/267)) ([032a9b4](https://github.com/zxcvbn-ts/zxcvbn/commit/032a9b494b7dc8456e26c7f3716d1f71a4536cbe))
