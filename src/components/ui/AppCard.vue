<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
    <div v-if="$slots.header" class="px-8 py-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
      <slot name="header"></slot>
    </div>
    <div :class="['p-8', bodyClass]">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bodyClass: {
    type: String,
    default: ''
  }
});
</script>
