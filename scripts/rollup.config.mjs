import path from 'path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import fs from 'fs'
import json from './jsonPlugin.mjs'

const packagePath = process.cwd()

let generateCounter = 0
const generateConfig = async (type, minify = false) => {
  const pkgString = fs.readFileSync(
    path.join(packagePath, 'package.json'),
    'utf-8',
  )
  const pkg = JSON.parse(pkgString)
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
    preserveModules: type !== 'iife',
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

    if (minify) {
      output.entryFileNames = 'zxcvbn-ts.min.js'
      output.assetFileNames = 'zxcvbn-ts.min.js'
    } else {
      output.entryFileNames = 'zxcvbn-ts.js'
      output.assetFileNames = 'zxcvbn-ts.js'
    }
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

  if (type === 'iife') {
    pluginsOnlyOnce.push(nodeResolve({ resolveOnly: ['fastest-levenshtein'] }))
  } else {
    external.push('fastest-levenshtein')
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
      minify ? terser() : null,
    ],
    external,
  }
}

export default Promise.all([
  generateConfig('esm'),
  generateConfig('cjs'),
  generateConfig('iife'),
  generateConfig('iife', true), // cdn build
])
