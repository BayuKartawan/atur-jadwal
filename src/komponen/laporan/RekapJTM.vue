<script setup>
import { ref, computed } from 'vue';
import { FileBarChart, Download, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-vue-next';
import AppBadge from '../ui/BadgeAplikasi.vue';
import AppButton from '../ui/TombolAplikasi.vue';

const props = defineProps({
  teachers: Array,
  allocations: Array,
  getTeacherHomeroomClass: Function,
  getUsedJtm: Function
});

const sortBy = ref('name'); // 'name' | 'jtm'

const sortedTeachers = computed(() => {
  const result = [...props.teachers];

  if (sortBy.value === 'name') {
    return result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'jtm') {
    return result.sort((a, b) => {
      const jtmA = props.allocations.filter(x => x.teacherId === a.id).reduce((s, x) => s + x.jtm, 0);
      const jtmB = props.allocations.filter(x => x.teacherId === b.id).reduce((s, x) => s + x.jtm, 0);
      return jtmB - jtmA; // Descending
    });
  }
  return result;
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
    class="p-4 lg:p-8 pt-0 lg:pt-0 flex flex-col h-full min-h-full bg-slate-50/50 dark:bg-slate-950/50">
    <div
      class="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <!-- Header Section -->
      <div class="p-4 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div class="flex items-center gap-4 lg:gap-6">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <FileBarChart :size="20" class="lg:hidden" />
            <FileBarChart :size="32" class="hidden lg:block" />
          </div>
          <div>
            <h3 class="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Rekapitulasi JTM Guru
            </h3>
            <p
              class="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Laporan Beban Mengajar
            </p>
          </div>

          <div class="flex items-center gap-2 lg:gap-3 lg:ml-auto w-full lg:w-auto">
            <div
              class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-slate-700/50 flex-1 lg:flex-none">
              <button @click="sortBy = 'name'" :class="[
                'flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold uppercase tracking-wider',
                sortBy === 'name'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]">
                <ArrowUpNarrowWide :size="14" />
                <span>Nama</span>
              </button>
              <button @click="sortBy = 'jtm'" :class="[
                'flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold uppercase tracking-wider',
                sortBy === 'jtm'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]">
                <ArrowDownWideNarrow :size="14" />
                <span>JTM Tertinggi</span>
              </button>
            </div>

            <AppButton @click="downloadRecap" variant="primary"
              class="!rounded-xl !py-2.5 !px-0 w-10 h-10 lg:w-auto lg:h-auto !p-0 lg:!px-4 flex items-center justify-center shrink-0">
              <template #icon-left>
                <Download :size="16" />
              </template>
              <span class="hidden lg:inline text-xs font-bold uppercase tracking-wider">Download Excel</span>
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <!-- Content Section -->
      <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/50 dark:bg-slate-950/50 p-4 lg:p-8">

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          <div v-for="t in sortedTeachers" :key="t.id"
            class="bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 border border-slate-100 dark:border-slate-800 flex flex-col gap-3 lg:gap-4 hover:shadow-lg hover:-translate-y-1">

            <!-- Card Header -->
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-sm lg:text-base font-semibold text-slate-800 dark:text-slate-200">{{ t.name }}</h4>
                <div v-if="getTeacherHomeroomClass(t.id)" class="mt-1 lg:mt-2">
                  <AppBadge variant="primary" class="!px-2 !py-0.5 text-[9px] lg:text-[10px]">
                    WALI KELAS {{ getTeacherHomeroomClass(t.id) }}
                  </AppBadge>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <span class="block text-[10px] uppercase font-bold text-slate-400">Total Beban</span>
                <span class="block text-lg lg:text-2xl font-semibold text-slate-900 dark:text-white leading-none mt-0.5">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)}} JP
                </span>
              </div>
            </div>

            <!-- Progress Bar & Stats -->
            <div
              class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 lg:p-4 border border-slate-100 dark:border-slate-700/50">
              <div class="flex justify-between items-center text-xs mb-2">
                <span class="font-bold text-slate-500 dark:text-slate-400">Keterisian</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0)}}
                  <span class="text-slate-400 text-[10px] font-normal">dari {{allocations.filter(a => a.teacherId ===
                    t.id).reduce((s, a) => s + a.jtm, 0)}}</span>
                </span>
              </div>

              <div class="w-full h-2.5 lg:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                <div class="bg-emerald-500 h-full rounded-full"
                  :style="{ width: `${allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0 ? (allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) / allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100 : 0}%` }">
                </div>
              </div>

              <div class="flex justify-between items-center mt-2">
                <span class="text-[10px] font-bold text-slate-400">Persentase</span>
                <span class="text-[10px] lg:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {{allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0) > 0 ?
                    Math.round((allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + getUsedJtm(a.id), 0) /
                      allocations.filter(a => a.teacherId === t.id).reduce((s, a) => s + a.jtm, 0)) * 100) : 0}}%
                </span>
              </div>
            </div>

          </div>

          <div v-if="teachers.length === 0" class="col-span-full py-12 lg:py-24 text-center opacity-40">
            <p class="text-xs lg:text-sm font-bold text-slate-500">Belum ada data guru</p>
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
