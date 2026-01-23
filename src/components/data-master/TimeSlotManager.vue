<script setup>
import { ref, computed } from "vue";
import {
  Plus,
  Trash2,
  Clock,
  Edit2,
  Save,
  X,
  GripVertical,
} from "lucide-vue-next";
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";

const props = defineProps({
  periodTimes: Array,
});

const emit = defineEmits([
  "addPeriod",
  "removePeriod",
  "updatePeriod",
  "updatePeriodOrder",
]);

const newPeriod = ref("");
const isNewPeriodBreak = ref(false); // New state for add
const editingIndex = ref(-1);
const editValue = ref("");
const editIsBreak = ref(false); // New state for edit
const draggedIndex = ref(null);

const onDragStart = (index) => {
  draggedIndex.value = index;
};

const onDragOver = (event) => {
  event.preventDefault(); // Necessary to allow dropping
};

const onDrop = (index) => {
  const fromIndex = draggedIndex.value;
  const toIndex = index;

  if (fromIndex === null || fromIndex === toIndex) return;

  const newPeriods = [...props.periodTimes];
  const [movedItem] = newPeriods.splice(fromIndex, 1);
  newPeriods.splice(toIndex, 0, movedItem);

  emit("updatePeriodOrder", newPeriods);
  draggedIndex.value = null;
};

const onDragEnd = () => {
  draggedIndex.value = null;
};

const startEditing = (index, item) => {
  editingIndex.value = index;
  // Handle both string (legacy) and object formats
  if (typeof item === "string") {
    editValue.value = item;
    editIsBreak.value = false;
  } else {
    editValue.value = item.time;
    editIsBreak.value = item.isBreak || false;
  }
};

const cancelEditing = () => {
  editingIndex.value = -1;
  editValue.value = "";
};

const saveEditing = (index) => {
  if (editValue.value.trim()) {
    emit("updatePeriod", {
      index,
      value: {
        time: editValue.value.trim(),
        isBreak: editIsBreak.value,
      },
    });
    cancelEditing();
  }
};

const handleAdd = () => {
  if (newPeriod.value.trim()) {
    emit("addPeriod", {
      time: newPeriod.value.trim(),
      isBreak: isNewPeriodBreak.value,
    });
    newPeriod.value = "";
    isNewPeriodBreak.value = false;
  }
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Add New Period -->
    <AppCard overflowVisible>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400"
          >
            <Clock :size="20" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">
              Tambah Jam Pelajaran
            </h3>
            <p class="text-xs text-slate-500">Format: HH:MM - HH:MM</p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <input
              v-model="newPeriod"
              type="text"
              placeholder="Contoh: 07:15 - 07:45"
              @keyup.enter="handleAdd"
              class="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
            />
            <AppButton
              @click="handleAdd"
              :disabled="!newPeriod.trim()"
              variant="primary"
              size="icon"
              class="!w-11 !h-11 !rounded-xl shrink-0 !bg-orange-600 hover:!bg-orange-700 shadow-lg shadow-orange-500/20"
            >
              <Plus :size="20" />
            </AppButton>
          </div>

          <label
            class="flex items-center gap-2 self-start cursor-pointer group"
          >
            <input
              type="checkbox"
              v-model="isNewPeriodBreak"
              class="checkbox-input hidden"
            />
            <div
              class="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center transition-colors"
              :class="
                isNewPeriodBreak
                  ? 'bg-orange-500 border-orange-500'
                  : 'bg-transparent'
              "
            >
              <div
                v-if="isNewPeriodBreak"
                class="w-2 h-2 bg-white rounded-sm"
              ></div>
            </div>
            <span
              class="text-xs font-bold text-slate-500 group-hover:text-orange-600 transition-colors select-none"
              >Set sebagai Jam Istirahat</span
            >
          </label>
        </div>
      </div>
    </AppCard>

    <!-- Period List -->
    <div class="flex flex-col gap-3">
      <h3
        class="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1"
      >
        Daftar Jam
      </h3>

      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in absolute w-full"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="(period, index) in periodTimes"
          :key="index"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
          :class="[
            'group bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all cursor-move',
            draggedIndex === index
              ? 'opacity-50 ring-2 ring-indigo-500/20'
              : '',
          ]"
        >
          <div class="flex items-center gap-4 flex-1">
            <div
              class="text-slate-300 cursor-grab active:cursor-grabbing hover:text-indigo-400"
            >
              <GripVertical :size="20" />
            </div>
            <div
              class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-black select-none"
            >
              {{ index + 1 }}
            </div>

            <div
              v-if="editingIndex === index"
              class="flex-1 flex flex-col gap-2"
            >
              <input
                v-model="editValue"
                type="text"
                @keyup.enter="saveEditing(index)"
                @keyup.esc="cancelEditing"
                class="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="editIsBreak"
                  class="checkbox-input hidden"
                />
                <div
                  class="w-3 h-3 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center transition-colors"
                  :class="
                    editIsBreak
                      ? 'bg-orange-500 border-orange-500'
                      : 'bg-transparent'
                  "
                >
                  <div
                    v-if="editIsBreak"
                    class="w-1.5 h-1.5 bg-white rounded-sm"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-slate-400 select-none"
                  >Istirahat</span
                >
              </label>
            </div>
            <div v-else class="flex items-center gap-3">
              <span
                class="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono tracking-wide"
              >
                {{ typeof period === "object" ? period.time : period }}
              </span>
              <span
                v-if="typeof period === 'object' && period.isBreak"
                class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider"
              >
                ISTIRAHAT
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <template v-if="editingIndex === index">
              <button
                @click="saveEditing(index)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Save :size="16" />
              </button>
              <button
                @click="cancelEditing"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X :size="16" />
              </button>
            </template>
            <template v-else>
              <button
                @click="startEditing(index, period)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <Edit2 :size="16" />
              </button>
              <button
                @click="$emit('removePeriod', index)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
              >
                <Trash2 :size="16" />
              </button>
            </template>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="periodTimes.length === 0" class="py-8 text-center opacity-50">
        <p class="text-xs italic text-slate-500">
          Belum ada jam pelajaran diatur
        </p>
      </div>
    </div>
  </div>
</template>
