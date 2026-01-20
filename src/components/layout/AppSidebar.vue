<template>
  <aside 
    :class="[
      'fixed lg:static inset-y-0 left-0 z-50 bg-indigo-950 dark:bg-slate-900 flex flex-col h-full border-r border-white/5 transition-all duration-300 transform overflow-hidden shrink-0',
      isOpen ? 'translate-x-0 w-64 opacity-100' : '-translate-x-full lg:translate-x-0 w-0 lg:w-0 opacity-0 lg:border-none'
    ]"
  >
    <!-- Sidebar Header / Logo -->
    <div class="p-8 flex items-center gap-4">
      <div class="bg-indigo-500 p-2 rounded-xl text-white">
        <School :size="24" />
      </div>
      <div class="flex flex-col">
        <span class="text-white font-black text-xs uppercase tracking-widest">Smart</span>
        <span class="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">Schedule</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
      <router-link 
        v-for="item in menuItems" 
        :key="item.id" 
        :to="item.path"
        @click="handleNavClick"
        v-slot="{ isActive }"
      >
        <button 
          :class="[
            'w-full flex items-center gap-4 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all',
            isActive 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
          ]"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </button>
      </router-link>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-white/5">
      <div class="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <UserCheck :size="20" />
        </div>
        <div class="flex flex-col">
          <span class="text-white font-bold text-xs">Admin MI</span>
          <span class="text-white/30 text-[9px] font-black uppercase tracking-widest">Operator Jadwal</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { 
  School, ClipboardList, DatabaseBackup, RefreshCw, 
  BookOpen, User, FileBarChart, UserCheck, X, Info
} from 'lucide-vue-next';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    emit('close');
  }
};

const menuItems = [
  { id: 'data_master', path: '/data-master', label: 'Data Master', icon: DatabaseBackup },
  { id: 'curriculum', path: '/curriculum', label: 'Kurikulum', icon: BookOpen },
  { id: 'walikelas', path: '/wali-kelas', label: 'Wali Kelas', icon: User },
  { id: 'allocation', path: '/allocation', label: 'Alokasi Jam', icon: RefreshCw },
  { id: 'schedule', path: '/schedule', label: 'Jadwal Pelajaran', icon: ClipboardList },
  { id: 'rekap', path: '/rekap', label: 'Rekap JTM', icon: FileBarChart },
  { id: 'about', path: '/about', label: 'Tentang', icon: Info }
];
</script>
