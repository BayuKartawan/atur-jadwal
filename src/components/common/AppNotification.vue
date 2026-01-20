<script setup>
import { CheckCircle, AlertCircle } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  msg: String,
  type: {
    type: String,
    default: 'success'
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out transform"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in transform"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="show" 
      class="fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 z-50 border border-white/10 transition-colors"
      :class="type === 'error' ? 'bg-rose-500 dark:bg-rose-600 shadow-rose-200 dark:shadow-none' : 'bg-indigo-600 dark:bg-indigo-500 shadow-indigo-100 dark:shadow-none'"
    >
      <component :is="type === 'error' ? AlertCircle : CheckCircle" :size="20" />
      <span>{{ msg }}</span>
    </div>
  </Transition>
</template>
