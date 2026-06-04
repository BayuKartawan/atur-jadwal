<script setup>
import { ref } from "vue";
import { Plus, Trash2, Layers } from "lucide-vue-next";
import AppCard from "../ui/KartuAplikasi.vue";
import AppButton from "../ui/TombolAplikasi.vue";
import AppInput from "../ui/InputAplikasi.vue";
import AppSelect from "../ui/PilihanAplikasi.vue";

const props = defineProps({
  classes: Array,
  teachers: Array,
  homerooms: Object,
  getTeacherHomeroomClass: Function,
});

const emit = defineEmits(["add", "remove", "setHomeroom"]);

const newClass = ref("");

const handleAdd = () => {
  if (!newClass.value.trim()) return;
  emit("add", newClass.value);
  newClass.value = "";
};

const getTeacherOptions = (currentClass) => {
  return props.teachers.map((t) => {
    const homeroomClass = props.getTeacherHomeroomClass(t.id);
    const isDisabled = homeroomClass && homeroomClass !== currentClass;
    return {
      label: t.name,
      value: t.id,
      disabled: isDisabled,
      description: isDisabled ? `Wali Kelas ${homeroomClass}` : "",
    };
  });
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
            Manajemen Kelas & Wali Kelas
          </h3>
          <p class="text-xs font-medium text-slate-500 mt-1">
            Kelola rombel siswa beserta guru wali kelas pendamping
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
          class="w-12 h-12 !p-0 !bg-sky-500 hover:bg-sky-600 dark:shadow-none"
        >
          <Plus :size="20" />
        </AppButton>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <TransitionGroup
          enter-active-class="transition ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="cls in classes"
            :key="cls"
            class="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl group hover:border-indigo-500 dark:hover:border-indigo-400 relative overflow-visible"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  {{ cls }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-tight">Kelas {{ cls }}</h4>
                </div>
              </div>
              <AppButton
                @click="$emit('remove', cls)"
                variant="danger"
                size="icon"
                class="!p-1.5 !rounded-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              >
                <Trash2 :size="12" />
              </AppButton>
            </div>

            <!-- Wali Kelas Selection -->
            <div class="flex-1 flex flex-col gap-1.5 mt-2">
              <label class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none ml-1 italic">
                Pilih Wali Kelas
              </label>
              <div class="relative z-[1] focus-within:z-[10]">
                <AppSelect
                  placeholder="-- Pilih Wali Kelas --"
                  :modelValue="homerooms[cls] || ''"
                  :options="getTeacherOptions(cls)"
                  clearable
                  size="sm"
                  @update:modelValue="$emit('setHomeroom', cls, $event)"
                />
              </div>
            </div>

            <!-- Status Indicator Footer -->
            <div class="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center gap-1.5">
              <div
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  homerooms[cls] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                ]"
              ></div>
              <span
                :class="[
                  'text-[9px] font-bold uppercase tracking-wider',
                  homerooms[cls] ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                ]"
              >
                {{ homerooms[cls] ? 'Wali Kelas Terisi' : 'Belum Diatur' }}
              </span>
            </div>
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
