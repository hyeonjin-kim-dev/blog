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
            { text: 'Dev Log', link: '/docs/devlog/mcp1' },
        ],

        sidebar: {
            '/docs/devlog/': [
                {
                    text: 'Dev Log',
                    items: [
                        {
                            text: 'MCP 서버 구현',
                            link: '/docs/devlog/mcp1',
                        },
                        {
                            text: 'Node.js 버전 업',
                            link: '/docs/devlog/nodejs1',
                        },
                        {
                            text: 'AI 를 활용한 배포 자동화',
                            link: '/docs/devlog/deploy1',
                        },
                        {
                            text: 'SPA 초기 렌더링 최적화',
                            link: '/docs/devlog/spa1',
                        },
                        {
                            text: 'Vue inject undefined 이슈',
                            link: '/docs/devlog/inject1',
                        },
                        {
                            text: '바이브 코딩으로 자산 관리 자동화',
                            link: '/docs/devlog/vibe1',
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
