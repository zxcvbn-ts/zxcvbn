---
name: release
description: Prepare a release of the zxcvbn-ts packages: pick versions, update dependency ranges and write CHANGELOG.md entries from the diffs, left uncommitted for review. Use for "prepare a release", "prepare a beta release", "finish the beta", or `/release [beta|finish-beta]`.
argument-hint: "[beta|finish-beta]"
---

# Prepare a release

Arguments: `$ARGUMENTS`. Empty means a stable release, `beta` a beta release, `finish-beta` moves the packages in an open beta series to stable.

This skill is the **prepare** half. It edits `version` fields, internal dependency ranges and `CHANGELOG.md` files, and nothing else. The maintainer reviews, commits, then runs `yarn release`, which builds, tags, pushes and publishes whatever is committed but not yet on origin or npm. Leave every change uncommitted: committing, tagging and publishing are the maintainer's.

Publishable packages: every non-private `package.json` under `packages/libraries/*` and `packages/languages/*`.

## Steps

### 1. Find candidates

For each publishable package:

- **Last release**: its newest tag `<name>@<version>`, found with `git -c versionsort.suffix=- tag --list '<name>@*' --sort=-v:refname | head -1`. Use the tag, never the `package.json` version, so a second run before publishing builds on its own uncommitted bumps instead of bumping twice.
- **Last stable release**: its newest tag without a prerelease part.
- **Open beta series**: the newest tag is a prerelease (e.g. `5.0.0-beta.2`).
- **Commits since**: `git log <last release tag>..HEAD -- <package dir>`.

Shared build inputs make every package a candidate: `scripts/rollup.config.mjs`, `scripts/jsonPlugin.mjs`, the root `tsconfig.json`, and root `package.json` dependencies that end up in bundles (`@zxcvbn-ts/dictionary-compression`'s decompressor is bundled into every package with dictionaries; babel and rollup plugins change emitted code). Judge per package whether its built output actually changes.

Done when every publishable package has a last release, a last stable release and a commit list (possibly empty).

### 2. Read the changes

For every candidate commit, read the body, the diff of published files (`src`, `package.json`, README, NOTICE, licence) and the tests added with it. Squash-merged PRs bundle many changes behind one subject; the tests show the user-visible effect best. Look up the PR number from the subject `(#123)` when there is one.

Done when you can say, for each candidate package, every user-visible change and the commit and PR it came from.

### 3. Decide per package

- Changes that never reach users (tests only, repo tooling, unpublished files): **skip**, and list the package with the reason.
- Only non-code changes to published files (README, NOTICE, licence): list the package and **ask** the maintainer.
- Something a user of the package would notice: **release**.
- A dependency range that has to change (step 5): **release**.

### 4. Pick versions

Which kind each released package gets:

- In an open beta series, and the argument isn't `finish-beta`: the **next beta**.
- `finish-beta`: packages in an open beta series go **stable**, at the series' target version (`5.0.0-beta.3` → `5.0.0`).
- Otherwise **stable**, or with `beta` the **first beta** of a new series.

One run can mix kinds; the handover table shows which is which and the maintainer can move a package between them.

Stable, from the last release:
- **major**: a breaking change to the public API or documented behaviour
- **minor**: a new feature, option or export
- **patch**: fixes and performance only

Changes that move scores (guesses, score, feedback) are called out in the changelog; they aren't breaking on their own.

Beta:
- The first beta is `<target>-beta.0`. Propose the target (usually the next major) and get the maintainer's confirmation before writing anything.
- Later betas increment the number: `5.0.0-beta.2` → `5.0.0-beta.3`.
- Only packages that changed, or need a range update, get a beta.

### 5. Update dependency ranges

The internal dependencies are in each package's `dependencies` (today only `@zxcvbn-ts/matcher-pwned` → `@zxcvbn-ts/core`). For each new version:

- If it falls outside a dependent's range (a core major; a core beta against `^4.2.0`), update the range and release the dependent too. Its changelog entry says the range changed.
- If the dependent's own changes rely on something only in the new version, raise the range.
- Otherwise leave the range alone. A release that only bumps a version has no place here.

### 6. Write the changelog entries

Prepend one entry per released package to its `CHANGELOG.md`, below the `# Change Log` header block, in the format in the next section, with today's date. Each entry is written for a **user of the package**:

- what changed for them, with a concrete example (a password, an option, a call) where it helps
- fixes that change scores, listed first among the bug fixes, overestimation fixes (passwords rated stronger than they are) before the rest; say which way scores move
- changes that only apply with an option name the option
- one bullet per change, even when one PR carries a dozen; one bullet with nested sub-bullets when several changes share a scope and a condition
- every bullet links its PR and commit

Leave out internal refactors, test-only changes, and anything introduced and fixed between the two releases: users never had that bug.

Scope of the entry:
- **Stable**: changes since the last release.
- **Beta**: changes since the previous beta; for `beta.0`, since the last stable release.
- **Stable after a beta series**: everything since the last stable release, compare link from the last stable tag. The beta entries stay below it as history.

**First run only:** if `packages/libraries/main/CHANGELOG-4.3.0.md` exists, it is a reviewed draft of core's next entry. Fold it into core's `CHANGELOG.md`, update it for anything merged since and for the version you picked, and delete the draft file.

Done when every released package has an entry, every user-visible change from step 2 appears in exactly one bullet, and every bullet has its links.

### 7. Hand over

Print:

1. A table: package, old → new version, dist-tag (`latest`, or the prerelease id such as `beta`), kind (stable / beta), one-line reason.
2. Skipped packages, each with its reason.
3. Open questions (first beta target, README-only packages, anything you weren't sure about).
4. Next steps: review and edit the changes, commit them, run `yarn release`.

## Changelog format

The format conventional-changelog wrote so far; match the existing entries exactly.

```markdown
# [4.3.0](https://github.com/zxcvbn-ts/zxcvbn/compare/@zxcvbn-ts/core@4.2.0...@zxcvbn-ts/core@4.3.0) (2026-11-03)

### Bug Fixes

- **scope:** what changed for the user ([#351](https://github.com/zxcvbn-ts/zxcvbn/issues/351)) ([cc45dd7](https://github.com/zxcvbn-ts/zxcvbn/commit/cc45dd7650e5232c0c324e98daf84a3a133d1e9c))

### Features

### Performance Improvements

### BREAKING CHANGES
```

- Heading level: `#` for major and minor releases, `##` for patch releases. A prerelease takes the level of its target (`5.0.0-beta.1` → `#`).
- Compare link: `<previous tag>...<new tag>`, previous tag being the one the entry's scope starts from (step 6).
- Sections in this order, only those with bullets.
- `**scope:**` is optional; use the matcher or area name (`l33t`, `levenshtein`, `options`).
- Links: PR as `([#N](https://github.com/zxcvbn-ts/zxcvbn/issues/N))`, commit as `([abbrev7](https://github.com/zxcvbn-ts/zxcvbn/commit/<full sha>))`. Several of either go comma-separated inside one pair of parentheses. Commits without a PR get only the commit link.
- A short paragraph under a section heading is fine when it applies to all bullets (e.g. "most of these fixes lower the guesses for …").
- A range change: `- **deps:** requires @zxcvbn-ts/core ^5.0.0` under Bug Fixes, or under BREAKING CHANGES when users must upgrade core with it.
