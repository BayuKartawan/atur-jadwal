<script setup>
import { Ban, Layers, Search, RotateCcw, X } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  isDisableMode: Boolean,

  classes: Array,
  taskClassFilter: String,
  taskSearchQuery: String,
  taskSidebarClasses: Array,
  isTaskResultsEmpty: Boolean,
  allocations: Array,
  getAllocDetails: Function,
  getUsedJtm: Function,
  selectedAllocation: Object,
});

defineEmits([
  "update:taskClassFilter",
  "update:taskSearchQuery",
  "selectAlloc",
  "resetSlots",
  "closeSidebar",
]);

// Count allocations with remaining JTM per class
const allocationsWithRemainingJtm = computed(() => {
  const counts = {};
  if (!props.classes || !props.allocations) return counts;

  props.classes.forEach((cls) => {
    const classAllocations = props.allocations.filter((a) => a.classId === cls);
    const remaining = classAllocations.filter(
      (a) => props.getUsedJtm(a.id) < a.jtm,
    ).length;
    counts[cls] = remaining;
  });
  return counts;
});

// Total allocations with remaining JTM across all classes
const totalAllocationsWithRemainingJtm = computed(() => {
  if (!props.allocations) return 0;
  return props.allocations.filter((a) => props.getUsedJtm(a.id) < a.jtm).length;
});
</script>

