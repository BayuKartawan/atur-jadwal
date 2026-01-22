<script setup>
import { Coffee, Ban, AlertCircle, Eye, EyeOff, Sparkles, Trash2, ChevronsUp, ChevronsDown } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  DAYS: Array,
  PERIOD_TIMES: Array,
  classes: Array,
  isSlotDisabled: Function,
  getSlot: Function,
  getAllocDetails: Function,
  isDisableMode: Boolean,
  isGenerating: Boolean,
  isAppHeaderVisible: Boolean,
  selectedAllocation: Object,
});

defineEmits(["cellClick", "toggleDisableMode", "autoSchedule", "resetSchedule", "toggleAppHeader"]);

const windowWidth = ref(window.innerWidth);
onMounted(() => {
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

const isMobile = computed(() => windowWidth.value < 1024);

// State for highlighting empty cells
const showEmptyCells = ref(false);
const toggleShowEmptyCells = () =>
  (showEmptyCells.value = !showEmptyCells.value);

// Compute empty cells count per class
const emptyCellsPerClass = computed(() => {
  const counts = {};
  if (!props.classes || !props.DAYS || !props.PERIOD_TIMES) return counts;

  props.classes.forEach((cls) => {
    let emptyCount = 0;
    props.DAYS.forEach((_, dIdx) => {
      props.PERIOD_TIMES.forEach((_, pIdx) => {
        // Count as empty if not disabled and has no slot
        if (
          !props.isSlotDisabled(dIdx, pIdx, cls) &&
          !props.getSlot(dIdx, pIdx, cls)
        ) {
          emptyCount++;
        }
      });
    });
    counts[cls] = emptyCount;
  });
  return counts;
});

// Total empty cells
const totalEmptyCells = computed(() => {
  return Object.values(emptyCellsPerClass.value).reduce(
    (sum, count) => sum + count,
    0,
  );
});

const timeColWidth = computed(() => (isMobile.value ? "70px" : "100px"));
const classColWidth = computed(() => (isMobile.value ? "110px" : "140px"));
const gridTemplate = computed(
  () =>
    `${timeColWidth.value} repeat(${props.classes.length}, ${classColWidth.value})`,
);
</script>

<template>
  <div class="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar transition-colors duration-300">
    <div
      class="bg-white dark:bg-slate-900 lg:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border-b lg:border border-slate-100 dark:border-slate-800 min-w-fit">
      <!-- Action Toolbar -->
      <div class="sticky top-0 z-40 bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div class="flex items-center justify-between px-4 py-2.5 gap-3 flex-wrap">
          <!-- Left side: Empty cells info -->
          <div class="flex items-center gap-2">
            <AlertCircle v-if="totalEmptyCells > 0" :size="16" class="text-amber-400" />
            <span class="text-[10px] lg:text-xs font-medium text-slate-300">
              <span v-if="totalEmptyCells > 0" class="text-amber-400 font-bold">{{ totalEmptyCells }}</span>
              <span v-else class="text-emerald-400 font-bold">0</span>
              <span class="ml-1 text-slate-400">sel kosong</span>
            </span>
          </div>

          <!-- Right side: Action buttons -->
          <div class="flex items-center gap-2 flex-wrap">

            <!-- Auto Schedule -->
            <button @click="$emit('autoSchedule')" :disabled="isGenerating || classes.length === 0 || isDisableMode"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <div v-if="isGenerating"
                class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <Sparkles v-else :size="14" />
              <span class="hidden sm:inline">Auto-Isi</span>
            </button>

            <!-- Toggle Disable Mode -->
            <button @click="$emit('toggleDisableMode')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all duration-200"
              :class="isDisableMode
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
              <Ban :size="14" />
              <span class="hidden sm:inline">{{ isDisableMode ? 'Simpan Batasan' : 'Batas Jam' }}</span>
            </button>

            <!-- Reset Schedule -->
            <button v-if="!isDisableMode" @click="$emit('resetSchedule')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all duration-200 bg-slate-700 text-slate-300 hover:bg-rose-600 hover:text-white">
              <Trash2 :size="14" />
              <span class="hidden sm:inline">Reset</span>
            </button>

            <!-- View Empty Cells -->
            <button @click="toggleShowEmptyCells"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all duration-200"
              :class="showEmptyCells
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
              <Eye v-if="showEmptyCells" :size="14" />
              <EyeOff v-else :size="14" />
              <span class="hidden sm:inline">{{ showEmptyCells ? 'Sembunyikan' : 'Lihat Kosong' }}</span>
            </button>

            <!-- Toggle Header -->
            <button @click="$emit('toggleAppHeader')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all duration-200 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
              title="Toggle App Header">
              <ChevronsUp v-if="isAppHeaderVisible" :size="14" />
              <ChevronsDown v-else :size="14" />
            </button>
          </div>
        </div>
      </div>


      <!-- Grid Header (Classes) -->
      <div
        class="grid sticky top-[41px] lg:top-[41px] bg-slate-900 dark:bg-slate-950 text-white font-bold text-[9px] lg:text-[10px] text-center z-30 shadow-md"
        :style="{ gridTemplateColumns: gridTemplate }">
        <div
          class="p-3 lg:p-4 border-r border-slate-800 dark:border-slate-800 sticky left-0 bg-slate-900 dark:bg-slate-950 z-40 flex items-center justify-center uppercase tracking-widest text-slate-400 dark:text-slate-500">
          JAM
        </div>
        <div v-for="c in classes" :key="c"
          class="p-3 lg:p-4 border-r border-slate-800 uppercase truncate tracking-wider lg:tracking-[0.2em] font-black transition-colors duration-300 relative"
          :class="selectedAllocation?.classId === c
            ? '!bg-emerald-600 text-white relative overflow-hidden'
            : ''
            ">
          <div v-if="selectedAllocation?.classId === c" class="absolute inset-0 bg-white/10 animate-pulse"></div>
          <!-- Empty Cell Badge -->
          <div v-if="emptyCellsPerClass[c] > 0"
            class="absolute -top-0.5 -right-0.5 lg:top-1 lg:right-1 min-w-[18px] h-[18px] lg:min-w-[20px] lg:h-[20px] flex items-center justify-center rounded-full text-[8px] lg:text-[9px] font-black shadow-lg z-10 transition-all duration-300"
            :class="showEmptyCells
              ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300/50'
              : 'bg-rose-500 text-white'">
            {{ emptyCellsPerClass[c] }}
          </div>
          <div v-else
            class="absolute top-1 right-1 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-emerald-500 rounded-full shadow-lg z-10">
          </div>
          KELAS {{ c }}
        </div>
      </div>

      <!-- Days and Slots -->
      <div v-for="(day, dIdx) in DAYS" :key="day" class="border-b last:border-b-0">
        <div
          class="sticky top-[83px] lg:top-[89px] bg-indigo-50/90 dark:bg-indigo-950/90 backdrop-blur-sm text-indigo-900 dark:text-indigo-300 font-black px-4 lg:px-6 py-2 lg:py-2.5 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] border-y border-indigo-100/50 dark:border-indigo-900/50 flex items-center gap-2 z-20">
          <div class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
          {{ day }}
        </div>

        <template v-for="(timeData, pIdx) in PERIOD_TIMES" :key="pIdx">

          <!-- Rest Period Row -->
          <div v-if="typeof timeData === 'object' && timeData.isBreak"
            class="grid border-b border-amber-100 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20"
            :style="{ gridTemplateColumns: `${timeColWidth} auto` }">
            <div
              class="p-2 border-r border-amber-100 dark:border-amber-900 sticky left-0 bg-amber-50 dark:bg-amber-950 flex flex-col items-center justify-center z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              <Coffee :size="isMobile ? 12 : 16" class="text-amber-400 dark:text-amber-500 mb-0.5 lg:mb-1" />
              <span class="text-[7px] lg:text-[8px] font-black text-amber-500 dark:text-amber-600">
                {{ timeData.time }}
              </span>
            </div>
            <div
              class="flex items-center justify-center p-2 text-[9px] lg:text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase lg:tracking-[1em] tracking-widest italic select-none">
              ISTIRAHAT
            </div>
          </div>

          <!-- Schedule Row -->
          <div v-else
            class="grid border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors"
            :style="{ gridTemplateColumns: gridTemplate }">
            <!-- Fixed Time Column -->
            <div
              class="p-2 lg:p-3 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              <span class="text-[8px] lg:text-[9px] font-black text-slate-300 dark:text-slate-600">#{{ pIdx + 1
                }}</span>
              <span class="text-[9px] lg:text-[10px] font-black text-slate-600 dark:text-slate-400 mt-0.5">{{
                (typeof timeData === 'object' ? timeData.time : timeData).split(" ")[0] }}</span>
            </div>

            <!-- Subject Cells -->
            <div v-for="cls in classes" :key="cls" @click="$emit('cellClick', dIdx, pIdx, cls)"
              class="p-2 lg:p-3 border-r border-slate-50 dark:border-slate-800 min-h-[70px] lg:min-h-[90px] flex flex-col justify-center items-center text-center cursor-pointer group transition-all relative overflow-hidden"
              :class="[
                isSlotDisabled(dIdx, pIdx, cls)
                  ? 'bg-slate-800/90 dark:bg-slate-950/90'
                  : getSlot(dIdx, pIdx, cls)
                    ? 'bg-white dark:bg-slate-900 shadow-sm'
                    : showEmptyCells
                      ? 'bg-amber-100/80 dark:bg-amber-950/40 ring-2 ring-inset ring-amber-400/50 dark:ring-amber-500/30'
                      : 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-100 dark:hover:border-emerald-900',
                selectedAllocation?.classId === cls &&
                  !isSlotDisabled(dIdx, pIdx, cls)
                  ? '!bg-emerald-50/40 dark:!bg-emerald-900/10 ring-2 ring-inset ring-emerald-500/30 dark:ring-emerald-400/30 shadow-inner'
                  : '',
                selectedAllocation && selectedAllocation.classId !== cls
                  ? 'opacity-30 cursor-not-allowed grayscale pointer-events-none'
                  : '',
              ]">
              <!-- Disabled State -->
              <div v-if="isSlotDisabled(dIdx, pIdx, cls)"
                class="flex flex-col items-center gap-1 z-10 scale-90 lg:group-hover:scale-100 transition-transform">
                <Ban :size="isMobile ? 14 : 16" class="text-rose-400/50" />
                <span
                  class="text-[7px] lg:text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-white">OFF</span>
              </div>

              <!-- Content State -->
              <template v-else-if="getSlot(dIdx, pIdx, cls)">
                <div class="w-full flex flex-col h-full justify-center">
                  <div
                    class="text-[9px] lg:text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase leading-tight lg:leading-snug line-clamp-2 px-1 mb-1">
                    {{ getAllocDetails(getSlot(dIdx, pIdx, cls))?.subjectName }}
                  </div>
                  <div
                    class="text-[7px] lg:text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight line-clamp-1 border-t border-slate-100 dark:border-slate-800 pt-1 mt-auto">
                    {{
                      getAllocDetails(
                        getSlot(dIdx, pIdx, cls),
                      )?.teacherName.split(",")[0]
                    }}
                  </div>
                </div>
                <!-- Interactive indicator -->
                <div
                  class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 dark:group-hover:bg-emerald-400/5 transition-colors">
                </div>
              </template>

              <!-- Empty State -->
              <div v-else class="text-[7px] lg:text-[8px] font-black uppercase tracking-widest transition-all transform"
                :class="[
                  isDisableMode ? 'text-rose-500' : (showEmptyCells ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-500'),
                  showEmptyCells ? 'opacity-100 translate-y-0 animate-pulse' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                ]">
                {{ isDisableMode ? "OFF" : (showEmptyCells ? "KOSONG" : "+ ADD") }}
              </div>

              <!-- Background pattern for disabled slots -->
              <div v-if="isSlotDisabled(dIdx, pIdx, cls)" class="absolute inset-0 z-0 opacity-10" :style="{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #fff, #fff 10px, transparent 10px, transparent 20px)',
              }"></div>
            </div>
          </div>
        </template>
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
