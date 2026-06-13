import { readFileSync } from 'fs'
import { builtinModules } from 'module'
import process from 'process'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import json from './jsonPlugin.mjs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((id) => new RegExp(`^${id}($|/)`))

export default [
  {
    input: ['./src/index.ts'],
    plugins: [
      del({
        targets: 'dist/*',
      }),
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
    output: [
      {
        dir: 'dist/',
        format: 'esm',
        entryFileNames: '[name].mjs',
        assetFileNames: '[name].mjs',
        sourcemap: false,
        preserveModules: true,
        exports: 'named',
      },
    ],
  },
]
