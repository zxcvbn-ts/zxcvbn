# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.1.1...@zxcvbn-ts/language-da-dk@4.1.2) (2026-11-14)

**Note:** README update only: install commands for npm, yarn and pnpm, what the package includes, a usage example with `result.score` and `result.feedback`, linked dictionary sources and links to the documentation ([8d455f6](https://github.com/zxcvbn-ts/zxcvbn/commit/8d455f69dafe2f4f57e94b18be49a888c18d83ad))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.1.0...@zxcvbn-ts/language-da-dk@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.0.0-beta.1...@zxcvbn-ts/language-da-dk@4.1.0) (2026-06-11)

First stable release. It includes every change from `4.0.0-beta.1` to `4.0.0-beta.4`.

### Features

- **languages:** add the Danish language package with translated feedback messages and dictionaries (common words, female and male first names, last names). Its dictionaries are compressed and decompressed at runtime with `@zxcvbn-ts/dictionary-compression` ([#270](https://github.com/zxcvbn-ts/zxcvbn/issues/270)) ([a1b033d](https://github.com/zxcvbn-ts/zxcvbn/commit/a1b033d364a35a7098a2e731476bdd05dd7faafe))
- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, to `dictionary` (keys like `cardinalNumbers-da-dk`). Passwords built from these words now score lower ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e)) ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

### BREAKING CHANGES

- **dictionaries:** for users of the betas: the separate `wordSequences` export from 4.0.0-beta.3 is removed. The word sequences are part of `dictionary` now ([0c84a11](https://github.com/zxcvbn-ts/zxcvbn/commit/0c84a11e821e299d311e61458111fbc64318705b)) ([e88226d](https://github.com/zxcvbn-ts/zxcvbn/commit/e88226df7aa17b6302d86aeb443089b442c60e66))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.0.0-beta.3...@zxcvbn-ts/language-da-dk@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-da-dk

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.0.0-beta.2...@zxcvbn-ts/language-da-dk@4.0.0-beta.3) (2026-03-04)

### Bug Fixes

- **dictionaries:** ship the dictionaries without gzip/base64 encoding again, as it increased the bundle size in the browser. The decompression now comes from the external `@zxcvbn-ts/dictionary-compression` ^3.0.1 ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### Features

- **dictionaries:** add lists of word sequences, such as numbers, days of the week, months and colors, as a separate `wordSequences` export ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-da-dk@4.0.0-beta.1...@zxcvbn-ts/language-da-dk@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed. The package now depends on `@zxcvbn-ts/dictionary-compression` ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# 4.0.0-beta.1 (2024-09-30)

### Features

- **languages:** add the Danish language package with translated feedback messages and dictionaries (common words, female and male first names, last names) ([#270](https://github.com/zxcvbn-ts/zxcvbn/issues/270)) ([a1b033d](https://github.com/zxcvbn-ts/zxcvbn/commit/a1b033d364a35a7098a2e731476bdd05dd7faafe))
