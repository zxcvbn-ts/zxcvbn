import { readFileSync } from 'node:fs'
import process from 'node:process'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import json from './jsonPlugin.mjs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((id) => new RegExp(`^${id}($|/)`))
console.log(external)
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
        compilerOptions: {
          paths: {},
          rewriteRelativeImportExtensions: true,
        },
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
