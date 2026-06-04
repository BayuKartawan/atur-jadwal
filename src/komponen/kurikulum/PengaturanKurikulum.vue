<script setup>
import { Download, Upload, ClipboardList, RefreshCw } from "lucide-vue-next";
import AppButton from "../ui/TombolAplikasi.vue";

const props = defineProps({
  subjects: Array,
  classes: Array,
  curriculum: Object,
});

defineEmits([
  "downloadTemplate",
  "uploadExcel",
  "updateCurriculum",
  "syncAllocations",
]);
</script>

<template>
  <div
    class="p-2 lg:p-4 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/30"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col h-full"
    >
      <!-- Compact Header -->
      <div
        class="p-3 lg:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 gap-3 shrink-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shrink-0"
          >
            <ClipboardList :size="20" class="lg:hidden" />
            <ClipboardList :size="32" class="hidden lg:block" />
          </div>
          <div>
            <h3
              class="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight"
            >
              Pengaturan JTM Kurikulum
            </h3>
            <p
              class="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Jam Tatap Muka
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-2 w-full sm:w-auto p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
        >
          <AppButton
            @click="$emit('syncAllocations')"
            variant="primary"
            size="sm"
            class="!px-3 flex-1 sm:flex-none justify-center text-[10px]"
          >
            <template #icon-left><RefreshCw :size="12" /></template>
            Simpan & Sinkron
          </AppButton>
          <AppButton
            @click="$emit('downloadTemplate')"
            variant="secondary"
            size="sm"
            class="!px-3 flex-1 sm:flex-none justify-center text-[10px]"
          >
            <template #icon-left><Download :size="12" /></template>
            Template
          </AppButton>
          <AppButton
            @click="$emit('uploadExcel')"
            variant="primary"
            size="sm"
            class="!px-3 flex-1 sm:flex-none justify-center text-[10px]"
          >
            <template #icon-left><Upload :size="12" /></template>
            Unggah Excel
          </AppButton>
        </div>
      </div>

      <!-- Minimalist Table Area -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-semibold text-[9px] uppercase tracking-wider sticky top-0 z-20"
          >
            <tr>
              <th
                class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-slate-900 z-30 min-w-[150px] max-w-[200px]"
              >
                Mata Pelajaran
              </th>
              <th
                v-for="cls in classes"
                :key="cls"
                class="px-2 py-2 text-center border-b border-slate-100 dark:border-slate-800 min-w-[50px]"
              >
                {{ cls }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-55 dark:divide-slate-800/50">
            <tr
              v-for="s in subjects"
              :key="s.id"
              class="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5 group"
            >
              <td
                class="px-4 py-2 sticky left-0 bg-white dark:bg-slate-900 z-10 group-hover:bg-indigo-50/20 dark:group-hover:bg-indigo-900/5"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="
                      s.type === 'agama'
                        ? 'bg-purple-400'
                        : s.type === 'umum'
                          ? 'bg-emerald-400'
                          : 'bg-orange-400'
                    "
                  ></div>
                  <span
                    class="font-semibold text-xs text-slate-700 dark:text-slate-350 group-hover:text-slate-900 dark:group-hover:text-white truncate max-w-[160px]"
                    :title="s.name"
                    >{{ s.name }}</span
                  >
                </div>
              </td>
              <td
                v-for="cls in classes"
                :key="cls"
                class="px-1 py-1 border-l border-slate-100 dark:border-slate-800/50"
              >
                <div class="relative group/input flex justify-center items-center">
                  <input
                    type="number"
                    class="w-12 text-center bg-transparent border border-transparent rounded-lg py-1 text-xs font-semibold outline-none focus:bg-slate-50 dark:focus:bg-slate-850 focus:border-indigo-500/30 text-slate-700 dark:text-slate-200"
                    :class="
                      curriculum[`${cls}_${s.id}`]
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-350 dark:text-slate-650'
                    "
                    placeholder="-"
                    :value="curriculum[`${cls}_${s.id}`] || ''"
                    @input="
                      $emit('updateCurriculum', cls, s.id, $event.target.value)
                    "
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="subjects.length === 0"
          class="py-16 text-center opacity-30 flex flex-col items-center"
        >
          <div
            class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3"
          >
            <ClipboardList
              :size="24"
              class="text-slate-400 dark:text-slate-500"
            />
          </div>
          <p
            class="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Silahkan isi data master mata pelajaran
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
