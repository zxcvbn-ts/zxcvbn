const prettierConfig = require('./prettier')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:compat/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  plugins: ['import', 'prettier', 'jest', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', './'],
          ['@', './src'],
        ],
        extensions: ['.js', '.ts', '.d.ts'],
      },
    },
  },
  rules: {
    'arrow-body-style': 'off',
    'prettier/prettier': ['error', prettierConfig],
    'import/no-extraneous-dependencies': 'off',
    'semi': ['error', 'never'],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'max-lines-per-function': [
      'error',
      {
        max: 100,
        skipComments: true,
        skipBlankLines: true,
      },
    ],
    'max-nested-callbacks': ['warn', { max: 3 }],
    'max-statements': [
      'warn',
      {
        max: 14,
      },
      {
        ignoreTopLevelFunctions: false,
      },
    ],
    'complexity': [
      'warn',
      {
        max: 8,
      },
    ],
    'max-depth': [
      'warn',
      {
        max: 4,
      },
    ],
    'max-params': [
      'warn',
      {
        max: 3,
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never',
      },
    ],

    // Disabling eslint rule and enabling typescript specific to support TS features
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    'class-methods-use-this': 0,

    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.config.ts', '*.config.js', '**/test/**/*.ts'],
      rules: {
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'max-nested-callbacks': 'off',
        'complexity': 'off',
        'max-params': 'off',
      },
    },
    {
      files: [
        './data-scripts/**/*.ts',
        '*.spec.ts',
        '*.config.ts',
        '*.config.js',
        '**/test/**/*.ts',
      ],
      rules: {
        'import/no-relative-packages': 'off',
      },
    },
    {
      files: ['./scripts/rollup.config.mjs', './scripts/jsonPlugin.mjs'],
      rules: {
        'compat/compat': 'off',
        'max-statements': 'off',
      },
    },
  ],
  env: {
    browser: true,
  },
}
