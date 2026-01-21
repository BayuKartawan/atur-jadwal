<script setup>
import { FileBarChart, Download } from 'lucide-vue-next';
import AppBadge from '../ui/AppBadge.vue';
import AppButton from '../ui/AppButton.vue';

const props = defineProps({
  teachers: Array,
  allocations: Array,
  getTeacherHomeroomClass: Function,
  getUsedJtm: Function
});

const downloadRecap = () => {
  if (!window.XLSX) {
    alert("Excel library not loaded.");
    return;
  }

  const headers = ['Nama Guru', 'Wali Kelas', 'Total JTM', 'Terisi', 'Persentase'];
  const data = props.teachers.map(t => {
    const homeroom = props.getTeacherHomeroomClass(t.id) ? `Kelas ${props.getTeacherHomeroomClass(t.id)}` : '-';

    const teacherAllocations = props.allocations.filter(a => a.teacherId === t.id);
    const totalJtm = teacherAllocations.reduce((s, a) => s + a.jtm, 0);
    const filledJtm = teacherAllocations.reduce((s, a) => s + props.getUsedJtm(a.id), 0);
    const percentage = totalJtm > 0 ? Math.round((filledJtm / totalJtm) * 100) : 0;

    return [
      t.name,
      homeroom,
      totalJtm,
      filledJtm,
      `${percentage}%`
    ];
  });

  const wsData = [headers, ...data];
  const wb = window.XLSX.utils.book_new();
  const ws = window.XLSX.utils.aoa_to_sheet(wsData);

  // Auto-width columns
  const colWidths = headers.map(h => ({ wch: h.length + 5 }));
  colWidths[0] = { wch: 40 }; // Name column
  ws['!cols'] = colWidths;

  window.XLSX.utils.book_append_sheet(wb, ws, "Rekap JTM");

  const now = new Date();
  const date = now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const time = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '.');
  window.XLSX.writeFile(wb, `Rekap_JTM_Guru_${date}_${time}.xlsx`);
};
</script>

<template>
  <div
    class="p-4 lg:p-8 pt-0 lg:pt-0 flex flex-col h-full min-h-full bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
    <div
      class="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300">
      <!-- Header Section -->
      <div class="p-4 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div class="flex items-center gap-4 lg:gap-6">
          <div
            class="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm shrink-0">
            <FileBarChart :size="24" class="lg:hidden" />
            <FileBarChart :size="32" class="hidden lg:block" />
          </div>
          <div>
            <h3 class="text-lg lg:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
              Rekapitulasi JTM</h3>
            <p
              class="text-[9px] lg:text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1.5 lg:mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 animate-pulse"></span> Laporan Beban
              Mengajar
            </p>
          </div>
          <div class="ml-auto">
            <AppButton @click="downloadRecap" variant="primary"
              class="!rounded-xl !py-2.5 !px-4 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              <template #icon-left>
                <Download :size="16" />
              </template>
              <span class="hidden lg:inline text-xs font-bold uppercase tracking-wider">Download Excel</span>
              <span class="lg:hidden text-xs font-bold uppercase tracking-wider">Excel</span>
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-1 overflow-hidden lg:overflow-auto relative bg-slate-50/50 dark:bg-slate-950/50">

        <!-- Mobile Card View (< lg) -->
        <div class="lg:hidden h-full overflow-y-auto custom-scrollbar p-4 space-y-4 pb-20">
          <div v-for="t in teachers" :key="t.id"
            class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">

            <!-- Card Header -->
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-sm font-black text-slate-800 dark:text-slate-200">{{ t.name }}</h4>
                <div v-if="getTeacherHomeroomClass(t.id)" class="mt-1">
                  <AppBadge variant="primary" class="!px-2 !py-0.5 text-[9px]">
                    WALI KELAS {{ getTeacherHomeroomClass(t.id) }}
                  </AppBadge>
                </div>
              </div>
              <div class="text-right">
                <span class="block text-[10px] uppercase font-bold text-slate-400">Total Beban</span>
                <span class="block text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)}} JP
                </span>
              </div>
            </div>

            <!-- Progress Bar & Stats -->
            <div
              class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
              <div class="flex justify-between items-center text-xs mb-2">
                <span class="font-bold text-slate-500 dark:text-slate-400">Keterisian</span>
                <span class="font-black text-slate-800 dark:text-slate-200">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0)}}
                  <span class="text-slate-400 text-[10px] font-normal">dari {{allocations.filter(a => a.teacherId ===
                    t.id).reduce((s, a) => s + a.jtm, 0)}}</span>
                </span>
              </div>

              <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  :style="{ width: `${allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0 ? (allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100 : 0}%` }">
                </div>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400">Persentase</span>
                <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0 ?
                    Math.round((allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) /
                      allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100) : 0}}%
                </span>
              </div>
            </div>

          </div>

          <div v-if="teachers.length === 0" class="py-12 text-center opacity-40">
            <p class="text-xs font-bold text-slate-500">Belum ada data guru</p>
          </div>
        </div>

        <!-- Desktop Table View (>= lg) -->
        <div class="hidden lg:block h-full overflow-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead
              class="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="px-8 py-6 sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 lg:bg-transparent lg:shadow-none">
                  Nama
                  Guru</th>
                <th class="px-8 py-6 whitespace-nowrap">Wali Kelas</th>
                <th class="px-8 py-6 text-center whitespace-nowrap">Total JTM</th>
                <th class="px-8 py-6 text-center whitespace-nowrap">Terisi</th>
                <th class="px-8 py-6 min-w-[200px]">Persentase Progress</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr v-for="t in teachers" :key="t.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="px-8 py-5 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/30 transition-colors">
                  <div
                    class="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                    {{ t.name }}
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <AppBadge v-if="getTeacherHomeroomClass(t.id)" variant="primary" class="!px-3 !py-1 text-[10px]">
                    KELAS {{ getTeacherHomeroomClass(t.id) }}
                  </AppBadge>
                  <span v-else
                    class="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">-</span>
                </td>
                <td class="px-8 py-5 text-center font-black text-slate-500 dark:text-slate-500 text-xs tabular-nums">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)}}
                </td>
                <td
                  class="px-8 py-5 text-center font-black text-emerald-600 dark:text-emerald-400 text-base tabular-nums">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0)}}
                </td>
                <td class="px-8 py-5">
                  <div v-if="allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0"
                    class="flex flex-col gap-2.5">
                    <div
                      class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200/20 dark:border-slate-700/50">
                      <div
                        class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        :style="{ width: `${(allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100}%` }">
                      </div>
                    </div>
                    <div class="flex justify-between items-center px-0.5">
                      <span
                        class="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Status
                        Beban</span>
                      <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {{Math.round((allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s +
                          getUsedJtm(a.id), 0)
                          / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100)}}%
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

          <!-- Desktop Empty State -->
          <div v-if="teachers.length === 0" class="py-32 text-center opacity-30 flex flex-col items-center">
            <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <FileBarChart :size="40" class="text-slate-300 dark:text-slate-600" />
            </div>
            <p class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Data guru
              belum
              tersedia</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
