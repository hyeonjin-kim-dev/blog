<script setup>
import DefaultTheme from 'vitepress/theme';
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import CursorTrail from './components/CursorTrail.vue';

const { Layout } = DefaultTheme;
const router = useRouter();
const route = useRoute();

// Check if current page is home
const isHome = computed(() => route.path === '/' || route.path === '/blog/');

// Setup medium zoom with the desired options
const setupMediumZoom = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent',
    });
};

// Apply medium zoom on load
onMounted(() => {
    setupMediumZoom();
});

// Subscribe to route changes to re-apply medium zoom effect
router.onAfterRouteChanged = setupMediumZoom;
</script>

<template>
    <Layout />
    <CursorTrail v-if="isHome" />
</template>

<style>
.medium-zoom-overlay {
    backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}
</style>
