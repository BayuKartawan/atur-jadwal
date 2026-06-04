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
  <div v-if="show" 
    class="fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl text-white font-medium text-sm flex items-center gap-3 z-50 border border-white/10"
    :class="type === 'error' ? 'bg-rose-500 dark:bg-rose-600' : 'bg-indigo-600 dark:bg-indigo-500'"
  >
    <component :is="type === 'error' ? AlertCircle : CheckCircle" :size="20" />
    <span>{{ msg }}</span>
  </div>
</template>