<template>
  <div
    class="fixed inset-y-0 left-0 w-[85vw] sm:w-80 lg:relative lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full shadow-2xl lg:shadow-lg shadow-slate-900/5 dark:shadow-black/20 z-[60] lg:z-20 transition-all duration-300 transform"
    :class="
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:flex'
    "
  >
    <div
      class="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 relative lg:hidden"
    >
      <button
        @click="$emit('update:isOpen', false)"
        class="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition-colors"
      >
        <X :size="20" />
      </button>
    </div>

    <div
      v-if="isDisableMode"
      class="m-6 p-4 bg-rose-500 rounded-2xl text-[10px] text-white leading-relaxed shadow-lg shadow-rose-200"
    >
      <p
        class="font-black mb-1 uppercase tracking-widest flex items-center gap-2 italic"
      >
        <Ban :size="12" /> Mode Batasan:
      </p>
      Klik pada sel tabel untuk menonaktifkan jam tersebut agar AI tidak
      mengisinya.
    </div>

    <div
      class="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
      :class="
        isDisableMode
          ? 'opacity-20 pointer-events-none'
          : 'opacity-100 transition-opacity duration-300'
      "
    >
      <!-- Filter Section -->
      <div class="p-6 space-y-4">
        <div>
          <div
            class="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2 tracking-widest"
          >
            <Layers :size="12" class="text-indigo-500" /> Filter Kelas
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              @click="$emit('update:taskClassFilter', 'all')"
              class="px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border-2 relative"
              :class="
                taskClassFilter === 'all'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              "
            >
              SEMUA
              <!-- Badge for total remaining -->
              <span
                v-if="totalAllocationsWithRemainingJtm > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[8px] font-black shadow-md px-1"
                :class="
                  taskClassFilter === 'all'
                    ? 'bg-white text-indigo-600'
                    : 'bg-amber-500 text-white'
                "
              >
                {{ totalAllocationsWithRemainingJtm }}
              </span>
            </button>
            <button
              v-for="c in classes"
              :key="c"
              @click="$emit('update:taskClassFilter', c)"
              class="px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border-2 relative"
              :class="
                taskClassFilter === c
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              "
            >
              {{ c }}
              <!-- Badge for class remaining -->
              <span
                v-if="allocationsWithRemainingJtm[c] > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[8px] font-black shadow-md px-1"
                :class="
                  taskClassFilter === c
                    ? 'bg-white text-indigo-600'
                    : 'bg-amber-500 text-white'
                "
              >
                {{ allocationsWithRemainingJtm[c] }}
              </span>
              <!-- Completed indicator -->
              <span
                v-else
                class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-md"
              ></span>
            </button>
          </div>
        </div>

        <div class="relative group">
          <Search
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
            :size="16"
          />
          <input
            type="text"
            :value="taskSearchQuery"
            @input="$emit('update:taskSearchQuery', $event.target.value)"
            placeholder="Cari mata pelajaran..."
            class="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl border-transparent outline-none font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/20 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm text-slate-900 dark:text-slate-100"
          />
          <button
            v-if="taskSearchQuery"
            @click="$emit('update:taskSearchQuery', '')"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
          >
            <X :size="14" stroke-width="3" />
          </button>
        </div>
      </div>

      <!-- Task Lists -->
      <div class="px-6 pb-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <template v-for="cls in taskSidebarClasses" :key="cls">
          <div
            v-if="
              allocations.filter(
                (a) =>
                  a.classId === cls &&
                  (!taskSearchQuery ||
                    getAllocDetails(a.id)
                      ?.subjectName.toLowerCase()
                      .includes(taskSearchQuery.toLowerCase())),
              ).length > 0
            "
          >
            <!-- Class Section Header -->
            <div
              class="flex items-center gap-3 mb-4 bg-slate-900 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-slate-200 dark:shadow-none border border-slate-800 dark:border-slate-700"
            >
              <div
                class="w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-[10px] font-black italic shadow-sm"
              >
                {{ cls }}
              </div>
              <span
                class="text-[10px] font-black text-white dark:text-slate-100 uppercase tracking-[0.2em]"
                >KELAS {{ cls }}</span
              >
            </div>

            <div class="space-y-3">
              <div
                v-for="a in allocations.filter(
                  (a) =>
                    a.classId === cls &&
                    (!taskSearchQuery ||
                      getAllocDetails(a.id)
                        ?.subjectName.toLowerCase()
                        .includes(taskSearchQuery.toLowerCase())),
                )"
                :key="a.id"
                class="relative group"
              >
                <div
                  @click="getUsedJtm(a.id) < a.jtm && $emit('selectAlloc', a)"
                  class="p-4 rounded-[1.25rem] border-2 text-left cursor-pointer transition-all relative overflow-hidden group shadow-sm transition-colors duration-300"
                  :class="[
                    getUsedJtm(a.id) >= a.jtm
                      ? 'opacity-40 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 grayscale'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl dark:shadow-lg dark:hover:shadow-slate-900/50 hover:shadow-emerald-50',
                    selectedAllocation?.id === a.id
                      ? 'ring-2 ring-emerald-500/50 dark:ring-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400 scale-[1.02]'
                      : '',
                  ]"
                >
                  <div
                    class="text-[11px] font-extrabold uppercase text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-0.5 line-clamp-1 pr-6 tracking-tight"
                  >
                    {{ getAllocDetails(a.id)?.subjectName }}
                  </div>
                  <div
                    class="text-[9px] text-slate-500 dark:text-slate-500 font-bold mb-4 tracking-wide uppercase"
                  >
                    {{
                      getAllocDetails(a.id)?.teacherName?.split(",")[0] || "-"
                    }}
                  </div>

                  <div class="flex items-center gap-3">
                    <div
                      class="flex-1 bg-slate-100 dark:bg-slate-700/50 h-2.5 rounded-full overflow-hidden shadow-inner border border-slate-200/20 dark:border-slate-700/50"
                    >
                      <div
                        class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        :style="{
                          width: `${(getUsedJtm(a.id) / a.jtm) * 100}%`,
                        }"
                      ></div>
                    </div>
                    <span
                      class="text-[10px] font-black tabular-nums min-w-[32px] text-right"
                      :class="
                        getUsedJtm(a.id) >= a.jtm
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-600'
                      "
                    >
                      {{ getUsedJtm(a.id)
                      }}<span class="opacity-30 mx-0.5">/</span>{{ a.jtm }}
                    </span>
                  </div>

                  <!-- Selected Overlay Decor -->
                  <div
                    v-if="selectedAllocation?.id === a.id"
                    class="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-bl-[1.25rem] flex items-center justify-center"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"
                    ></div>
                  </div>
                </div>

                <button
                  v-if="getUsedJtm(a.id) > 0"
                  @click.stop="$emit('resetSlots', a)"
                  class="absolute -top-1.5 -right-1.5 p-2.5 bg-white dark:bg-slate-800 text-orange-500 hover:text-white hover:bg-orange-500 rounded-xl shadow-xl border border-orange-50 dark:border-slate-700 lg:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10 active:scale-90"
                >
                  <RotateCcw :size="12" stroke-width="3" />
                </button>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="isTaskResultsEmpty"
          class="flex flex-col items-center justify-center py-16 text-center opacity-20"
        >
          <Search :size="48" class="mb-4 text-slate-300" />
          <p class="text-[10px] font-black uppercase tracking-widest">
            Tidak ada data
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
