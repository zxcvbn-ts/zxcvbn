# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.1.1...@zxcvbn-ts/language-ar@4.2.0) (2026-08-12)

### Features

- **dictionaries:** add a list of common Arabic words (`commonWords-ar`). Passwords built from common Arabic words now score lower ([#341](https://github.com/zxcvbn-ts/zxcvbn/issues/341)) ([ac0ef46](https://github.com/zxcvbn-ts/zxcvbn/commit/ac0ef464e8d8f6bac9dd6744cd71d8bcefba66fd))

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.1.0...@zxcvbn-ts/language-ar@4.1.1) (2026-06-16)

### Bug Fixes

- **build:** fix `require()` of the CJS build, which failed with "decompress is not a function" ([#324](https://github.com/zxcvbn-ts/zxcvbn/issues/324)) ([281ead6](https://github.com/zxcvbn-ts/zxcvbn/commit/281ead6d7c681dde716705e3d8bee23999274c0e))

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@3.1.0...@zxcvbn-ts/language-ar@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime with `@zxcvbn-ts/dictionary-compression`, which is now a dependency ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The minified CDN build `dist/zxcvbn-ts.min.js` is no longer shipped; the IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))

- **dictionaries:** the dictionary keys are renamed: `firstnames` is now `firstnames-ar`, `lastnames` is now `lastnames-ar`. The empty `wikipedia` list is removed. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([#307](https://github.com/zxcvbn-ts/zxcvbn/issues/307)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec)) ([9f830ba](https://github.com/zxcvbn-ts/zxcvbn/commit/9f830ba77923083642a43337ceca9cb69d8555f2))

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.0.0-beta.3...@zxcvbn-ts/language-ar@4.0.0-beta.4) (2026-05-13)

**Note:** Version bump only for package @zxcvbn-ts/language-ar

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.0.0-beta.2...@zxcvbn-ts/language-ar@4.0.0-beta.3) (2026-03-04)

### Bug Fixes

- **dictionaries:** ship the dictionaries without gzip/base64 encoding again, as it increased the bundle size in the browser. The decompression now comes from the external `@zxcvbn-ts/dictionary-compression` ^3.0.1 ([#294](https://github.com/zxcvbn-ts/zxcvbn/issues/294)) ([c8f1f79](https://github.com/zxcvbn-ts/zxcvbn/commit/c8f1f79a4848c7ff69b892ec005b9bd2f48e62d1))

### BREAKING CHANGES

- **dictionaries:** remove the empty `wikipedia-ar` list ([#307](https://github.com/zxcvbn-ts/zxcvbn/issues/307)) ([9f830ba](https://github.com/zxcvbn-ts/zxcvbn/commit/9f830ba77923083642a43337ceca9cb69d8555f2))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.0.0-beta.1...@zxcvbn-ts/language-ar@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed. The package now depends on `@zxcvbn-ts/dictionary-compression` ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@4.0.0-beta.0...@zxcvbn-ts/language-ar@4.0.0-beta.1) (2024-09-30)

### Features

- **dictionaries:** ship the dictionaries compressed and decompress them at runtime ([#276](https://github.com/zxcvbn-ts/zxcvbn/issues/276)) ([c317614](https://github.com/zxcvbn-ts/zxcvbn/commit/c317614cd758416a71f9adcb2e9d7caf125a23f7))

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ar@3.1.0...@zxcvbn-ts/language-ar@4.0.0-beta.0) (2024-07-31)

### Bug Fixes

- **dictionaries:** the dictionary keys now carry the language code. Before, merging the dictionaries of several languages (`{ ...en.dictionary, ...de.dictionary }`) let lists with the same key overwrite each other, so only the last language's words and names were checked and passwords from the other languages were rated stronger than they are ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

### BREAKING CHANGES

- **dictionaries:** the dictionary keys are renamed: `firstnames` is now `firstnames-ar`, `lastnames` is now `lastnames-ar`, `wikipedia` is now `wikipedia-ar`. This only affects code that reads the keys directly ([#249](https://github.com/zxcvbn-ts/zxcvbn/issues/249)) ([f601f8f](https://github.com/zxcvbn-ts/zxcvbn/commit/f601f8f8d9945a232996fa30074f941ee57f8cec))

# 3.1.0 (2023-09-17)

### Features

- **languages:** Add Arabic Language Package ([#229](https://github.com/zxcvbn-ts/zxcvbn/issues/229)) ([04c4a1f](https://github.com/zxcvbn-ts/zxcvbn/commit/04c4a1f24a1b72ed3ad6687caab72d4751306219))
