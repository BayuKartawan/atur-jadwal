<script setup>
import { Coffee, Ban } from 'lucide-vue-next';

const props = defineProps({
  DAYS: Array,
  PERIOD_TIMES: Array,
  classes: Array,
  isSlotDisabled: Function,
  getSlot: Function,
  getAllocDetails: Function,
  isDisableMode: Boolean
});

defineEmits(['cellClick']);
</script>

<template>
  <div class="w-full h-full overflow-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar transition-colors duration-300">
    <div class="inline-block min-w-full align-middle">
      <div class="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <!-- Grid Header (Classes) -->
        <div class="grid sticky top-0 bg-slate-900 dark:bg-slate-950 text-white font-bold text-[10px] text-center z-30 shadow-md" 
          :style="{ gridTemplateColumns: `80px repeat(${classes.length}, 110px)` }">
          <div class="p-3 border-r border-slate-800 dark:border-slate-800 sticky left-0 bg-slate-900 dark:bg-slate-950 z-40 flex items-center justify-center uppercase tracking-widest text-slate-400 dark:text-slate-500">JAM</div>
          <div v-for="c in classes" :key="c" 
             class="p-3 border-r border-slate-800 uppercase truncate tracking-[0.2em] font-black">
            {{ c }}
          </div>
        </div>

        <!-- Days and Slots -->
        <div v-for="(day, dIdx) in DAYS" :key="day" class="border-b last:border-b-0">
          <div class="sticky top-[43px] bg-indigo-50/90 dark:bg-indigo-950/90 backdrop-blur-sm text-indigo-900 dark:text-indigo-300 font-black px-4 py-2 text-[10px] uppercase tracking-[0.3em] border-y border-indigo-100/50 dark:border-indigo-900/50 flex items-center gap-2 z-20">
            <div class="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
            {{ day }}
          </div>
          
          <template v-for="(time, pIdx) in PERIOD_TIMES" :key="pIdx">
            <div class="grid border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors" 
              :style="{ gridTemplateColumns: `80px repeat(${classes.length}, 110px)` }">
              
              <!-- Fixed Time Column -->
              <div class="p-2 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <span class="text-[8px] font-black text-slate-300 dark:text-slate-600">#{{ pIdx+1 }}</span>
                <span class="text-[9px] font-black text-slate-600 dark:text-slate-400 mt-0.5">{{ time.split(' ')[0] }}</span>
              </div>

              <!-- Subject Cells -->
              <div v-for="cls in classes" :key="cls" @click="$emit('cellClick', dIdx, pIdx, cls)" 
                class="p-3 border-r border-slate-50 dark:border-slate-800 min-h-[90px] flex flex-col justify-center items-center text-center cursor-pointer group transition-all relative overflow-hidden"
                :class="[
                  isSlotDisabled(dIdx, pIdx, cls) ? 'bg-slate-800/90 dark:bg-slate-950/90' : (getSlot(dIdx, pIdx, cls) ? 'bg-white dark:bg-slate-900 shadow-sm' : 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-100 dark:hover:border-emerald-900')
                ]"
              >
                <!-- Disabled State -->
                <div v-if="isSlotDisabled(dIdx, pIdx, cls)" 
                  class="flex flex-col items-center gap-1 z-10 scale-90 group-hover:scale-100 transition-transform">
                  <Ban :size="16" class="text-rose-400/50" />
                  <span class="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-white">Nonaktif</span>
                </div>

                <!-- Content State -->
                <template v-else-if="getSlot(dIdx, pIdx, cls)">
                  <div class="w-full flex flex-col h-full justify-center">
                    <div class="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase leading-snug line-clamp-2 px-1 mb-1">
                      {{ getAllocDetails(getSlot(dIdx, pIdx, cls))?.subjectName }}
                    </div>
                    <div class="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight line-clamp-1 border-t border-slate-100 dark:border-slate-800 pt-1 mt-auto">
                      {{ getAllocDetails(getSlot(dIdx, pIdx, cls))?.teacherName.split(',')[0] }}
                    </div>
                  </div>
                  <!-- Interactive indicator -->
                  <div class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 dark:group-hover:bg-emerald-400/5 transition-colors"></div>
                </template>

                <!-- Empty State -->
                <div v-else class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  :class="isDisableMode ? 'text-rose-500' : 'text-emerald-500'">
                  {{ isDisableMode ? "NONAKTIF" : "+ TAMBAH" }}
                </div>
                
                <!-- Background pattern for disabled slots -->
                <div v-if="isSlotDisabled(dIdx, pIdx, cls)" 
                  class="absolute inset-0 z-0 opacity-10" 
                  :style="{ backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 10px, transparent 10px, transparent 20px)' }">
                </div>
              </div>
            </div>

            <!-- Rest Periods -->
            <div v-if="pIdx === 3 || pIdx === 5" 
              class="grid border-b border-amber-100 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20" 
              :style="{ gridTemplateColumns: `80px auto` }">
              <div class="p-2 border-r border-amber-100 dark:border-amber-900 sticky left-0 bg-amber-50 dark:bg-amber-950 flex flex-col items-center justify-center z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <Coffee :size="14" class="text-amber-400 dark:text-amber-500 mb-1" />
                <span class="text-[8px] font-black text-amber-500 dark:text-amber-600">{{ pIdx === 3 ? '09:15' : '11:00' }}</span>
              </div>
              <div class="flex items-center justify-center p-2 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.5em] italic select-none">
                Istirahat
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
</style>
