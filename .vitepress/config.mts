import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/blog/',
    title: 'DevLog',
    description: "Hi, I'm Hyeonjin Kim.",
    head: [['link', { rel: 'icon', href: '/favicon.png' }]],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
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
});
