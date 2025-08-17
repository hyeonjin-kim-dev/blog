import { defineConfig } from 'vitepress';

// Import lightbox plugin
import lightbox from 'vitepress-plugin-lightbox';

import {
    groupIconMdPlugin,
    groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/blog/',
    title: 'DevLog',
    description: "Hi, I'm Hyeonjin Kim.",
    head: [['link', { rel: 'icon', href: '/blog/favicon.png' }]],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: 'local',
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'MCP', link: '/docs/mcp/mcp1' },
            { text: 'Playwright', link: '/docs/playwright/playwright1' },
            { text: 'Node.js', link: '/docs/nodejs/nodejs1' },
        ],

        sidebar: {
            '/docs/mcp/': [
                {
                    text: 'Model Context Protocol',
                    items: [
                        { text: 'MCP 서버 구현기 (1)', link: '/docs/mcp/mcp1' },
                        { text: 'MCP 서버 구현기 (2)', link: '/docs/mcp/mcp2' },
                        { text: 'MCP 서버 구현기 (3)', link: '/docs/mcp/mcp3' },
                    ],
                },
            ],
            '/docs/playwight/': [
                {
                    text: 'Playwright',
                    items: [
                        {
                            text: 'Playwright 도입기 (1)',
                            link: '/docs/playwright/playwright1',
                        },
                    ],
                },
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/hyeonjin-kim-dev' },
        ],
    },
    markdown: {
        config: (md) => {
            // Use lightbox plugin
            md.use(lightbox, {});
            md.use(groupIconMdPlugin);
        },
    },
    vite: {
        plugins: [groupIconVitePlugin()],
    },
});
