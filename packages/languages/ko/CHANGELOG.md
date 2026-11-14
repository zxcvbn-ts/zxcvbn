# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.3.1](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ko@4.3.0...@zxcvbn-ts/language-ko@4.3.1) (2026-11-14)

**Note:** README update only: install commands for npm, yarn and pnpm, what the package includes, a usage example with `result.score` and `result.feedback`, linked dictionary sources and links to the documentation ([8d455f6](https://github.com/zxcvbn-ts/zxcvbn/commit/8d455f69dafe2f4f57e94b18be49a888c18d83ad))

# [4.3.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/language-ko@4.2.0...@zxcvbn-ts/language-ko@4.3.0) (2026-08-12)

### Features

- **dictionaries:** add Korean dictionaries: common words, first names, last names (`commonWords-ko`, `firstnames-ko`, `lastnames-ko`) and word sequences. 4.2.0 shipped only the translations, so Korean words and names were not recognised; passwords built from them now score lower ([#341](https://github.com/zxcvbn-ts/zxcvbn/issues/341)) ([ac0ef46](https://github.com/zxcvbn-ts/zxcvbn/commit/ac0ef464e8d8f6bac9dd6744cd71d8bcefba66fd))

# 4.2.0 (2026-07-16)

### Features

- **languages:** add the Korean language package with translated feedback messages. It ships no dictionaries yet ([#328](https://github.com/zxcvbn-ts/zxcvbn/issues/328)) ([1a9da30](https://github.com/zxcvbn-ts/zxcvbn/commit/1a9da30fa2009576478fb5b348b3e60cc252e809))
