# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-tr@4.1.0...@zxcvbn-ts/language-tr@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-tr@4.0.0-beta.4...@zxcvbn-ts/language-tr@4.1.0) (2026-06-11)

First stable release. It includes the changes from `4.0.0-beta.4`.

### Features

- **languages:** add the Turkish language package with translated feedback messages and dictionaries (common words, first names, last names, Wikipedia). Its dictionaries are compressed and decompressed at runtime with `@zxcvbn-ts/dictionary-compression` ([#315](https://github.com/zxcvbn-ts/zxcvbn/issues/315)) ([42f3699](https://github.com/zxcvbn-ts/zxcvbn/commit/42f3699c3a1211fa0b2605917e11d58448ab6b9b))
- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-tr`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

### BREAKING CHANGES

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.4 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# 4.0.0-beta.4 (2026-05-13)

### Features

- **languages:** add the Turkish language package with translated feedback messages and dictionaries (common words, first names, last names, Wikipedia). The word sequences are a separate `wordSequences` export ([#315](https://github.com/zxcvbn-ts/zxcvbn/issues/315)) ([42f3699](https://github.com/zxcvbn-ts/zxcvbn/commit/42f3699c3a1211fa0b2605917e11d58448ab6b9b))
