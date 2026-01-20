<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
      variantClasses[variant]
    ]"
  >
    <slot></slot>
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
});

const variantClasses = {
  primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
};
</script>
