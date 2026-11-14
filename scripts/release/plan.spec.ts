import {
  compareStableVersions,
  distTagFor,
  PackageState,
  planPackage,
  sortTopologically,
} from './plan.ts'

const head = 'a'.repeat(40)
const otherCommit = 'b'.repeat(40)

const state = (overrides: Partial<PackageState> = {}): PackageState => ({
  name: '@zxcvbn-ts/core',
  version: '4.3.0',
  dir: 'packages/libraries/main',
  internalDependencies: [],
  onNpm: false,
  npmLatest: '4.2.0',
  ...overrides,
})

describe('release plan', () => {
  describe('distTagFor', () => {
    it('uses latest for stable versions', () => {
      expect(distTagFor('4.3.0')).toBe('latest')
    })

    it('uses the prerelease id for prereleases', () => {
      expect(distTagFor('5.0.0-beta.0')).toBe('beta')
      expect(distTagFor('5.0.0-rc.12')).toBe('rc')
    })

    it('rejects prereleases without a name', () => {
      expect(() => distTagFor('5.0.0-0')).toThrow()
    })

    it('rejects invalid versions', () => {
      expect(() => distTagFor('5.0')).toThrow()
    })
  })

  describe('compareStableVersions', () => {
    it('compares numerically, not as strings', () => {
      expect(compareStableVersions('4.10.0', '4.9.9')).toBeGreaterThan(0)
      expect(compareStableVersions('4.3.1', '5.0.0')).toBeLessThan(0)
      expect(compareStableVersions('4.2.0', '4.2.0')).toBe(0)
    })

    it('rejects prereleases', () => {
      expect(() => compareStableVersions('5.0.0-beta.0', '4.2.0')).toThrow()
    })
  })

  describe('planPackage', () => {
    it('skips a version that is tagged on origin and on npm', () => {
      expect(
        planPackage(state({ onNpm: true, remoteTagCommit: head }), head),
      ).toBeUndefined()
    })

    it('tags, pushes and publishes a new version', () => {
      expect(planPackage(state(), head)).toEqual({
        name: '@zxcvbn-ts/core',
        version: '4.3.0',
        dir: 'packages/libraries/main',
        tagName: '@zxcvbn-ts/core@4.3.0',
        distTag: 'latest',
        createTag: true,
        pushTag: true,
        publish: true,
        questions: [],
      })
    })

    it('publishes a prerelease under its prerelease id', () => {
      const plan = planPackage(state({ version: '5.0.0-beta.0' }), head)
      expect(plan?.distTag).toBe('beta')
      expect(plan?.questions).toEqual([])
    })

    it('pushes a local tag that never reached origin, without recreating it', () => {
      const plan = planPackage(state({ localTagCommit: head }), head)
      expect(plan).toMatchObject({
        createTag: false,
        pushTag: true,
        publish: true,
        questions: [],
      })
    })

    it('only pushes the tag when the version is already on npm', () => {
      const plan = planPackage(
        state({ onNpm: true, localTagCommit: otherCommit }),
        head,
      )
      expect(plan).toMatchObject({
        createTag: false,
        pushTag: true,
        publish: false,
        questions: [],
      })
    })

    it('only publishes when the tag is already on origin at HEAD', () => {
      const plan = planPackage(
        state({ remoteTagCommit: head, localTagCommit: head }),
        head,
      )
      expect(plan).toMatchObject({
        createTag: false,
        pushTag: false,
        publish: true,
        questions: [],
      })
    })

    it('asks before publishing from HEAD when the tag points elsewhere', () => {
      const plan = planPackage(state({ remoteTagCommit: otherCommit }), head)
      expect(plan?.questions.map((question) => question.kind)).toEqual([
        'tag-not-at-head',
      ])
    })

    it('asks before tagging HEAD for a version that is on npm without a tag', () => {
      const plan = planPackage(state({ onNpm: true }), head)
      expect(plan).toMatchObject({ createTag: true, publish: false })
      expect(plan?.questions.map((question) => question.kind)).toEqual([
        'on-npm-without-tag',
      ])
    })

    it('asks before moving latest backwards', () => {
      const plan = planPackage(
        state({ version: '4.3.1', npmLatest: '5.0.0' }),
        head,
      )
      expect(plan?.questions.map((question) => question.kind)).toEqual([
        'latest-backwards',
      ])
    })

    it('does not guard latest for prereleases', () => {
      const plan = planPackage(
        state({ version: '4.0.0-beta.5', npmLatest: '4.2.0' }),
        head,
      )
      expect(plan?.questions).toEqual([])
    })

    it('does not guard latest for a first release', () => {
      const plan = planPackage(state({ npmLatest: undefined }), head)
      expect(plan?.questions).toEqual([])
    })
  })

  describe('sortTopologically', () => {
    it('puts dependencies before dependents', () => {
      const sorted = sortTopologically([
        { name: 'pwned', internalDependencies: ['core'] },
        { name: 'en', internalDependencies: [] },
        { name: 'core', internalDependencies: [] },
      ])
      expect(sorted.map((pkg) => pkg.name)).toEqual(['core', 'pwned', 'en'])
    })

    it('ignores dependencies outside the list', () => {
      const sorted = sortTopologically([
        { name: 'pwned', internalDependencies: ['core'] },
      ])
      expect(sorted.map((pkg) => pkg.name)).toEqual(['pwned'])
    })

    it('throws on cycles', () => {
      expect(() =>
        sortTopologically([
          { name: 'a', internalDependencies: ['b'] },
          { name: 'b', internalDependencies: ['a'] },
        ]),
      ).toThrow('cycle')
    })
  })
})
