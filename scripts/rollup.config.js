import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import pkg from '../package.json'

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
    exports: 'auto',
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
    output.name = pkg.name.replace('-', '')
    output.entryFileNames = '[name].browser.js'
    output.assetFileNames = '[name].browser.js'
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
      alias({
        entries: [
          {
            find: '~',
            replacement: path.join(__dirname, '..', '/src'),
          },
        ],
      }),
      json({
        compact: true,
      }),
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
