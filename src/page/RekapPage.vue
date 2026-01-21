<script setup>
import { ref } from 'vue';
import JtmRecap from '../components/reports/JtmRecap.vue';
import ClassRecap from '../components/reports/ClassRecap.vue';

const props = defineProps({
  teachers: Array,
  allocations: Array,
  classes: Array,
  getTeacherHomeroomClass: Function,
  getUsedJtm: Function
});

const activeTab = ref('teacher'); // 'teacher' or 'class'
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
    <!-- Tab Navigation -->
    <div class="px-4 pt-4 lg:px-8 lg:pt-8 pb-0 shrink-0">
      <div
        class="bg-white dark:bg-slate-900 rounded-xl lg:rounded-t-[2rem] lg:rounded-b-none border border-slate-100 dark:border-slate-800 p-1.5 lg:p-2 flex gap-2 w-full lg:w-fit mx-auto relative lg:-mb-px z-10 shadow-sm lg:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button @click="activeTab = 'teacher'" :class="[
          'flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-lg lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all duration-300 text-center',
          activeTab === 'teacher'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        ]">
          Rekap Guru
        </button>
        <button @click="activeTab = 'class'" :class="[
          'flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-lg lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all duration-300 text-center',
          activeTab === 'class'
            ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        ]">
          Rekap Per Kelas
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-hidden relative">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in absolute inset-0"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
        <div v-if="activeTab === 'teacher'" class="h-full w-full">
          <JtmRecap :teachers="teachers" :allocations="allocations" :getTeacherHomeroomClass="getTeacherHomeroomClass"
            :getUsedJtm="getUsedJtm" />
        </div>

        <div v-else-if="activeTab === 'class'" class="h-full w-full">
          <ClassRecap :classes="classes" :teachers="teachers" :allocations="allocations" :getUsedJtm="getUsedJtm" />
        </div>
      </Transition>
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
