# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.3.0...@zxcvbn-ts/core@1.0.0-beta.0) (2021-06-08)


### Bug Fixes

* **main:** fix internal match types ([#41](https://github.com/zxcvbn-ts/zxcvbn/issues/41)) ([968e5d5](https://github.com/zxcvbn-ts/zxcvbn/commit/968e5d5b3ce48a7dd09a4c66fcbc2543be785e5b))
* **main:** use internal matcher parts seperatly ([#55](https://github.com/zxcvbn-ts/zxcvbn/issues/55)) ([792a94f](https://github.com/zxcvbn-ts/zxcvbn/commit/792a94f99623bd528a3b2a65035c049c4d2d4c40))
* **scoring:** Add support for blank passwords ([#51](https://github.com/zxcvbn-ts/zxcvbn/issues/51)) ([4c8482b](https://github.com/zxcvbn-ts/zxcvbn/commit/4c8482bfbc329baf1eeb67611b4a7f7624fc55cd))
* **scoring:** resolve spatial wrong guesses ([fe38131](https://github.com/zxcvbn-ts/zxcvbn/commit/fe381314cd61d3b0aeb9b42e496f5c02ba28acb1))


### Features

* **dictionaries:** remove single chars ([#40](https://github.com/zxcvbn-ts/zxcvbn/issues/40)) ([97dc856](https://github.com/zxcvbn-ts/zxcvbn/commit/97dc8562a4176f34c10fbb1cefce8d55cfbae25a))
* **feedback:** add warning for userInputs dictionary ([#38](https://github.com/zxcvbn-ts/zxcvbn/issues/38)) ([c7dd4a2](https://github.com/zxcvbn-ts/zxcvbn/commit/c7dd4a27cdd787b91b0234d88fbf3340738e9027))
* **languages:** Add deduplication functionality ([#54](https://github.com/zxcvbn-ts/zxcvbn/issues/54)) ([d98c49f](https://github.com/zxcvbn-ts/zxcvbn/commit/d98c49f11f05109f16ac4d5fbdd8cb1c0805eb1d))
* **matcher:** Make matcher customizable  ([#48](https://github.com/zxcvbn-ts/zxcvbn/issues/48)) ([8667485](https://github.com/zxcvbn-ts/zxcvbn/commit/866748556b576d15266725e44d6c99d38165cc95))





# [0.3.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.1.0...@zxcvbn-ts/core@0.3.0) (2021-03-03)


### Bug Fixes

* **feedback:** get feedback for gendered firstnames ([41ce7f5](https://github.com/zxcvbn-ts/zxcvbn/commit/41ce7f500220f77b81382a6185d4f3801579c737))
* **main:** resolve performance issues ([e8142cb](https://github.com/zxcvbn-ts/zxcvbn/commit/e8142cb6b1bb242aa433325e6a560b600aa10100))
* **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))


### Features

* **keyboard:** Add new AZERTY keyboard layout ([#17](https://github.com/zxcvbn-ts/zxcvbn/issues/17)) ([f0a7382](https://github.com/zxcvbn-ts/zxcvbn/commit/f0a7382e9b4a140b97967c3c546f2217d64a5e14))
* **translations:** improve straight row translation ([#22](https://github.com/zxcvbn-ts/zxcvbn/issues/22)) ([9e1f6e0](https://github.com/zxcvbn-ts/zxcvbn/commit/9e1f6e073f2baf5fb72a9eb507a7f0ad59dd32e9))


### BREAKING CHANGES

* **main:** the library serves now only named exports and the options need to be set with `ZxcvbnOptions.setOptions`





# [0.2.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@0.1.0...@zxcvbn-ts/core@0.2.0) (2021-01-18)


### Bug Fixes

* **feedback:** get feedback for gendered firstnames ([41ce7f5](https://github.com/zxcvbn-ts/zxcvbn/commit/41ce7f500220f77b81382a6185d4f3801579c737))
* **rollup:** Fix browser package ([#18](https://github.com/zxcvbn-ts/zxcvbn/issues/18)) ([444aabd](https://github.com/zxcvbn-ts/zxcvbn/commit/444aabd4c37d449f600eaa4ad6d144f3c8ca5780))


### Features

* **keyboard:** Add new AZERTY keyboard layout ([#17](https://github.com/zxcvbn-ts/zxcvbn/issues/17)) ([f0a7382](https://github.com/zxcvbn-ts/zxcvbn/commit/f0a7382e9b4a140b97967c3c546f2217d64a5e14))
* **translations:** improve straight row translation ([#22](https://github.com/zxcvbn-ts/zxcvbn/issues/22)) ([9e1f6e0](https://github.com/zxcvbn-ts/zxcvbn/commit/9e1f6e073f2baf5fb72a9eb507a7f0ad59dd32e9))





# [0.1.0](https://github.com/dropbox/zxcvbn/compare/v4.4.2...zxcvbn-ts:@zxcvbn-ts/core@0.1.0) (2021-01-05)

## Features

* **project:** I18n support for feedback and dictionaries. By default, the feedback are now keys
* **project:** All dictionaries are optional but highly recommend (wished feature in some issues)
* **project:** Dictionaries are separated from the core library this means zxcvbn-ts is relative small without dictionaries
* **project:** The project is a monorepo with a core library `@zxcvbn-ts/core` and language packages `@txcvbn-ts/language-en`. At the beginner, there is only a German and English language package.
* **grahps:** Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it. For example if you develop a Russian website the keyboard layouts are pretty much useless.
* **grahps:** Now you could add a Russian keyboard layout by yourself for a fast implementation and create a PR for the long run.
* **grahps:** Multiple keyboard layouts are used which means that every layout that is added to the library will be checked against by default.
* **tests:** Tests are now made with jest, so we get a coverage
* **setup:** Included eslint/prettier for consistent code
* **setup:** There is an esm, commonJS and browser build use it as needed
* **docs:** Added static-page docs https://zxcvbn-ts.github.io/zxcvbn/
