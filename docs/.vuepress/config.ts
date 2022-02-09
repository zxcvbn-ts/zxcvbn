import { resolve } from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

// @ts-ignore
import { sidebar } from './sidebar'
// @ts-ignore
import { navbar } from './nav'
// @ts-ignore
import pkg from '../../package.json'

export default defineUserConfig<DefaultThemeOptions>({
  title: pkg.name,
  description: pkg.description,
  base: '/zxcvbn/',
  lang: 'en-US',
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: resolve(__dirname, './components'),
      },
    ],
  ],
  theme: '@vuepress/theme-default',
  themeConfig: {
    sidebar,
    navbar,
    repo: pkg.homepage,
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    evergreen: true,
    displayAllHeaders: true,
    sidebarDepth: 3,
    docsBranch: 'master',
  },
})
