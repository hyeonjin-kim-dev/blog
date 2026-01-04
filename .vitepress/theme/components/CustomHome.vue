<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const titleRef = ref(null);
const letters = ref([]);

// Split "DevLog" into individual letters
const titleText = "DevLog";
letters.value = titleText.split('').map((char, index) => ({
    char,
    index,
    color: '',
    transform: ''
}));

const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Update letter colors and positions based on mouse
    if (titleRef.value) {
        letters.value.forEach((letter, index) => {
            const letterElement = titleRef.value.children[index];
            if (!letterElement) return;

            const rect = letterElement.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            const deltaX = x - letterCenterX;
            const deltaY = y - letterCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Effect within 150px
            if (distance < 150) {
                const intensity = 1 - (distance / 150);

                // Magnetic pull effect
                const pullX = (deltaX / distance) * intensity * 10;
                const pullY = (deltaY / distance) * intensity * 10;

                letter.transform = `translate(${pullX}px, ${pullY}px)`;
                letter.color = `rgba(0, 0, 0, ${0.3 + intensity * 0.7})`;
            } else {
                letter.transform = '';
                letter.color = '';
            }
        });
    }
};

onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
    <div class="custom-home">
        <!-- Background Grid -->
        <div class="grid-background"></div>

        <!-- Content -->
        <div class="content">
            <div class="title-section">
                <h1 ref="titleRef" class="main-title">
                    <span
                        v-for="letter in letters"
                        :key="letter.index"
                        class="letter"
                        :style="{
                            transform: letter.transform,
                            color: letter.color
                        }"
                    >
                        {{ letter.char }}
                    </span>
                </h1>
                <p class="subtitle">일상과 공부한 것을 기록하는 공간입니다</p>
            </div>

            <div class="actions">
                <a href="/blog/docs/devlog/nodejs1" class="btn btn-primary">
                    <span>글 읽기</span>
                    <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
                <a href="https://github.com/hyeonjin-kim-dev" target="_blank" class="btn btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-home {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.dark .custom-home {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

/* Grid Background */
.grid-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 0;
}

.dark .grid-background {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

/* Content */
.content {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 0 32px;
    width: 100%;
    max-width: 1200px;
}

.title-section {
    margin-bottom: 40px;
    padding: 20px 0;
}

/* Clean Title - Text Only */
.main-title {
    font-size: clamp(60px, 10vw, 100px);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.4;
    margin: 0;
    padding: 20px 24px;
    display: inline-flex;
}

.letter {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, color;
}

.dark .letter {
    color: rgba(255, 255, 255, 0.85);
}

.subtitle {
    font-size: clamp(16px, 2vw, 20px);
    font-weight: 400;
    color: #7a7a7a;
    margin: 16px 0 0 0;
    opacity: 0.7;
}

.dark .subtitle {
    color: #909090;
    opacity: 0.6;
}

.description {
    font-size: clamp(16px, 2vw, 20px);
    color: #6a6a6a;
    margin: 0;
}

.dark .description {
    color: #808080;
}

/* Actions */
.actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
}

.btn:hover::before {
    opacity: 1;
}

.btn-primary {
    background: #394dfe;
    color: white;
    box-shadow: 0 4px 20px rgba(57, 77, 254, 0.2);
}

.btn-primary:hover {
    background: #22da6e;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(34, 218, 110, 0.3);
}

.btn-primary .arrow {
    transition: transform 0.3s;
}

.btn-primary:hover .arrow {
    transform: translateX(4px);
}

.btn-secondary {
    background: transparent;
    color: #000;
    border: 2px solid #e0e0e0;
}

.dark .btn-secondary {
    color: #fff;
    border-color: #404040;
}

.btn-secondary:hover {
    background: rgba(57, 77, 254, 0.05);
    border-color: #394dfe;
    transform: translateY(-2px);
}

.dark .btn-secondary:hover {
    background: rgba(101, 74, 255, 0.1);
    border-color: #654aff;
}

/* Responsive */
@media (max-width: 640px) {
    .content {
        padding: 0 16px;
    }

    .title-section {
        margin-bottom: 32px;
    }

    .actions {
        gap: 12px;
        flex-direction: column;
        width: 100%;
    }

    .btn {
        padding: 14px 24px;
        font-size: 15px;
        width: 100%;
        max-width: 300px;
    }
}
</style>
