<template>
  <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
    <button
      v-for="mode in modes"
      :key="mode.value"
      @click="setTheme(mode.value)"
      :class="[
        'relative p-1.5 rounded-full transition-all duration-300 ease-out flex items-center justify-center',
        currentTheme === mode.value
          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
      ]"
      :title="mode.label"
    >
      <component :is="mode.icon" :size="16" stroke-width="2.5" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Sun, Moon, Monitor } from 'lucide-vue-next';

const modes = [
  { value: 'light', label: 'Terang', icon: Sun },
  { value: 'dark', label: 'Gelap', icon: Moon },
  { value: 'system', label: 'Sistem', icon: Monitor },
];

const currentTheme = ref('system');

const applyTheme = (theme) => {
  const root = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

onMounted(() => {
  // Check local storage or default to system
  const savedTheme = localStorage.getItem('theme') || 'system';
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  // Listen for system changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    if (currentTheme.value === 'system') {
      applyTheme('system');
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Deprecated but safe fallback
    mediaQuery.addListener(handleChange);
  }
});
</script>
