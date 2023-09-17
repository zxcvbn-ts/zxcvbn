# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

# [2.0.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/matcher-pwned@1.2.0...@zxcvbn-ts/matcher-pwned@2.0.0) (2022-02-10)

### Bug Fixes

- **translations:** transfere ZxcvbnOptions as parameter ([3ff0f75](https://github.com/zxcvbn-ts/zxcvbn/commit/3ff0f751890a24b8cbb39aad78875e13ed5e6b6d))

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
