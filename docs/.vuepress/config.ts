import { resolve } from 'path'
import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { viteBundler } from '@vuepress/bundler-vite'
import { sidebar } from './sidebar'
import { navbar } from './nav'
// @ts-ignore
import pkg from '../../package.json'

export default defineUserConfig({
  title: pkg.name,
  description: pkg.description,
  base: '/zxcvbn/',
  lang: 'en-US',
  plugins: [
    registerComponentsPlugin({
      componentsDir: resolve(__dirname, './components'),
    }),
  ],
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  theme: defaultTheme({
    sidebar,
    navbar,
    repo: pkg.homepage,
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // evergreen: true,
    // displayAllHeaders: true,
    sidebarDepth: 3,
    docsBranch: 'master',
  }),
})
