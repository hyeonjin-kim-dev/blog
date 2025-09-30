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
            { text: '회고', link: '/docs/retrospective/mcp1' },
        ],

        sidebar: {
            '/docs/retrospective/': [
                {
                    text: '회고',
                    items: [
                        { text: 'MCP 서버 구현기', link: '/docs/retrospective/mcp1' },
                        { text: 'Node.js 버전 업 회고', link: '/docs/retrospective/nodejs1' },
                        { text: 'AI 를 활용한 배포 자동화 여정', link: '/docs/retrospective/deploy1' },
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
