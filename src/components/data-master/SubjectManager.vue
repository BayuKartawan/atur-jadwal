<script setup>
import { reactive } from 'vue';
import { Plus, Trash2, BookOpen } from 'lucide-vue-next';
import AppCard from '../ui/AppCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import AppBadge from '../ui/AppBadge.vue';

const props = defineProps({
  subjects: Array
});

const emit = defineEmits(['add', 'remove']);

const newSubject = reactive({ name: '', type: 'umum' });

const handleAdd = () => {
  if (!newSubject.name.trim()) return;
  emit('add', { ...newSubject });
  newSubject.name = '';
  newSubject.type = 'umum';
};
</script>

<template>
  <AppCard>
    <template #header>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <BookOpen :size="24" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Mata Pelajaran</h3>
          <p class="text-xs font-medium text-slate-500 mt-1">Kelola jenis kurikulum</p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <AppInput 
          v-model="newSubject.name" 
          placeholder="Nama Mapel..." 
          @keyup.enter="handleAdd"
          class="flex-1 w-full"
        >
          <template #suffix>
            <div class="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <select class="px-3 py-1.5 text-[10px] font-black bg-transparent border-none outline-none appearance-none cursor-pointer text-slate-600 dark:text-slate-300 uppercase tracking-widest" v-model="newSubject.type">
                <option value="umum" class="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">UMUM</option>
                <option value="agama" class="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">AGAMA</option>
                <option value="mulok" class="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">MULOK</option>
              </select>
            </div>
          </template>
        </AppInput>
        <AppButton @click="handleAdd" size="icon" class="w-full sm:w-12 h-12 !p-0 !bg-amber-500 hover:bg-amber-600 shadow-amber-100 dark:shadow-none shrink-0">
          <Plus :size="20" />
        </AppButton>
      </div>

      <div class="space-y-3">
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in absolute w-full"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-for="s in subjects" :key="s.id" 
            class="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl group hover:border-amber-200 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all">
            <div class="flex items-center gap-4 min-w-0 flex-1 mr-4">
              <div class="w-1.5 h-10 rounded-full shrink-0" 
                :class="s.type==='agama'?'bg-purple-500':s.type==='umum'?'bg-emerald-500':'bg-orange-500'"></div>
              <div class="min-w-0 flex-1">
                <span class="font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white block transition-colors truncate">{{ s.name }}</span>
                <AppBadge :variant="s.type==='agama'?'info' : s.type==='umum'?'success' : 'warning'">
                  {{ s.type }}
                </AppBadge>
              </div>
            </div>
            <AppButton @click="$emit('remove', s.id)" variant="danger" size="icon" class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 !p-2 !rounded-xl shrink-0">
              <Trash2 :size="16" />
            </AppButton>
          </div>
        </TransitionGroup>
        
        <div v-if="subjects.length === 0" class="py-12 text-center opacity-40">
          <BookOpen :size="32" class="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Belum ada data mapel</p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
