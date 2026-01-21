<script setup>
import { ref, computed } from 'vue';
import { Filter, Trash2, Plus, Search, X, RotateCcw } from 'lucide-vue-next';
import AppCard from '../ui/AppCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppBadge from '../ui/AppBadge.vue';
import AppSelect from '../ui/AppSelect.vue';

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
  getTeacherHomeroomClass: Function
});

const emit = defineEmits(['update:filterClass', 'update:filterTeacher', 'add', 'remove', 'teacherChange', 'showModal']);

const searchQuery = ref('');

const confirmRemove = (id) => {
  emit('showModal', {
    title: 'Hapus Alokasi',
    message: 'Apakah Anda yakin ingin menghapus alokasi jam ini? Tindakan ini tidak dapat dibatalkan.',
    onConfirm: () => {
      emit('remove', id);
      emit('showModal', null);
    }
  });
};

const finalAllocations = computed(() => {
  let result = props.filteredAllocations;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(a => {
      const details = props.getAllocDetails(a.id);
      const subject = details?.subjectName?.toLowerCase() || '';
      const teacher = details?.teacherName?.toLowerCase() || '';
      const cls = typeof a.classId === 'string' ? a.classId.toLowerCase() : a.classId.toString();
      return subject.includes(query) || teacher.includes(query) || cls.includes(query);
    });
  }
  return result.sort((a, b) => {
    const subjA = props.getAllocDetails(a.id)?.subjectName?.toLowerCase() || '';
    const subjB = props.getAllocDetails(b.id)?.subjectName?.toLowerCase() || '';
    return subjA.localeCompare(subjB);
  });
});

const filteredSubjects = computed(() => {
  const teacherId = props.allocForm?.teacherId;
  const isHomeroom = teacherId && props.getTeacherHomeroomClass(teacherId);
  
  if (isHomeroom) {
    return props.subjects.filter(s => s.type === 'umum' || s.type === 'mulok');
  }
  
  return props.subjects;
});

const hasFilters = computed(() => {
  return props.filterClass !== 'all' || props.filterTeacher !== 'all' || searchQuery.value !== '';
});

const clearFilters = () => {
  emit('update:filterClass', 'all');
  emit('update:filterTeacher', 'all');
  searchQuery.value = '';
};

const teacherOptions = computed(() => {
  return props.teachers.map(t => ({ label: t.name, value: t.id }));
});

const subjectOptions = computed(() => {
  return filteredSubjects.value.map(s => ({ label: s.name, value: s.id }));
});

const classOptions = computed(() => {
  return props.classes.map(c => ({ label: `Kelas ${c}`, value: c }));
});

const filterClassOptions = computed(() => {
  return [
    { label: 'Semua Kelas', value: 'all' },
    ...props.classes.map(c => ({ label: `Kelas ${c}`, value: c }))
  ];
});

const filterTeacherOptions = computed(() => {
  return [
    { label: 'Semua Guru', value: 'all' },
    ...props.teachers.map(t => ({ label: t.name, value: t.id }))
  ];
});
</script>

