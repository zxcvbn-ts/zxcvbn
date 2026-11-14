// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // automatically clear all mocks since preserved mock state
    // (e.g. hasBeenCalled) can produce false-negatives
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './test/unit/coverage',
      include: ['packages/libraries/main/**/*.{js,ts}'],
      exclude: ['**/dist/**', '**/test/**'],
    },
    isolate: false,
  },
})
