// @ts-ignore
import pkg from '../../package.json'
import { NavbarItem } from '@vuepress/theme-default/lib/shared/nav'

export const navbar: NavbarItem[] = [
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
