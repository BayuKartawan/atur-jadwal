<script setup>
import { ref } from 'vue';
import { Plus, Trash2, User } from 'lucide-vue-next';
import AppCard from '../ui/AppCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import AppBadge from '../ui/AppBadge.vue';

const props = defineProps({
  teachers: Array,
  getTeacherHomeroomClass: Function
});

const emit = defineEmits(['add', 'remove']);

const newTeacher = ref('');

const handleAdd = () => {
  if (!newTeacher.value.trim()) return;
  emit('add', newTeacher.value);
  newTeacher.value = '';
};
</script>

<template>
  <AppCard>
    <template #header>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <User :size="24" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Manajemen Guru</h3>
          <p class="text-xs font-medium text-slate-500 mt-1">Kelola data tenaga pengajar</p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex gap-3">
        <AppInput 
          v-model="newTeacher" 
          placeholder="Nama Lengkap Guru..." 
          @keyup.enter="handleAdd"
          class="flex-1"
        />
        <AppButton @click="handleAdd" size="icon" class="w-12 h-12 !p-0">
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
          <div v-for="t in teachers" :key="t.id" 
            class="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl group hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all">
            <div class="flex items-center gap-3 min-w-0 flex-1 mr-4">
              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs uppercase group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                {{ t.name.charAt(0) }}
              </div>
              <span class="font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-slate-900 dark:group-hover:text-white truncate">
                {{ t.name }}
                <AppBadge v-if="getTeacherHomeroomClass(t.id)" variant="success" class="ml-2 inline-flex">
                  Wali {{ getTeacherHomeroomClass(t.id) }}
                </AppBadge>
              </span>
            </div>
            <AppButton @click="$emit('remove', t.id)" variant="danger" size="icon" class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 !p-2 !rounded-xl shrink-0">
              <Trash2 :size="16" />
            </AppButton>
          </div>
        </TransitionGroup>
        
        <div v-if="teachers.length === 0" class="py-12 text-center opacity-40">
          <User :size="32" class="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Belum ada data guru</p>
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
