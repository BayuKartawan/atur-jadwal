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

    // Filter out:
    // 1. Non-elements
    // 2. Small containers (dropdowns, tiny boxes) - assume main scroll is at least 300px high
    // 3. Elements not actually scrollable or barely scrollable
    if (
        target instanceof HTMLElement &&
        target.isConnected &&
        target.clientHeight > 300 &&
        target.scrollHeight > target.clientHeight + 10 // buffer for rounding
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
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-8 scale-50" enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-8 scale-50">
        <button v-if="isVisible" @click="scrollToTop"
            class="fixed bottom-20 lg:bottom-10 right-6 lg:right-10 z-50 p-3 lg:p-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-90 transition-all duration-300 group"
            aria-label="Scroll to top">
            <MoveUp :size="20" class="group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
    </Transition>
</template>
