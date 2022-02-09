import { SidebarGroupCollapsible } from '@vuepress/theme-default/lib/shared/nav'

export const sidebar: SidebarGroupCollapsible[] = [
  {
    text: 'Guide',
    collapsible: false,
    children: [
      {
        text: 'Introduction',
        link: '/guide/',
      },
      {
        text: 'Getting started',
        link: '/guide/getting-started/',
      },
      {
        text: 'Migration',
        link: '/guide/migration/',
      },
      {
        text: 'Comparison',
        link: '/guide/comparison/',
      },
      {
        text: 'Languages',
        link: '/guide/languages/',
      },
      {
        text: 'Lazy loading',
        link: '/guide/lazy-loading/',
      },
      {
        text: 'Matcher',
        link: '/guide/matcher/',
      },
      {
        text: 'Options',
        link: '/guide/options/',
      },
      {
        text: 'User input',
        link: '/guide/user-input/',
      },
    ],
  },
  {
    text: 'Demo',
    collapsible: false,
    children: [
      {
        text: 'Demo',
        link: '/demo/',
      },
    ],
  },
]