<template>
  <div class="p-4 lg:p-8 flex flex-col h-auto lg:h-full min-h-full bg-slate-50/50 dark:bg-slate-950/50">
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
            :disabled="!!getTeacherHomeroomClass(allocForm.teacherId) || !allocForm.teacherId"
          />
        </div>
        <div class="col-span-1 md:col-span-1 flex flex-col gap-1.5">
          <label
            class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">JTM</label>
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-sm text-center font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {{ allocForm.jtm }}
          </div>
        </div>
        <div class="col-span-2 md:col-span-2">
          <AppButton @click="$emit('add')" variant="success"
            class="w-full !py-3.5 !rounded-2xl !bg-emerald-600 dark:!bg-emerald-500 hover:!bg-emerald-700 dark:hover:!bg-emerald-400 !text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 transition-all duration-300 group active:scale-95 disabled:!bg-slate-200 dark:disabled:!bg-slate-800 disabled:!text-slate-400"
            :disabled="!allocForm.teacherId || !allocForm.subjectId || !allocForm.classId || allocForm.jtm <= 0">
            <template #icon-left>
              <Plus :size="20" class="group-hover:rotate-90 transition-transform duration-300" />
            </template>
            <span class="font-black uppercase tracking-widest text-[11px]">Tambah Alokasi</span>
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Allocation List with Filters -->
    <div class="flex-none lg:flex-1 lg:overflow-hidden flex flex-col">
      <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 lg:mb-6 gap-4">
        <div class="flex items-center gap-4 shrink-0">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm overflow-hidden shrink-0">
            <Filter :size="20" class="lg:hidden" />
            <Filter :size="24" class="hidden lg:block" />
          </div>
          <div>
            <h3 class="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">Daftar Alokasi</h3>
            <p class="text-xs font-medium text-slate-500 mt-1">Saring berdasarkan filter</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 w-full xl:flex-row xl:items-center xl:w-auto">
           <!-- Search and Mobile Reset -->
           <div class="flex items-center gap-2 w-full xl:w-80">
             <div class="relative flex-1 group">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" :size="16" />
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
              <div class="flex flex-row items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 xl:flex-none">
                <AppSelect 
                  :modelValue="filterClass"
                  :options="filterClassOptions"
                  size="sm"
                  class="w-28 sm:w-32 !bg-transparent !border-0"
                  @update:modelValue="$emit('update:filterClass', $event)"
                />
                <div class="h-4 w-px bg-slate-100 dark:bg-slate-800 shrink-0"></div>
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
        class="flex-1 lg:overflow-y-auto lg:overflow-x-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-0 lg:pr-2 custom-scrollbar content-start pb-8 pt-4">
        <TransitionGroup enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in absolute">
          <div v-for="a in finalAllocations" :key="a.id"
            class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 lg:p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full relative group overflow-visible hover:z-[10] focus-within:z-[20]">

            <!-- Trash Action (Visible on Hover) -->
            <button @click="confirmRemove(a.id)"
              class="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 text-rose-500 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all z-10 flex items-center justify-center">
              <Trash2 :size="18" />
            </button>

            <!-- ID Badge -->
            <div class="absolute top-8 right-8">
              <span
                class="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">#{{
                  a.id.slice(0, 4) }}</span>
            </div>

            <!-- Class Indicator -->
            <div class="flex items-center gap-3 mb-4 lg:mb-8">
              <div
                class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-800/50">
                <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">{{ a.classId }}</span>
              </div>
              <div>
                <h5
                  class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
                  Target Kelas</h5>
                <p class="text-xs font-bold text-slate-800 dark:text-white">Kelas {{ a.classId }}</p>
              </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 flex flex-col gap-3 lg:gap-6">
              <div class="space-y-1.5">
                <h4
                  class="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest leading-none italic">
                  Mata Pelajaran</h4>
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white leading-tight min-h-[3rem]">
                  {{ getAllocDetails(a.id)?.subjectName || 'Data Tidak Ditemukan' }}
                </h3>
              </div>

              <div class="space-y-1.5">
                <h4
                  class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none italic">
                  Guru Pengampu</h4>
                <p class="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {{ getAllocDetails(a.id)?.teacherName || 'Guru Belum Diatur' }}
                </p>
              </div>
            </div>

            <!-- Duration Footer -->
            <div class="mt-4 lg:mt-8 pt-4 lg:pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span
                  class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Alokasi
                  Waktu</span>
                <div class="flex items-center gap-1.5 mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span class="text-xs font-black text-slate-900 dark:text-white">{{ a.jtm }} Jam / Minggu</span>
                </div>
              </div>
              <div
                class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                <Plus :size="14" class="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500" />
              </div>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="finalAllocations.length === 0" class="col-span-full py-24 text-center opacity-40">
          <div
            class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-50 dark:border-slate-700">
            <Filter :size="32" class="text-slate-300 dark:text-slate-600" />
          </div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Tidak ada alokasi
            yang ditemukan</p>
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
