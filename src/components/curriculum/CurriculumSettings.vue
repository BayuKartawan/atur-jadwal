<script setup>
import { Download, Upload, ClipboardList } from "lucide-vue-next";
import AppButton from "../ui/AppButton.vue";

const props = defineProps({
  subjects: Array,
  classes: Array,
  curriculum: Object,
});

defineEmits(["downloadTemplate", "uploadExcel", "updateCurriculum"]);
</script>

<template>
  <div
    class="p-4 lg:p-8 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/30"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col h-full transition-colors duration-300"
    >
      <div
        class="p-4 lg:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-900 gap-4 lg:gap-6 shrink-0 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0"
          >
            <ClipboardList :size="20" class="lg:hidden" />
            <ClipboardList :size="24" class="hidden lg:block" />
          </div>
          <div>
            <h3
              class="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 leading-none"
            >
              Pengaturan JTM
            </h3>
            <p
              class="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Jam
              Tatap Muka Kurikulum
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-2 lg:gap-3 w-full lg:w-auto p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors"
        >
          <AppButton
            @click="$emit('downloadTemplate')"
            variant="secondary"
            size="md"
            class="!px-3 lg:!px-5 flex-1 lg:flex-none justify-center text-[10px] lg:text-xs"
          >
            <template #icon-left
              ><Download :size="14" class="lg:w-4 lg:h-4"
            /></template>
            Template
          </AppButton>
          <AppButton
            @click="$emit('uploadExcel')"
            variant="primary"
            size="md"
            class="!px-3 lg:!px-5 flex-1 lg:flex-none justify-center text-[10px] lg:text-xs"
          >
            <template #icon-left
              ><Upload :size="14" class="lg:w-4 lg:h-4"
            /></template>
            Unggah Excel
          </AppButton>
        </div>
      </div>

      <div class="flex-1 overflow-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-md"
          >
            <tr>
              <th
                class="px-4 lg:px-8 py-3 lg:py-5 border-b border-slate-100 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-slate-900 z-30 min-w-[140px] lg:min-w-[200px] shadow-[2px_0_10px_rgba(0,0,0,0.02)] transition-colors"
              >
                Mata Pelajaran
              </th>
              <th
                v-for="cls in classes"
                :key="cls"
                class="px-2 lg:px-4 py-3 lg:py-5 text-center border-b border-slate-100 dark:border-slate-800 min-w-[60px] lg:min-w-[80px]"
              >
                KLS {{ cls }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="s in subjects"
              :key="s.id"
              class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group"
            >
              <td
                class="px-4 lg:px-8 py-3 lg:py-4 sticky left-0 bg-white dark:bg-slate-900 z-10 group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-900/10 transition-colors shadow-[2px_0_10px_rgba(0,0,0,0.02)]"
              >
                <div class="flex items-center gap-2 lg:gap-3">
                  <div
                    class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full shadow-sm shrink-0"
                    :class="
                      s.type === 'agama'
                        ? 'bg-purple-400'
                        : s.type === 'umum'
                          ? 'bg-emerald-400'
                          : 'bg-orange-400'
                    "
                  ></div>
                  <span
                    class="font-bold text-xs lg:text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate max-w-[120px] lg:max-w-none"
                    >{{ s.name }}</span
                  >
                </div>
              </td>
              <td
                v-for="cls in classes"
                :key="cls"
                class="px-2 lg:px-3 py-2 lg:py-3 border-l border-slate-50/50 dark:border-slate-800/50"
              >
                <div class="relative group/input">
                  <input
                    type="number"
                    class="w-full text-center bg-transparent border-2 border-transparent rounded-xl py-2 text-xs font-black outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 dark:text-slate-200"
                    :class="
                      curriculum[`${cls}_${s.id}`]
                        ? 'text-indigo-600 dark:text-indigo-400 font-black'
                        : 'text-slate-300 dark:text-slate-700'
                    "
                    :value="curriculum[`${cls}_${s.id}`] || ''"
                    @input="
                      $emit('updateCurriculum', cls, s.id, $event.target.value)
                    "
                  />
                  <div
                    class="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500/0 group-focus-within/input:bg-indigo-500 transition-colors rounded-full"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="subjects.length === 0"
          class="py-24 text-center opacity-30 flex flex-col items-center"
        >
          <div
            class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors"
          >
            <ClipboardList
              :size="32"
              class="text-slate-400 dark:text-slate-500"
            />
          </div>
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
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
  width: 6px;
  height: 6px;
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
