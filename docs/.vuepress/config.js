const sidebar = require('./sidebar')
const nav = require('./nav')
const pkg = require('../../package')

module.exports = {
  title: pkg.name,
  description: pkg.description,
  base: '/zxcvbn/',
  evergreen: true,
  displayAllHeaders: true,
  sidebarDepth: 3,
  themeConfig: {
    sidebar,
    nav,
    repo: pkg.homepage,
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
  },
}
