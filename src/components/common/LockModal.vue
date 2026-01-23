<script setup>
import { Lock, Unlock } from "lucide-vue-next";
import { ref, nextTick, watch } from "vue";

const props = defineProps({
  show: Boolean,
  isLocked: Boolean, // If true, we are unlocking. If false, we are locking.
  validationError: String,
});

const emit = defineEmits(["confirm", "cancel", "update:show"]);

const password = ref("");
const error = ref("");
const inputRef = ref(null);

const handleSubmit = () => {
  if (!password.value) {
    error.value = "Password tidak boleh kosong";
    return;
  }
  emit("confirm", password.value);
  password.value = "";
  error.value = "";
};

const handleCancel = () => {
  emit("cancel");
  emit("update:show", false);
  password.value = "";
  error.value = "";
};

// Focus input when modal opens
watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  },
);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-300"
      >
        <div class="p-8 text-center">
          <div
            class="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full text-white sm:mx-0 shadow-lg"
            :class="
              isLocked
                ? 'bg-rose-500 shadow-rose-200 dark:shadow-none'
                : 'bg-indigo-500 shadow-indigo-200 dark:shadow-none'
            "
          >
            <Lock v-if="isLocked" :size="32" />
            <Unlock v-else :size="32" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {{ isLocked ? "Buka Kunci Aplikasi" : "Kunci Aplikasi" }}
          </h3>
          <p
            class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6"
          >
            {{
              isLocked
                ? "Masukkan password untuk membuka kunci dan mengedit data."
                : "Masukkan password untuk mengunci aplikasi. Data tidak akan bisa diubah."
            }}
          </p>

          <div class="mb-2">
            <input
              ref="inputRef"
              v-model="password"
              type="password"
              placeholder="Masukkan Password"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              @keyup.enter="handleSubmit"
            />
            <p
              v-if="error || validationError"
              class="text-rose-500 text-sm mt-2 font-medium"
            >
              {{ error || validationError }}
            </p>
          </div>
        </div>
        <div
          class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row gap-3"
        >
          <button
            @click="handleCancel"
            class="flex-1 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button
            @click="handleSubmit"
            :class="[
              'flex-1 px-5 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md transition-all',
              isLocked
                ? 'bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 shadow-rose-100 dark:shadow-none'
                : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-indigo-100 dark:shadow-none',
            ]"
          >
            {{ isLocked ? "Buka Kunci" : "Kunci Sekarang" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
