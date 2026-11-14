import { SidebarGroupOptions } from '@vuepress/theme-default/lib/shared/sidebar'

// eslint-disable-next-line import/prefer-default-export
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
        text: 'Options',
        link: '/guide/options/',
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
        text: 'Matcher',
        link: '/guide/matcher/',
      },
      {
        text: 'Pwned matcher',
        link: '/guide/pwned-matcher/',
      },
      {
        text: 'Lazy loading',
        link: '/guide/lazy-loading/',
      },
      {
        text: 'Best Practices',
        link: '/guide/best-practices/',
      },
      {
        text: 'Examples',
        link: '/guide/examples/',
      },
      {
        text: 'Framework examples',
        link: '/guide/framework-examples/',
      },
      {
        text: 'TypeScript',
        link: '/guide/typescript/',
      },
      {
        text: 'Comparison',
        link: '/guide/comparison/',
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
