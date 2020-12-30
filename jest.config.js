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
  globals: {
    'ts-jest': {
      // allow settings from a projects babel config
      // to be considered in .ts files during test execution
      // (e.g. optional-chaining otherwise causes errors in tests)
      // https://kulshekhar.github.io/ts-jest/user/config/babelConfig#use-default-babelrc-file
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'json', 'js'],
  collectCoverageFrom: ['packages/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['dist'],
}
