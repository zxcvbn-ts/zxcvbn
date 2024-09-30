import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import json from './jsonPlugin.mjs'

let generateCounter = 0
const generateConfig = async (type, minify = false) => {
  let typescriptOptions = {
    declaration: false,
  }
  const external = []
  let babelrc = true
  const output = {
    dir: 'dist/',
    format: type,
    entryFileNames: '[name].cjs',
    assetFileNames: '[name].cjs',
    sourcemap: true,
    preserveModules: true,
  }
  if (type === 'esm') {
    typescriptOptions = {
      declarationDir: `dist/`,
      declaration: true,
      rootDir: 'src/',
      exclude: ['test/**/*', 'dist/**/*'],
    }
    output.entryFileNames = '[name].mjs'
    output.assetFileNames = '[name].mjs'
    output.exports = 'named'
    babelrc = false
  }
  if (type === 'cjs') {
    output.exports = 'auto'
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

  external.push('fastest-levenshtein', '@alttiri/base85', 'fflate')

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

export default Promise.all([generateConfig('esm'), generateConfig('cjs')])
