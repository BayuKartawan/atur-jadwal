<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      sizeClasses[size],
      variantClasses[variant]
    ]"
    :type="type"
    :disabled="disabled"
  >
    <slot name="icon-left"></slot>
    <slot></slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-semibold',
  md: 'px-6 py-2.5 text-[10px] font-black uppercase tracking-widest',
  lg: 'px-8 py-3 text-sm font-bold',
  icon: 'p-2.5'
};

const variantClasses = {
  primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700',
  secondary: 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm',
  ghost: 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
  danger: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white',
  success: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white',
  dark: 'bg-indigo-950 dark:bg-slate-900 text-white hover:bg-slate-800'
};
</script>
