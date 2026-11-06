# zxcvbn-ts

Realistic password strength estimation, written in TypeScript — a rewrite of Dropbox's zxcvbn.

## Structure

Yarn workspaces + Lerna monorepo (independent versioning):

- `packages/libraries/main` — `@zxcvbn-ts/core`, the estimator itself (matchers, scoring, feedback)
- `packages/libraries/pwned` — Have I Been Pwned matcher extension
- `packages/languages/*` — one package per language (dictionaries + translated feedback), plus `languages/common` for shared adjacency graphs, password lists, and diceware data
- `docs/` — VuePress documentation site
- `data-scripts/` — scripts that generate/dedupe language dictionary data

## Commands

- `yarn build` — build all packages (rollup, via lerna, in parallel)
- `yarn lint` / `yarn lint:fix` — eslint
- `yarn typecheck` — `tsc --noEmit` across the repo
- `yarn test` — full vitest suite with coverage (coverage is only collected for `packages/libraries/main`, even though other packages have their own specs)
- `yarn test:types` — `attw --pack` per package; checks published type resolution
- `yarn docs:dev` / `yarn docs:build` — VuePress docs site
- `yarn release` — maintainer-only: tags, pushes and publishes the committed versions. Versions and changelogs are prepared beforehand with the `release` skill

Faster iteration loops:
- `yarn -s test:silent [path]` — use this when running tests as an AI agent: prints only failures and the summary, hides console output from passing tests, no coverage table
- `yarn -s test:coverage:silent [path]` — the same plus overall coverage percentages, without the per-file table or uncovered lines (`yarn test` has those)
- `yarn -s benchmark:silent [--targets local,4.2.0] [--scenarios common,long]` — use this when running the benchmark as an AI agent: same measurements and options as `yarn benchmark`, printed as a compact table
- `yarn -s typecheck` / `yarn -s lint` — `-s` hides yarn's own noise; there are no agent-specific variants, so output is plain tsc / eslint stylish (absolute paths, grouped per file)
- `npx vitest run packages/libraries/main` — just the core package's tests
- `npx tsc --noEmit -p .` — typecheck without rebuilding
- `npx lerna exec --scope @zxcvbn-ts/core -- rollup -c ../../../scripts/rollup.config.mjs` — build only core

## Conventions

- Node version is pinned in `.nvmrc`; package manager is Yarn (workspaces).
- Adding a new language package follows the guide at `docs/guide/languages` — not duplicated here.
- A bug that makes a password look *stronger* than it really is (overestimated guesses) is not lower severity than one that makes it look weaker. Both mislead the user; overestimation is the specific failure mode this library exists to prevent. Fix and test it with the same priority.

## Working here

Keep this file to standing, always-true project facts. Anything workflow-specific — a multi-step release process, a one-off migration, a recurring but situational task — belongs in a dedicated skill under `.claude/skills/`, not appended here: skills load on demand, this file loads on every turn.
