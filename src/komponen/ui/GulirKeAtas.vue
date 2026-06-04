<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MoveUp } from 'lucide-vue-next';

const isVisible = ref(false);
const scrollableElement = ref(null);
const route = useRoute();

// Reset when changing pages (routes)
watch(
    () => route.path,
    () => {
        isVisible.value = false;
        scrollableElement.value = null;
    }
);

const handleScroll = (e) => {
    const target = e.target;

    if (
        target instanceof HTMLElement &&
        target.isConnected &&
        target.clientHeight > 300 &&
        target.scrollHeight > target.clientHeight + 10
    ) {
        scrollableElement.value = target;
        isVisible.value = target.scrollTop > 300;
    }
};

const scrollToTop = () => {
    if (scrollableElement.value) {
        scrollableElement.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll, true);
});
</script>

<template>
    <button v-if="isVisible" @click="scrollToTop"
        class="fixed bottom-20 lg:bottom-10 right-6 lg:right-10 z-50 p-3 lg:p-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400"
        aria-label="Scroll to top">
        <MoveUp :size="20" />
    </button>
</template>
