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
            { text: 'Dev Log', link: '/docs/mcp/mcp1' },
        ],

        sidebar: {
            '/docs/mcp/': [
                {
                    text: 'Dev Log',
                    items: [
                        { text: 'MCP 서버 구현기', link: '/docs/mcp/mcp1' },
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
