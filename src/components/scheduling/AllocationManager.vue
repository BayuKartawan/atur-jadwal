<script setup>
import { ref, computed } from "vue";
import {
  Filter,
  Trash2,
  Plus,
  Search,
  X,
  RotateCcw,
  Pencil,
} from "lucide-vue-next";
import AppCard from "../ui/AppCard.vue";
import AppButton from "../ui/AppButton.vue";
import AppBadge from "../ui/AppBadge.vue";
import AppSelect from "../ui/AppSelect.vue";

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  allocations: Array,
  allocForm: Object,
  filterClass: String,
  filterTeacher: String,
  filteredAllocations: Array,
  getAllocDetails: Function,
  getTeacherHomeroomClass: Function,
  isEditing: Boolean,
});

const emit = defineEmits([
  "update:filterClass",
  "update:filterTeacher",
  "add",
  "remove",
  "teacherChange",
  "showModal",
  "edit",
  "cancelEdit",
]);

const searchQuery = ref("");

const confirmRemove = (id) => {
  emit("showModal", {
    title: "Hapus Alokasi",
    message:
      "Apakah Anda yakin ingin menghapus alokasi jam ini? Tindakan ini tidak dapat dibatalkan.",
    onConfirm: () => {
      emit("remove", id);
      emit("showModal", null);
    },
  });
};

const finalAllocations = computed(() => {
  let result = props.filteredAllocations;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((a) => {
      const details = props.getAllocDetails(a.id);
      const subject = details?.subjectName?.toLowerCase() || "";
      const teacher = details?.teacherName?.toLowerCase() || "";
      const cls =
        typeof a.classId === "string"
          ? a.classId.toLowerCase()
          : a.classId.toString();
      return (
        subject.includes(query) ||
        teacher.includes(query) ||
        cls.includes(query)
      );
    });
  }
  return result.sort((a, b) => {
    const subjA = props.getAllocDetails(a.id)?.subjectName?.toLowerCase() || "";
    const subjB = props.getAllocDetails(b.id)?.subjectName?.toLowerCase() || "";
    return subjA.localeCompare(subjB);
  });
});

const filteredSubjects = computed(() => {
  const teacherId = props.allocForm?.teacherId;
  const isHomeroom = teacherId && props.getTeacherHomeroomClass(teacherId);

  if (isHomeroom) {
    return props.subjects.filter(
      (s) => s.type === "umum" || s.type === "mulok",
    );
  }

  return props.subjects;
});

const hasFilters = computed(() => {
  return (
    props.filterClass !== "all" ||
    props.filterTeacher !== "all" ||
    searchQuery.value !== ""
  );
});

const clearFilters = () => {
  emit("update:filterClass", "all");
  emit("update:filterTeacher", "all");
  searchQuery.value = "";
};

const teacherOptions = computed(() => {
  return props.teachers.map((t) => ({ label: t.name, value: t.id }));
});

const subjectOptions = computed(() => {
  return filteredSubjects.value.map((s) => ({ label: s.name, value: s.id }));
});

const classOptions = computed(() => {
  return props.classes.map((c) => ({ label: `Kelas ${c}`, value: c }));
});

const filterClassOptions = computed(() => {
  return [
    { label: "Semua Kelas", value: "all" },
    ...props.classes.map((c) => ({ label: `Kelas ${c}`, value: c })),
  ];
});

const filterTeacherOptions = computed(() => {
  return [
    { label: "Semua Guru", value: "all" },
    ...props.teachers.map((t) => ({ label: t.name, value: t.id })),
  ];
});
</script>

