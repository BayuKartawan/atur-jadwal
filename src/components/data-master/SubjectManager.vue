<script setup>
import { ref, reactive } from "vue";
import { Plus, Trash2, BookOpen, Pencil, Check, X } from "lucide-vue-next";
import AppCard from "../ui/AppCard.vue";
import AppButton from "../ui/AppButton.vue";
import AppInput from "../ui/AppInput.vue";
import AppBadge from "../ui/AppBadge.vue";
import AppSelect from "../ui/AppSelect.vue";

const props = defineProps({
  subjects: Array,
});

const emit = defineEmits(["add", "remove", "update"]);

const newSubject = reactive({ name: "", type: "umum" });
const editingId = ref(null);
const editSubject = reactive({ name: "", type: "umum" });

const handleAdd = () => {
  if (!newSubject.name.trim()) return;
  emit("add", { ...newSubject });
  newSubject.name = "";
  newSubject.type = "umum";
};

const startEdit = (s) => {
  editingId.value = s.id;
  editSubject.name = s.name;
  editSubject.type = s.type;
};

const cancelEdit = () => {
  editingId.value = null;
};

const handleUpdate = () => {
  if (!editSubject.name.trim()) return;
  emit("update", { id: editingId.value, data: { ...editSubject } });
  editingId.value = null;
};

const typeOptions = [
  { label: "UMUM", value: "umum" },
  { label: "AGAMA", value: "agama" },
  { label: "MULOK", value: "mulok" },
];
</script>

<template>
  <AppCard bodyClass="!p-4 lg:!p-6" overflowVisible>
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400"
        >
          <BookOpen :size="24" />
        </div>
        <div>
          <h3
            class="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none"
          >
            Mata Pelajaran
          </h3>
          <p class="text-xs font-medium text-slate-500 mt-1">
            Kelola jenis kurikulum
          </p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <AppInput
          v-model="newSubject.name"
          placeholder="Nama Mapel..."
          @keyup.enter="handleAdd"
          class="flex-1 w-full"
        >
          <template #suffix>
            <div class="w-32">
              <AppSelect
                v-model="newSubject.type"
                :options="typeOptions"
                class="!rounded-xl"
              />
            </div>
          </template>
        </AppInput>
        <AppButton
          @click="handleAdd"
          size="icon"
          class="w-full sm:w-12 h-12 !p-0 !bg-amber-500 hover:bg-amber-600 shadow-amber-100 dark:shadow-none shrink-0"
        >
          <Plus :size="20" />
        </AppButton>
      </div>

      <div class="space-y-3">
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in absolute w-full"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="s in subjects"
            :key="s.id"
            class="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl group hover:border-amber-200 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all relative overflow-visible hover:z-[10] focus-within:z-[20]"
          >
            <div class="flex items-center gap-4 min-w-0 flex-1 mr-4">
              <div
                class="w-1.5 h-10 rounded-full shrink-0"
                :class="
                  s.type === 'agama'
                    ? 'bg-purple-500'
                    : s.type === 'umum'
                      ? 'bg-emerald-500'
                      : 'bg-orange-500'
                "
              ></div>

              <div
                v-if="editingId === s.id"
                class="flex-1 flex flex-col sm:flex-row gap-2"
              >
                <AppInput
                  v-model="editSubject.name"
                  size="sm"
                  class="flex-1"
                  @keyup.enter="handleUpdate"
                  @keyup.esc="cancelEdit"
                  autofocus
                >
                  <template #suffix>
                    <div class="w-32">
                      <AppSelect
                        v-model="editSubject.type"
                        :options="typeOptions"
                        class="!rounded-xl"
                      />
                    </div>
                  </template>
                </AppInput>
              </div>
              <div v-else class="min-w-0 flex-1">
                <span
                  class="font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white block transition-colors truncate"
                  >{{ s.name }}</span
                >
                <AppBadge
                  :variant="
                    s.type === 'agama'
                      ? 'info'
                      : s.type === 'umum'
                        ? 'success'
                        : 'warning'
                  "
                >
                  {{ s.type }}
                </AppBadge>
              </div>
            </div>
            <div class="flex gap-2">
              <template v-if="editingId === s.id">
                <AppButton
                  @click="handleUpdate"
                  variant="success"
                  size="icon"
                  class="!p-2 !rounded-xl shrink-0"
                >
                  <Check :size="16" />
                </AppButton>
                <AppButton
                  @click="cancelEdit"
                  variant="ghost"
                  size="icon"
                  class="!p-2 !rounded-xl shrink-0"
                >
                  <X :size="16" />
                </AppButton>
              </template>
              <template v-else>
                <AppButton
                  @click="startEdit(s)"
                  variant="ghost"
                  size="icon"
                  class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 !p-2 !rounded-xl shrink-0"
                >
                  <Pencil :size="16" />
                </AppButton>
                <AppButton
                  @click="$emit('remove', s.id)"
                  variant="danger"
                  size="icon"
                  class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 !p-2 !rounded-xl shrink-0"
                >
                  <Trash2 :size="16" />
                </AppButton>
              </template>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="subjects.length === 0" class="py-12 text-center opacity-40">
          <BookOpen
            :size="32"
            class="mx-auto mb-2 text-slate-300 dark:text-slate-700"
          />
          <p
            class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            Belum ada data mapel
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
