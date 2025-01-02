import { SidebarGroupOptions } from '@vuepress/theme-default/lib/shared/sidebar'

export const sidebar: SidebarGroupOptions[] = [
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
        text: 'Examples',
        link: '/guide/examples/',
      },
      {
        text: 'Best Practices',
        link: '/guide/best-practices/',
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
        text: 'Filtering custom words',
        link: '/guide/filtering-custom-words/',
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
        text: 'Framework examples',
        link: '/guide/framework-examples/',
      },
      {
        text: 'Migration',
        link: '/guide/migration/',
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
