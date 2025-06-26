import { AutoLinkOptions } from '@vuepress/theme-default/lib/shared/nav'
import pkg from '../../package.json'

// eslint-disable-next-line import/prefer-default-export
export const navbar: AutoLinkOptions[] = [
  {
    text: 'Guide',
    link: '/guide/',
  },
  {
    text: 'Demo',
    link: '/demo/',
  },
  {
    text: 'Changelog',
    link: `${pkg.homepage}/blob/master/packages/libraries/main/CHANGELOG.md`,
  },
]
