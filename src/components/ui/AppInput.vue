<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
      {{ label }}
    </label>
    <div :class="[
      'flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20',
      error ? 'border-rose-500/50' : 'border-slate-100 dark:border-slate-700'
    ]">
      <div v-if="$slots.icon" class="pl-4 text-slate-400">
        <slot name="icon"></slot>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        class="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-700 dark:text-slate-200"
      />
      <div v-if="$slots.suffix" class="pr-2">
        <slot name="suffix"></slot>
      </div>
    </div>
    <span v-if="error" class="text-[9px] font-bold text-rose-500 ml-1 uppercase">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  error: String
});

defineEmits(['update:modelValue']);
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
