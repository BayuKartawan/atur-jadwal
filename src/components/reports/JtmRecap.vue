<script setup>
import { FileBarChart } from 'lucide-vue-next';
import AppBadge from '../ui/AppBadge.vue';

const props = defineProps({
  teachers: Array,
  allocations: Array,
  getTeacherHomeroomClass: Function,
  getUsedJtm: Function
});
</script>

<template>
  <div class="p-8 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300">
      <!-- Header Section -->
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm">
            <FileBarChart :size="32" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Rekapitulasi JTM</h3>
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Laporan Beban Mengajar Guru
            </p>
          </div>
        </div>
      </div>
      
      <!-- Table Section -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th class="px-8 py-6">Nama Guru</th>
              <th class="px-8 py-6">Wali Kelas</th>
              <th class="px-8 py-6 text-center">Total JTM</th>
              <th class="px-8 py-6 text-center">Terisi</th>
              <th class="px-8 py-6 min-w-[200px]">Persentase Progress</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="t in teachers" :key="t.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                  {{ t.name }}
                </div>
              </td>
              <td class="px-8 py-5">
                <AppBadge v-if="getTeacherHomeroomClass(t.id)" variant="primary" class="!px-3 !py-1">
                  KELAS {{ getTeacherHomeroomClass(t.id) }}
                </AppBadge>
                <span v-else class="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">-</span>
              </td>
              <td class="px-8 py-5 text-center font-black text-slate-500 dark:text-slate-500 text-xs tabular-nums">
                {{ allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) }}
              </td>
              <td class="px-8 py-5 text-center font-black text-emerald-600 dark:text-emerald-400 text-base tabular-nums">
                {{ allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) }}
              </td>
              <td class="px-8 py-5">
                <div v-if="allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0" class="flex flex-col gap-2.5">
                  <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200/20 dark:border-slate-700/50">
                    <div class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                      :style="{ width: `${(allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100}%` }">
                    </div>
                  </div>
                  <div class="flex justify-between items-center px-0.5">
                    <span class="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Status Beban</span>
                    <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {{ Math.round((allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100) }}%
                    </span>
                  </div>
                </div>
                <div v-else class="flex items-center gap-2 opacity-10">
                  <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="teachers.length === 0" class="py-32 text-center opacity-30 flex flex-col items-center">
           <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
             <FileBarChart :size="40" class="text-slate-300 dark:text-slate-600" />
           </div>
           <p class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Data guru belum tersedia</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
