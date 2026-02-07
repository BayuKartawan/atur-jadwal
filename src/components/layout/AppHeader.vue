<script setup>
import {
  Sparkles,
  Menu,
  X,
  Lock, 
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";
import ThemeSwitcher from "../ui/ThemeSwitcher.vue";
import { useLockSystem } from "../../composables/useLockSystem";

defineProps({
  isGenerating: Boolean,
  isSidebarOpen: Boolean,
});

defineEmits([
  "toggleSidebar",
]);

const route = useRoute();

const pageTitle = computed(() => {
  const titles = {
    dashboard: "Dashboard",
    "data-master": "Data Master",
    curriculum: "Kurikulum",
    "wali-kelas": "Wali Kelas",
    allocation: "Alokasi Jam",
    schedule: "Jadwal Pelajaran",
    rekap: "Rekap JTM",
    about: "Tentang",
  };
  return titles[route.name] || "Ikhtisar";
});

// Lock Status
const { isLocked } = useLockSystem();
</script>

<template>
  <header
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 flex justify-between items-center z-30 shrink-0 sticky top-0 transition-all duration-300"
  >
    <div class="flex items-center gap-3 md:gap-4 shrink-0">
      <!-- Menu Toggle -->
      <button
        @click="$emit('toggleSidebar')"
        class="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <Menu v-if="!isSidebarOpen" :size="20" stroke-width="2.5" />
        <X v-else :size="20" stroke-width="2.5" />
      </button>

      <div
        v-if="isGenerating"
        class="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 animate-pulse"
      >
        <Sparkles :size="14" class="text-indigo-600 dark:text-indigo-400" />
        <span
          class="text-[10px] sm:text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest"
          >AI Processing...</span
        >
      </div>
      <div v-else class="flex flex-col min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h1
              class="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight tracking-tight truncate"
            >
              {{ pageTitle }}
            </h1>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block shrink-0">Pro</span>
          </div>
      </div>
    </div>

    <!-- Right Side Actions -->
    <div
      class="flex items-center gap-2 md:gap-4"
    >
      <!-- Lock Indicator -->
      <div 
        v-if="isLocked"
        class="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800/50"
        title="Aplikasi Terkunci"
      >
        <Lock :size="14" stroke-width="2.5" />
        <span class="text-[10px] font-black uppercase tracking-widest hidden md:inline">Locked</span>
      </div>

      <!-- Theme Switcher -->
      <div>
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* No additional styles needed with Tailwind */
</style>
