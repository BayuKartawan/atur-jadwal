<script setup>
import {
  Sparkles,
  Menu,
  X,
  Lock, 
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSistemKunci } from "../../composables/useSistemKunci";

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
    beranda: "Beranda",
    "data-master-guru": "Data Master",
    "data-master-mapel": "Data Master",
    "data-master-kelas": "Data Master",
    "data-master-jam": "Data Master",
    kurikulum: "Kurikulum",
    alokasi: "Alokasi Jam",
    jadwal: "Jadwal Pelajaran",
    "jadwal-guru": "Rekap Jadwal Guru",
    "jadwal-kelas": "Jadwal Per Kelas",
    rekap: "Rekap JTM",
    tentang: "Tentang",
  };
  return titles[route.name] || "Ikhtisar";
});

// Lock Status
const { isLocked } = useSistemKunci();
</script>

<template>
  <header
    class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-10 px-4 lg:px-6 flex justify-between items-center z-30 shrink-0 sticky top-0 relative"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-3 md:gap-4 z-10">
      <!-- Menu Toggle (Mobile Only) -->
      <button
        @click="$emit('toggleSidebar')"
        class="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <Menu v-if="!isSidebarOpen" :size="20" />
        <X v-else :size="20" />
      </button>

      <!-- AI Processing -->
      <div
        v-if="isGenerating"
        class="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800"
      >
        <Sparkles :size="14" class="text-indigo-600 dark:text-indigo-400" />
        <span
          class="text-[10px] sm:text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest"
          >AI Processing...</span
        >
      </div>
    </div>

    <!-- Center Section: Title centered absolutely -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
      <h1
        class="text-base md:text-lg font-semibold text-slate-800 dark:text-white leading-none tracking-tight"
      >
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Right Side Actions -->
    <div
      class="flex items-center gap-2 md:gap-4 z-10"
    >
      <!-- Lock Indicator -->
      <div 
        v-if="isLocked"
        class="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800/50"
        title="Aplikasi Terkunci"
      >
        <Lock :size="14" />
        <span class="text-[10px] font-semibold uppercase tracking-widest hidden md:inline">Locked</span>
      </div>
    </div>
  </header>
</template>