<template>
  <div
    class="p-4 lg:p-8 flex flex-col h-auto lg:h-full min-h-full bg-slate-50/50 dark:bg-slate-950/50"
  >
    <!-- Add Allocation Form -->
    <AppCard class="mb-8" overflowVisible>
      <div class="grid grid-cols-2 md:grid-cols-12 gap-4 lg:gap-6 items-end">
        <div class="col-span-2 md:col-span-4">
          <AppSelect
            label="Pilih Guru"
            :modelValue="allocForm.teacherId"
            :options="teacherOptions"
            placeholder="-- Pilih Guru --"
            @update:modelValue="$emit('teacherChange', $event)"
          />
        </div>
        <div class="col-span-2 md:col-span-3">
          <AppSelect
            label="Mata Pelajaran"
            v-model="allocForm.subjectId"
            :options="subjectOptions"
            placeholder="-- Pilih Mapel --"
            :disabled="!allocForm.teacherId"
          />
        </div>
        <div class="col-span-1 md:col-span-2">
          <AppSelect
            label="Kelas"
            v-model="allocForm.classId"
            :options="classOptions"
            placeholder="-- Pilih Kelas --"
            :disabled="
              !!getTeacherHomeroomClass(allocForm.teacherId) ||
              !allocForm.teacherId
            "
          />
        </div>
        <div class="col-span-1 md:col-span-1 flex flex-col gap-1.5">
          <label
            class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center"
            >JTM</label
          >
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-sm text-center font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            {{ allocForm.jtm }}
          </div>
        </div>
        <div class="col-span-2 md:col-span-2 flex gap-2">
          <button
            v-if="isEditing"
            @click="$emit('cancelEdit')"
            type="button"
            class="h-[52px] w-[52px] rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 flex items-center justify-center shrink-0 transition-all active:scale-95"
            title="Batal Edit"
          >
            <X :size="24" stroke-width="2.5" />
          </button>
          <AppButton
            @click="$emit('add')"
            :variant="isEditing ? 'warning' : 'success'"
            class="w-full !h-[52px] !rounded-2xl !text-white shadow-lg transition-all duration-300 group active:scale-95 disabled:!bg-slate-200 dark:disabled:!bg-slate-800 disabled:!text-slate-400 flex items-center justify-center"
            :class="
              isEditing
                ? '!bg-amber-500 hover:!bg-amber-600 shadow-amber-200 dark:shadow-amber-900/40'
                : '!bg-emerald-600 dark:!bg-emerald-500 hover:!bg-emerald-700 dark:hover:!bg-emerald-400 shadow-emerald-200 dark:shadow-emerald-900/40'
            "
            :disabled="
              !allocForm.teacherId ||
              !allocForm.subjectId ||
              !allocForm.classId ||
              allocForm.jtm <= 0
            "
          >
            <template #icon-left>
              <Pencil
                v-if="isEditing"
                :size="20"
                class="group-hover:rotate-12 transition-transform duration-300"
              />
              <Plus
                v-else
                :size="20"
                class="group-hover:rotate-90 transition-transform duration-300"
              />
            </template>
            <span class="font-black uppercase tracking-widest text-[11px]">{{
              isEditing ? "Update" : "Tambah"
            }}</span>
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Allocation List with Filters -->
    <div class="flex-none lg:flex-1 lg:overflow-hidden flex flex-col">
      <div
        class="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 lg:mb-6 gap-4"
      >
        <div class="flex items-center gap-4 shrink-0">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm overflow-hidden shrink-0"
          >
            <Filter :size="20" class="lg:hidden" />
            <Filter :size="24" class="hidden lg:block" />
          </div>
          <div>
            <h3
              class="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 leading-none"
            >
              Daftar Alokasi
            </h3>
            <p class="text-xs font-medium text-slate-500 mt-1">
              Saring berdasarkan filter
            </p>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 w-full xl:flex-row xl:items-center xl:w-auto"
        >
          <!-- Search and Mobile Reset -->
          <div class="flex items-center gap-2 w-full xl:w-80">
            <div class="relative flex-1 group">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                :size="16"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari mapel, guru, kelas..."
                class="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
              >
                <X :size="12" stroke-width="3" />
              </button>
            </div>
          </div>

          <!-- Dropdowns and Desktop Reset -->
          <div class="flex items-center gap-2 w-full xl:w-auto">
            <div
              class="flex flex-row items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 xl:flex-none"
            >
              <AppSelect
                :modelValue="filterClass"
                :options="filterClassOptions"
                size="sm"
                class="w-28 sm:w-32 !bg-transparent !border-0"
                @update:modelValue="$emit('update:filterClass', $event)"
              />
              <div
                class="h-4 w-px bg-slate-100 dark:bg-slate-800 shrink-0"
              ></div>
              <AppSelect
                :modelValue="filterTeacher"
                :options="filterTeacherOptions"
                size="sm"
                class="flex-1 sm:!min-w-[160px] !bg-transparent !border-0"
                @update:modelValue="$emit('update:filterTeacher', $event)"
              />
            </div>

            <AppButton
              v-if="hasFilters"
              @click="clearFilters"
              variant="danger"
              size="icon"
              class="!p-2 !rounded-2xl shrink-0 !w-10 !h-10"
              title="Hapus Filter"
            >
              <RotateCcw :size="16" />
            </AppButton>
          </div>
        </div>
      </div>

      <div
        class="flex-1 lg:overflow-y-auto lg:overflow-x-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-0 lg:pr-2 custom-scrollbar content-start pb-8 pt-4"
      >
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in absolute"
        >
          <div
            v-for="a in finalAllocations"
            :key="a.id"
            class="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-auto relative group"
          >
            <!-- Card Header: Class & Actions -->
            <div class="flex items-start justify-between mb-3">
              <!-- Class Badge -->
              <div
                class="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50"
              >
                <div
                  class="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm"
                >
                  {{ a.classId }}
                </div>
                <span
                  class="text-xs font-bold text-emerald-700 dark:text-emerald-400"
                  >Kelas {{ a.classId }}</span
                >
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1">
                <button
                  @click="$emit('edit', a)"
                  class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center transition-colors"
                  title="Edit"
                >
                  <Pencil :size="14" stroke-width="2.5" />
                </button>
                <button
                  @click="confirmRemove(a.id)"
                  class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center justify-center transition-colors"
                  title="Hapus"
                >
                  <Trash2 :size="14" stroke-width="2.5" />
                </button>
              </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 space-y-2 mb-4">
              <h3
                class="text-sm lg:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2"
                :title="getAllocDetails(a.id)?.subjectName"
              >
                {{
                  getAllocDetails(a.id)?.subjectName || "Data Tidak Ditemukan"
                }}
              </h3>
              <div class="flex items-center gap-2">
                <div
                  class="w-1 h-8 rounded-full bg-slate-100 dark:bg-slate-800"
                ></div>
                <div>
                  <h4
                    class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                  >
                    Guru Pengampu
                  </h4>
                  <p
                    class="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1"
                    :title="getAllocDetails(a.id)?.teacherName"
                  >
                    {{
                      getAllocDetails(a.id)?.teacherName || "Guru Belum Diatur"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer: JTM & ID -->
            <div
              class="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto"
            >
              <div class="flex items-center gap-2">
                <div
                  class="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-wide border border-indigo-100 dark:border-indigo-800/30"
                >
                  {{ a.jtm }} JTM
                </div>
              </div>
              <span
                class="text-[9px] font-mono text-slate-300 dark:text-slate-700"
                >#{{ a.id.slice(0, 4) }}</span
              >
            </div>
          </div>
        </TransitionGroup>

        <div
          v-if="finalAllocations.length === 0"
          class="col-span-full py-24 text-center opacity-40"
        >
          <div
            class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-50 dark:border-slate-700"
          >
            <Filter :size="32" class="text-slate-300 dark:text-slate-600" />
          </div>
          <p
            class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            Tidak ada alokasi yang ditemukan
          </p>
        </div>
      </div>
    </div>
  </div>
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
