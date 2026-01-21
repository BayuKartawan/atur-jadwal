<script setup>
import { UserCheck } from 'lucide-vue-next';
import AppCard from '../ui/AppCard.vue';
import AppBadge from '../ui/AppBadge.vue';
import AppSelect from '../ui/AppSelect.vue';
import { computed } from 'vue';

const props = defineProps({
  teachers: Array,
  classes: Array,
  homerooms: Object,
  getTeacherHomeroomClass: Function
});

defineEmits(['setHomeroom']);

const getTeacherOptions = (currentClass) => {
  return props.teachers.map(t => {
    const homeroomClass = props.getTeacherHomeroomClass(t.id);
    const isDisabled = homeroomClass && homeroomClass !== currentClass;
    return {
      label: t.name,
      value: t.id,
      disabled: isDisabled,
      description: isDisabled ? `Wali Kelas ${homeroomClass}` : ''
    };
  });
};
</script>

<template>
  <div class="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto h-full content-start bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar transition-colors duration-500">
    <div v-for="cls in classes" :key="cls" 
      class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-none transition-all duration-500 flex flex-col group relative overflow-visible border-b-4 border-b-transparent hover:border-b-indigo-500 dark:hover:border-b-indigo-400 hover:z-[20] focus-within:z-[30]">
      
      <!-- Icon & Label Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50 rotation-effect group-hover:rotate-12 transition-transform duration-500">
          <UserCheck :size="24" />
        </div>
        <div class="text-right">
          <h5 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Target Kelas</h5>
          <p class="text-lg font-black text-slate-800 dark:text-white">KELAS {{ cls }}</p>
        </div>
      </div>
      
      <!-- Selection Area -->
      <div class="flex-1 flex flex-col gap-2">
        <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none ml-1 italic">Pilih Wali Kelas</label>
        <div class="relative group-hover:scale-[1.01] transition-transform duration-300 z-[1] focus-within:z-[10]">
          <AppSelect 
            placeholder="-- Pilih Guru --"
            :modelValue="homerooms[cls] || ''" 
            :options="getTeacherOptions(cls)"
            @update:modelValue="$emit('setHomeroom', cls, $event)"
          />
        </div>
      </div>
      
      <!-- Status Footer -->
      <div class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div :class="['w-2 h-2 rounded-full', homerooms[cls] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300 dark:bg-slate-700']"></div>
          <span :class="['text-[10px] font-black uppercase tracking-widest', homerooms[cls] ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500']">
            {{ homerooms[cls] ? 'Aktif Terisi' : 'Belum Diatur' }}
          </span>
        </div>
        <AppBadge v-if="homerooms[cls]" variant="success" class="!px-3 !py-1">
          SUDAH OK
        </AppBadge>
      </div>
    </div>
    
    <div v-if="classes.length === 0" class="col-span-full py-32 text-center opacity-30 flex flex-col items-center">
       <div class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
         <UserCheck :size="48" class="text-slate-300 dark:text-slate-600" />
       </div>
       <p class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Silahkan isi data master kelas terlebih dahulu</p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
