module.exports = {
  // test-files end on .test.{} or .spec.{}
  // for js, jsx, ts, tsx
  testRegex: '((\\.|/)(test|spec))\\.(j|t)sx?$',
  coverageDirectory: './test/unit/coverage',
  // automatically clear all mocks since preserved mock state
  // (e.g. hasBeenCalled) can produce false-negatives
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|js|mjs)$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'json', 'js'],
  collectCoverageFrom: ['packages/libraries/main/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['dist', 'test'],
}
