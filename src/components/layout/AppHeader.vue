<script setup>
import { DatabaseBackup, RefreshCw, Download, Sun, Moon, Sparkles, Menu, X, Trash2 } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppButton from '../ui/AppButton.vue';
import AppModal from '../common/AppModal.vue';

defineProps({
  isGenerating: Boolean,
  isSidebarOpen: Boolean
});

defineEmits(['backup', 'restore', 'export', 'toggleSidebar']);

const route = useRoute();
const isDark = ref(false);
const showClearConfirm = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

const handleClearData = () => {
  showClearConfirm.value = true;
};

const confirmClearData = () => {
  const currentTheme = localStorage.getItem('theme');
  localStorage.clear();
  if (currentTheme) {
    localStorage.setItem('theme', currentTheme);
  }
  showClearConfirm.value = false;
  window.location.reload();
};

const pageTitle = computed(() => {
  const titles = {
    'data-master': 'Data Master',
    'curriculum': 'Kurikulum',
    'wali-kelas': 'Wali Kelas',
    'allocation': 'Alokasi Jam',
    'schedule': 'Jadwal Pelajaran',
    'rekap': 'Rekap JTM',
    'about': 'Tentang'
  };
  return titles[route.name] || 'Ikhtisar';
});
</script>

<template>
  <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 lg:px-8 py-4 flex justify-between items-center z-30 shrink-0 transition-all duration-300">
    <div class="flex items-center gap-4 shrink-0">
      <!-- Menu Toggle -->
      <button 
        @click="$emit('toggleSidebar')"
        class="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
      >
        <Menu v-if="!isSidebarOpen" :size="20" />
        <X v-else :size="20" />
      </button>

      <div v-if="isGenerating" class="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800 animate-pulse">
        <Sparkles :size="16" class="text-indigo-600 dark:text-indigo-400" />
        <span class="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Mesin AI Sedang Memproses...</span>
      </div>
      <div v-else class="flex flex-col">
        <h2 class="text-[8px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Dashboard</h2>
        <h1 class="text-xs md:text-base font-semibold text-slate-900 dark:text-white leading-tight">{{ pageTitle }}</h1>
      </div>
    </div>
    
    <div class="flex items-center gap-1.5 md:gap-3 p-0.5 md:p-1 overflow-x-auto no-scrollbar">
      <AppButton @click="toggleDark" variant="secondary" size="icon" class="!rounded-xl border-none bg-slate-50 dark:bg-slate-800 !p-2 md:!p-2.5">
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
      </AppButton>
      
      <div class="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

      <AppButton @click="$emit('backup')" variant="secondary" size="md" class="border-none bg-slate-50 dark:bg-slate-800 !p-2 md:!p-2.5 md:!px-4 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/40">
        <template #icon-left><DatabaseBackup :size="14" /></template>
        <span class="hidden md:inline">Backup</span>
      </AppButton>
      
      <AppButton @click="$emit('restore')" variant="secondary" size="md" class="border-none bg-slate-50 dark:bg-slate-800 !p-2 md:!p-2.5 md:!px-4 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/40">
        <template #icon-left><RefreshCw :size="14" /></template>
        <span class="hidden md:inline">Restore</span>
      </AppButton>
      
      <AppButton @click="handleClearData" variant="danger" size="md" class="border-none !p-2 md:!p-2.5 md:!px-4">
        <template #icon-left><Trash2 :size="14" /></template>
        <span class="hidden md:inline">Hapus Data</span>
      </AppButton>
      
      <div class="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
      
      <AppButton @click="$emit('export')" variant="primary" size="md" class="!p-2 md:!p-2.5 md:!px-6 shadow-md shadow-indigo-100 dark:shadow-none">
        <template #icon-left><Download :size="16" /></template>
        <span class="hidden md:inline">Ekspor Excel</span>
      </AppButton>
    </div>
  </header>

  <AppModal
    :show="showClearConfirm"
    title="Hapus Semua Data"
    message="Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan dan semua jadwal Anda akan hilang."
    confirm-text="Ya, Hapus Semua"
    cancel-text="Batal"
    variant="danger"
    @confirm="confirmClearData"
    @cancel="showClearConfirm = false"
  />
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
