const { defineConfig, globalIgnores } = require('eslint/config')
const tsParser = require('@typescript-eslint/parser')
const importPlugin = require('eslint-plugin-import')
const prettier = require('eslint-plugin-prettier')
const jest = require('eslint-plugin-jest')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const js = require('@eslint/js')
const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
const prettierConfig = require('./prettier')

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
    },

    extends: compat.extends(
      'airbnb-base',
      'plugin:compat/recommended',
      'prettier',
      'plugin:jest/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
    ),

    plugins: {
      'import': importPlugin,
      prettier,
      jest,
      '@typescript-eslint': typescriptEslint,
    },

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

      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],

      'max-lines-per-function': [
        'error',
        {
          max: 100,
          skipComments: true,
          skipBlankLines: true,
        },
      ],

      'max-nested-callbacks': [
        'warn',
        {
          max: 3,
        },
      ],

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
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.config.ts',
      '**/*.config.js',
      '**/test/**/*.ts',
    ],

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
      '**/*.spec.ts',
      '**/*.config.ts',
      '**/*.config.js',
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
  globalIgnores([
    '**/.cache',
    '**/.temp',
    '**/node_modules',
    '**/dist',
    '**/dist2',
    '**/demo',
    '**/coverage',
    'data-scripts/wikiExtractor/extracts',
    '**/dist_new',
  ]),
])
