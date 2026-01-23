<script setup>
import { ref } from "vue";
import { Plus, Trash2, Layers } from "lucide-vue-next";
import AppCard from "../ui/AppCard.vue";
import AppButton from "../ui/AppButton.vue";
import AppInput from "../ui/AppInput.vue";

const props = defineProps({
  classes: Array,
});

const emit = defineEmits(["add", "remove"]);

const newClass = ref("");

const handleAdd = () => {
  if (!newClass.value.trim()) return;
  emit("add", newClass.value);
  newClass.value = "";
};
</script>

<template>
  <AppCard bodyClass="!p-4 lg:!p-6">
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400"
        >
          <Layers :size="24" />
        </div>
        <div>
          <h3
            class="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none"
          >
            Manajemen Kelas
          </h3>
          <p class="text-xs font-medium text-slate-500 mt-1">
            Kelola rombel siswa
          </p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex gap-3">
        <AppInput
          v-model="newClass"
          placeholder="Nama Kelas (Contoh: 1A)..."
          @keyup.enter="handleAdd"
          class="flex-1"
        />
        <AppButton
          @click="handleAdd"
          size="icon"
          class="w-12 h-12 !p-0 !bg-sky-500 hover:bg-sky-600 shadow-sky-100 dark:shadow-none"
        >
          <Plus :size="20" />
        </AppButton>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="cls in classes"
            :key="cls"
            class="flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl group hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 transition-all relative"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 group-hover:bg-sky-100 dark:group-hover:bg-sky-900 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-all flex items-center justify-center text-lg font-black text-slate-600 dark:text-slate-400 mb-2 shadow-sm border border-slate-100 dark:border-slate-700"
            >
              {{ cls }}
            </div>
            <span
              class="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-tight"
              >Kelas {{ cls }}</span
            >

            <AppButton
              @click="$emit('remove', cls)"
              variant="danger"
              size="icon"
              class="absolute top-2 right-2 !p-2 !rounded-xl opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <Trash2 :size="14" />
            </AppButton>
          </div>
        </TransitionGroup>

        <div
          v-if="classes.length === 0"
          class="col-span-full py-12 text-center opacity-40"
        >
          <Layers
            :size="32"
            class="mx-auto mb-2 text-slate-300 dark:text-slate-700"
          />
          <p
            class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            Belum ada data kelas
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
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
