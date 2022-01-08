import path from 'path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import json from './jsonPlugin'

const packagePath = process.cwd()
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(packagePath, 'package.json'))

let generateCounter = 0
const generateConfig = (type) => {
  let typescriptOptions = {
    declaration: false,
  }
  let babelrc = true
  const output = {
    dir: 'dist/',
    format: type,
    entryFileNames: '[name].js',
    assetFileNames: '[name].js',
    sourcemap: true,
    exports: 'named',
  }
  if (type === 'esm') {
    typescriptOptions = {
      declarationDir: `dist/`,
      declaration: true,
      rootDir: 'src/',
      exclude: ['test/**/*', 'dist/**/*'],
    }
    output.entryFileNames = '[name].esm.js'
    output.assetFileNames = '[name].esm.js'
    babelrc = false
  }

  if (type === 'iife') {
    output.name = pkg.name.replace('@', '').replace('-', '').replace('/', '.')
    output.entryFileNames = 'zxcvbn-ts.js'
    output.assetFileNames = 'zxcvbn-ts.js'
  }

  const pluginsOnlyOnce = []
  if (generateCounter === 0) {
    pluginsOnlyOnce.push(
      del({
        targets: 'dist/*',
      }),
    )

    generateCounter += 1
  }

  return {
    input: ['./src/index.ts'],
    output,
    plugins: [
      ...pluginsOnlyOnce,
      json(),
      typescript(typescriptOptions),
      commonjs(),
      babel({
        extensions: ['.ts'],
        babelHelpers: 'bundled',
        babelrc,
      }),
    ],
    preserveModules: type !== 'iife',
  }
}

export default [
  generateConfig('esm'),
  generateConfig('cjs'),
  generateConfig('iife'),
]
