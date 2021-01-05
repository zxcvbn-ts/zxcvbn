# Getting started

## Install

#### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en --save`

#### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en`

#### old school:

Download the latest release from github

## Usage

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbn(password, options)
```

We highly recommend to always use the common and english language package for a useful scoring result.
If your own language is available as a package you should include it as well. If your language is missing feel free to open a PR in the meantime you can extend the default set.

The `esm` build is for modern browser and includes ES5 or higher.
If you want to use it and want to include own polyfills you need to transpile it within your build process:

## Change prior to original library
- I18n support for feedback and dictionaries. By default, the feedback are now keys
- All dictionaries are optional but highly recommend (wished feature in some issues)
- Dictionaries are separated from the core library this means zxcvbn-ts is relative small without dictionaries
- The project is a monorepo with a core library `@zxcvbn-ts/core` and language packages `@txcvbn-ts/language-en`. At the beginner, there is only a German and English language package.
- Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it. For example if you develop a Russian website the keyboard layouts are pretty much useless. 
  Now you could add a Russian keyboard layout by yourself for a fast implementation and create a PR for the long run.
- Multiple keyboard layouts are used which means that every layout that is added to the library will be checked against by default.
- Tests are now made with jest, so we get a coverage
- Included eslint/prettier for consistent code
- Added static-page docs https://zxcvbn-ts.github.io/zxcvbn/
- There is an esm, commonJS and browser build use it as needed
