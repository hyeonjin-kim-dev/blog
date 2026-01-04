// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import DefaultTheme from 'vitepress/theme-without-fonts';
import CustomHome from './components/CustomHome.vue';
import './my-fonts.css';
import './style.css';
import 'virtual:group-icons.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app, router, siteData }) {
        app.component('CustomHome', CustomHome);
    },
} satisfies Theme;
