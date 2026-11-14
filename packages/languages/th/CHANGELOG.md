# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.2.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-th@4.2.0...@zxcvbn-ts/language-th@4.2.1) (2026-11-14)

**Note:** README update only: install commands for npm, yarn and pnpm, what the package includes, a usage example with `result.score` and `result.feedback`, linked dictionary sources and links to the documentation ([8d455f6](https://github.com/zxcvbn-ts/zxcvbn/commit/8d455f69dafe2f4f57e94b18be49a888c18d83ad))

# [4.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-th@4.1.1...@zxcvbn-ts/language-th@4.2.0) (2026-08-12)

### Features

- **dictionaries:** add lists of Thai first and last names (`firstnames-th`, `lastnames-th`) and update the common words list. Passwords built from Thai names now score lower ([#341](https://github.com/zxcvbn-ts/zxcvbn/issues/341)) ([ac0ef46](https://github.com/zxcvbn-ts/zxcvbn/commit/ac0ef464e8d8f6bac9dd6744cd71d8bcefba66fd))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-th@4.1.0...@zxcvbn-ts/language-th@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-th@4.0.0-beta.3...@zxcvbn-ts/language-th@4.1.0) (2026-06-11)

First stable release. It includes every change from `4.0.0-beta.3` to `4.0.0-beta.4`.

### Features

- **languages:** add the Thai language package with translated feedback messages and dictionaries (common words, Wikipedia). Its dictionaries are compressed and decompressed at runtime with `@zxcvbn-ts/dictionary-compression` ([#307](https://github.com/zxcvbn-ts/zxcvbn/issues/307)) ([9f830ba](https://github.com/zxcvbn-ts/zxcvbn/commit/9f830ba77923083642a43337ceca9cb69d8555f2))
- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-th`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

### BREAKING CHANGES

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.3 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-th@4.0.0-beta.3...@zxcvbn-ts/language-th@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-th

# 4.0.0-beta.3 (2026-03-04)

### Features

- **languages:** add the Thai language package with translated feedback messages and dictionaries (common words, Wikipedia). The word sequences are a separate `wordSequences` export ([#307](https://github.com/zxcvbn-ts/zxcvbn/issues/307)) ([9f830ba](https://github.com/zxcvbn-ts/zxcvbn/commit/9f830ba77923083642a43337ceca9cb69d8555f2))
