# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.2.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fa@4.2.0...@zxcvbn-ts/language-fa@4.2.1) (2026-11-14)

**Note:** README update only: install commands for npm, yarn and pnpm, what the package includes, a usage example with `result.score` and `result.feedback`, linked dictionary sources and links to the documentation ([8d455f6](https://github.com/zxcvbn-ts/zxcvbn/commit/8d455f69dafe2f4f57e94b18be49a888c18d83ad))

# [4.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fa@4.1.1...@zxcvbn-ts/language-fa@4.2.0) (2026-08-12)

### Features

- **dictionaries:** add a list of common Persian words (`commonWords-fa`). Passwords built from common Persian words now score lower ([#341](https://github.com/zxcvbn-ts/zxcvbn/issues/341)) ([ac0ef46](https://github.com/zxcvbn-ts/zxcvbn/commit/ac0ef464e8d8f6bac9dd6744cd71d8bcefba66fd))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fa@4.1.0...@zxcvbn-ts/language-fa@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fa@4.0.0-beta.3...@zxcvbn-ts/language-fa@4.1.0) (2026-06-11)

First stable release. It includes every change from `4.0.0-beta.3` to `4.0.0-beta.4`.

### Features

- **languages:** add the Persian language package with translated feedback messages and dictionaries (first names, last names). Its dictionaries are compressed and decompressed at runtime with `@zxcvbn-ts/dictionary-compression` ([#304](https://github.com/zxcvbn-ts/zxcvbn/issues/304)) ([5926040](https://github.com/zxcvbn-ts/zxcvbn/commit/5926040b53ab72278664e2fd3e03a7844e23d29c))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-fa@4.0.0-beta.3...@zxcvbn-ts/language-fa@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-fa

# 4.0.0-beta.3 (2026-03-04)

### Features

- **languages:** add the Persian language package with translated feedback messages and dictionaries (first names, last names) ([#304](https://github.com/zxcvbn-ts/zxcvbn/issues/304)) ([5926040](https://github.com/zxcvbn-ts/zxcvbn/commit/5926040b53ab72278664e2fd3e03a7844e23d29c))
