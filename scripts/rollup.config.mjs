import { readFileSync } from 'fs'
import { builtinModules } from 'module'
import process from 'process'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from './jsonPlugin.mjs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((id) => new RegExp(`^${id}($|/)`))

const defaultConfig = {
  input: ['./src/index.ts'],
  plugins: [
    json(),
    typescript({
      declarationDir: `dist/`,
      declaration: true,
      rootDir: 'src/',
      exclude: ['test/**/*', 'dist/**/*'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
    }),
    commonjs(),
    babel({
      extensions: ['.ts'],
      babelHelpers: 'bundled',
      babelrc: false,
    }),
    process.env.NODE_ENV === 'production' ? terser() : null,
  ],
  external,
}
export default [
  {
    ...defaultConfig,
    plugins: [
      ...defaultConfig.plugins,
      del({
        targets: 'dist/*',
      }),
    ],
    output: [
      {
        dir: 'dist/',
        format: 'esm',
        entryFileNames: '[name].mjs',
        assetFileNames: '[name].mjs',
        sourcemap: true,
        preserveModules: true,
        exports: 'named',
      },
      {
        dir: 'dist/',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        assetFileNames: '[name].cjs',
        sourcemap: true,
        preserveModules: true,
        exports: 'auto',
        interop: 'auto',
      },
    ],
  },
  {
    ...defaultConfig,
    output: [
      {
        dir: 'dist/',
        format: 'iife',
        entryFileNames: 'zxcvbn-ts.js',
        assetFileNames: 'zxcvbn-ts.js',
        name: pkg.name.replace('@', '').replace('-', '').replace('/', '.'),
        sourcemap: true,
        preserveModules: false,
      },
    ],
    external: [],
    plugins: [
      ...defaultConfig.plugins,
      nodeResolve({
        resolveOnly: [
          'fastest-levenshtein',
          '@zxcvbn-ts/dictionary-compression',
        ],
      }),
    ],
  },
]
