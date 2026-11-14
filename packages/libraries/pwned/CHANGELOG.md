# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.1.3...@zxcvbn-ts/matcher-pwned@4.1.4) (2026-11-14)

### Bug Fixes

- **pwned:** `matcherPwnedFactory(fetch)` and `haveIBeenPwned(password)` work without a config object instead of throwing, and an empty `url` falls back to the default Have I Been Pwned API ([#344](https://github.com/zxcvbn-ts/zxcvbn/issues/344)) ([37cea12](https://github.com/zxcvbn-ts/zxcvbn/commit/37cea121683f97c8a84cdf9f291bbb42aa3cb360), [7008cf0](https://github.com/zxcvbn-ts/zxcvbn/commit/7008cf05aa42fa9348302e5d04aaa6d2a0b932c4))
- **pwned:** responses with LF line endings are matched too, not just CRLF, so pwned passwords checked through a proxy or custom endpoint are found ([7008cf0](https://github.com/zxcvbn-ts/zxcvbn/commit/7008cf05aa42fa9348302e5d04aaa6d2a0b932c4))
- **pwned:** every request failure goes to `networkErrorHandler` instead of throwing out of the check: a rejected `crypto.subtle.digest`, a `fetch` that throws synchronously, a failing `response.text()` and a response without a numeric status. Rejections that aren't `Error`s are wrapped in one ([7008cf0](https://github.com/zxcvbn-ts/zxcvbn/commit/7008cf05aa42fa9348302e5d04aaa6d2a0b932c4))
- **pwned:** `pwnedAmount` is 0 instead of `NaN` when the response has no count for the matched hash ([#344](https://github.com/zxcvbn-ts/zxcvbn/issues/344)) ([37cea12](https://github.com/zxcvbn-ts/zxcvbn/commit/37cea121683f97c8a84cdf9f291bbb42aa3cb360))

## [4.1.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.1.2...@zxcvbn-ts/matcher-pwned@4.1.3) (2026-08-12)

### Bug Fixes

- **deps:** requires @zxcvbn-ts/core ^4.2.0

## [4.1.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.1.1...@zxcvbn-ts/matcher-pwned@4.1.2) (2026-06-16)

### Bug Fixes

- **deps:** requires @zxcvbn-ts/core ^4.1.2

## [4.1.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.1.0...@zxcvbn-ts/matcher-pwned@4.1.1) (2026-06-13)

### Bug Fixes

- **deps:** requires @zxcvbn-ts/core ^4.1.1

# [4.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.4...@zxcvbn-ts/matcher-pwned@4.1.0) (2026-06-11)

First stable 4.x release. It includes every change from `4.0.0-beta.0` to `4.0.0-beta.4`.

### Bug Fixes

- **matcher-pwned:** compute the HIBP digest with Web Crypto (`crypto.subtle`) in every environment; the Node specific `require('crypto')` branch is removed ([#316](https://github.com/zxcvbn-ts/zxcvbn/issues/316)) ([f3ff059](https://github.com/zxcvbn-ts/zxcvbn/commit/f3ff059a5278922cfee043d70e8578b61e033056))

### BREAKING CHANGES

- **matcher-pwned:** `matcherPwnedFactory(universalFetch, options, config)` is now `matcherPwnedFactory(universalFetch, config)`; the matcher gets the options from the new `ZxcvbnFactory` instead ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3))
- **matcher-pwned:** the matcher now extends `MatcherBaseClass` from @zxcvbn-ts/core 4 ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))
- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The minified CDN build `dist/zxcvbn-ts.min.js` is no longer shipped; the IIFE build `dist/zxcvbn-ts.js` stays until 5.x ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb)) ([b34d1bf](https://github.com/zxcvbn-ts/zxcvbn/commit/b34d1bff9e79dc845b08bda6e1b7a71760555ac4))
- **deps:** requires @zxcvbn-ts/core ^4.1.0

# 4.0.0 (2026-06-11)

**Note:** 4.0.0 was tagged but never published to npm. Its changes are part of 4.1.0.

# [4.0.0-beta.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.0.0-beta.3...@zxcvbn-ts/matcher-pwned@4.0.0-beta.4) (2026-05-13)

### Bug Fixes

- **matcher-pwned:** compute the HIBP digest with Web Crypto (`crypto.subtle`) in every environment; the Node specific `require('crypto')` branch is removed ([#316](https://github.com/zxcvbn-ts/zxcvbn/issues/316)) ([f3ff059](https://github.com/zxcvbn-ts/zxcvbn/commit/f3ff059a5278922cfee043d70e8578b61e033056))
- **deps:** requires @zxcvbn-ts/core ^4.0.0-beta.4

# [4.0.0-beta.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.0.0-beta.2...@zxcvbn-ts/matcher-pwned@4.0.0-beta.3) (2026-03-04)

### BREAKING CHANGES

- **matcher-pwned:** the matcher now extends `MatcherBaseClass` and requires @zxcvbn-ts/core ^4.0.0-beta.3 ([#301](https://github.com/zxcvbn-ts/zxcvbn/issues/301)) ([8aba38e](https://github.com/zxcvbn-ts/zxcvbn/commit/8aba38eeabeb5b7eaed8d37330b024e66d34dc1e))

# [4.0.0-beta.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.0.0-beta.1...@zxcvbn-ts/matcher-pwned@4.0.0-beta.2) (2024-09-30)

### BREAKING CHANGES

- **build:** the dist files are renamed: `dist/index.js` is now `dist/index.cjs` and `dist/index.esm.js` is now `dist/index.mjs`. The IIFE browser build is removed ([#282](https://github.com/zxcvbn-ts/zxcvbn/issues/282)) ([4caf5e0](https://github.com/zxcvbn-ts/zxcvbn/commit/4caf5e086dad53b05496101c49b50309066822fb))
- **deps:** requires @zxcvbn-ts/core ^4.0.0-beta.2

# [4.0.0-beta.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@4.0.0-beta.0...@zxcvbn-ts/matcher-pwned@4.0.0-beta.1) (2024-09-30)

### Bug Fixes

- **deps:** requires @zxcvbn-ts/core ^4.0.0-beta.1

# [4.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.4...@zxcvbn-ts/matcher-pwned@4.0.0-beta.0) (2024-07-31)

### BREAKING CHANGES

- **matcher-pwned:** `matcherPwnedFactory(universalFetch, options, config)` is now `matcherPwnedFactory(universalFetch, config)`; the matcher gets the options from the new `ZxcvbnFactory` instead ([#244](https://github.com/zxcvbn-ts/zxcvbn/issues/244)) ([a66f27b](https://github.com/zxcvbn-ts/zxcvbn/commit/a66f27b3cf33227190fba5da5d42f2e26e0cd9f3))
- **deps:** requires @zxcvbn-ts/core ^4.0.0-beta.0

## [3.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.3...@zxcvbn-ts/matcher-pwned@3.0.4) (2023-09-17)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [3.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.2...@zxcvbn-ts/matcher-pwned@3.0.3) (2023-07-17)

### Bug Fixes

- **bundler:** resolve bundler issues where crypto is blocking ([a88df6f](https://github.com/zxcvbn-ts/zxcvbn/commit/a88df6fa12d8ec02ce32e5d01b4b3e62170c924d))

## [3.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.1...@zxcvbn-ts/matcher-pwned@3.0.2) (2023-06-06)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [3.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@3.0.0...@zxcvbn-ts/matcher-pwned@3.0.1) (2023-05-10)

### Bug Fixes

- **pwned:** ignore passwords with a length < 2 ([346afff](https://github.com/zxcvbn-ts/zxcvbn/commit/346afff3bdcb1531e6ed7ff2b3f26b21e07e7855))

# [3.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.9...@zxcvbn-ts/matcher-pwned@3.0.0) (2023-05-07)

### BREAKING CHANGES

- pwned matcher packages no longer has a default export.

## [2.0.9](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.8...@zxcvbn-ts/matcher-pwned@2.0.9) (2023-02-06)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.8](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.7...@zxcvbn-ts/matcher-pwned@2.0.8) (2023-01-27)

### Bug Fixes

- **pwned:** resolve paths so they are usable ([d5737aa](https://github.com/zxcvbn-ts/zxcvbn/commit/d5737aa82ddea0928db4997f587ceee302ff79a3))
- **pwned:** use correct type imports path ([b2770cc](https://github.com/zxcvbn-ts/zxcvbn/commit/b2770cc4b7461f615f4f6199430d9db59b9aa565))

## [2.0.7](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.6...@zxcvbn-ts/matcher-pwned@2.0.7) (2022-10-18)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.6](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.5...@zxcvbn-ts/matcher-pwned@2.0.6) (2022-09-12)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.5](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.4...@zxcvbn-ts/matcher-pwned@2.0.5) (2022-08-04)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.4](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.3...@zxcvbn-ts/matcher-pwned@2.0.4) (2022-07-27)

### Bug Fixes

- **pwned:** catch pwned errors and return false ([a42483c](https://github.com/zxcvbn-ts/zxcvbn/commit/a42483c57a2d91f92177d9ce2058ace08573a952))

## [2.0.3](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.2...@zxcvbn-ts/matcher-pwned@2.0.3) (2022-07-17)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.2](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.1...@zxcvbn-ts/matcher-pwned@2.0.2) (2022-07-17)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

## [2.0.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@2.0.0...@zxcvbn-ts/matcher-pwned@2.0.1) (2022-03-17)

**Note:** Version bump only for package @zxcvbn-ts/matcher-pwned

# [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@1.2.0...@zxcvbn-ts/matcher-pwned@2.0.0) (2022-02-09)

### Bug Fixes

- **translations:** transfer ZxcvbnOptions as parameter ([3ff0f75](https://github.com/zxcvbn-ts/zxcvbn/commit/3ff0f751890a24b8cbb39aad78875e13ed5e6b6d))

### Features

- **pwned:** use try/catch for TextEncoder ([0a46bf7](https://github.com/zxcvbn-ts/zxcvbn/commit/0a46bf7a0f6f08059f60efac145be15043c8540d))

# 1.2.0 (2021-12-15)

### Bug Fixes

- **pwned:** add missing check ([5f6dbc5](https://github.com/zxcvbn-ts/zxcvbn/commit/5f6dbc585b32023d6a8c1317cbfcdcec568c2c52))
- **pwned:** add missing props ([0f59ca5](https://github.com/zxcvbn-ts/zxcvbn/commit/0f59ca5aea88763920f31859ad992135fd4c6df1))
- **pwned:** resolve repeat can be async too ([05298b1](https://github.com/zxcvbn-ts/zxcvbn/commit/05298b107085dfd1ca7a1914f4ac81443dcd6a39))

### Features

- **project:** Add HaveIBeenPwned matcher ([#66](https://github.com/zxcvbn-ts/zxcvbn/issues/66)) ([5c4141c](https://github.com/zxcvbn-ts/zxcvbn/commit/5c4141cd34f6566fe753ce76572f74bb8229b414))

# 1.1.0 (2021-12-14)

### Features

- **project:** move pwned matcher into own package ([26290d7](https://github.com/zxcvbn-ts/zxcvbn/commit/26290d7ac43174ca9fcecabc5869b79965702cc3))
