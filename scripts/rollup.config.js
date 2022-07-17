import path from 'path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
// TODO commented because of ./vendor/fastest-levenshtein.ts
// import nodeResolve from '@rollup/plugin-node-resolve'
import json from './jsonPlugin'

const packagePath = process.cwd()
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(packagePath, 'package.json'))

let generateCounter = 0
const generateConfig = (type) => {
  let typescriptOptions = {
    declaration: false,
  }
  const external = []
  let babelrc = true
  const output = {
    dir: 'dist/',
    format: type,
    entryFileNames: '[name].js',
    assetFileNames: '[name].js',
    sourcemap: true,
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
    output.exports = 'named'
    babelrc = false
  }
  if (type === 'cjs') {
    output.exports = 'auto'
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
  // TODO commented because of ./vendor/fastest-levenshtein.ts
  // if (type === 'iife') {
  //   pluginsOnlyOnce.push(nodeResolve({ resolveOnly: ['fastest-levenshtein'] }))
  // } else {
  //   external.push('fastest-levenshtein')
  // }

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
    external,
    preserveModules: type !== 'iife',
  }
}

export default [
  generateConfig('esm'),
  generateConfig('cjs'),
  generateConfig('iife'),
]
