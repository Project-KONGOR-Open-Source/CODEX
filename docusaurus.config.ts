import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CODEX',
  tagline: 'Project KONGOR Knowledge Base',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://codex.kongor.net',
  baseUrl: '/',

  organizationName: 'Project-KONGOR-Open-Source',
  projectName: 'CODEX',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/caldavar.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CODEX',
      logo: {
        alt: 'CODEX Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'infrastructureSidebar',
          position: 'left',
          label: 'Infrastructure',
        },
        {
          type: 'docSidebar',
          sidebarId: 'hostServicesSidebar',
          position: 'left',
          label: 'Host Services',
        },
        {
          type: 'docSidebar',
          sidebarId: 'hostMatchServersSidebar',
          position: 'left',
          label: 'Host Match Servers',
        },
        {
          href: 'https://github.com/Project-KONGOR-Open-Source/CODEX',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Project KONGOR`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
