<script setup>
import { AlertCircle } from "lucide-vue-next";

defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: "Lanjutkan",
  },
  cancelText: {
    type: String,
    default: "Batal",
  },
  variant: {
    type: String,
    default: "primary",
  },
});

defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 z-[60] flex items-center justify-center p-4"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-800"
    >
      <div class="p-8 text-center sm:text-left">
        <div
          class="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500 sm:mx-0"
        >
          <AlertCircle :size="24" />
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {{ title }}
        </h3>
        <p
          class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
        >
          {{ message }}
        </p>
      </div>
      <div
        class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row gap-3"
      >
        <button
          @click="$emit('cancel')"
          class="flex-1 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'flex-1 px-5 py-2.5 text-white rounded-xl text-sm font-semibold',
            variant === 'danger'
              ? 'bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600'
              : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600',
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
