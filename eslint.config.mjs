import { defineConfig, globalIgnores } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import jest from 'eslint-plugin-jest'
import compatPlugin from 'eslint-plugin-compat'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import sortClassMembers from 'eslint-plugin-sort-class-members'
import prettierConfig from './prettier.mjs'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores([
    '**/.vuepress',
    '**/node_modules',
    '**/dist',
    '**/dist2',
    '**/demo',
    '**/coverage',
    'data-scripts/wikiExtractor/extracts',
    '**/dist_new',
  ]),
  js.configs.recommended,
  ...compat.extends('airbnb-base'),
  compatPlugin.configs['flat/recommended'],
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sortClassMembers.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
      parser: tsParser,
      parserOptions: {
        project: true,
        __tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },

    extends: compat.extends('airbnb-base'),

    plugins: {
      import: importPlugin,
      jest,
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
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowNever: true,
        },
      ],
      // TODO temporary disable strict any rules to fix the "easy" once first
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
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
      'compat/compat': 'off',
    },
  },
  {
    files: ['./scripts/rollup.config.mjs', './scripts/jsonPlugin.mjs'],

    rules: {
      'compat/compat': 'off',
      'max-statements': 'off',
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
])
