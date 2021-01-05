# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

#[0.1.0](https://github.com/zxcvbn-ts/zxcvbn/compare/v4.4.2...dropbox:v0.1.0) (2021-01-05)

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
