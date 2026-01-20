<script setup>
import { Filter, Trash2, Plus } from 'lucide-vue-next';
import AppCard from '../ui/AppCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppBadge from '../ui/AppBadge.vue';

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

const emit = defineEmits(['update:filterClass', 'update:filterTeacher', 'add', 'remove', 'teacherChange']);
</script>

<template>
  <div class="p-8 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
    <!-- Add Allocation Form -->
    <AppCard class="mb-8">

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div class="md:col-span-4 flex flex-col gap-1.5">
          <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Pilih
            Guru</label>
          <select
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            :value="allocForm.teacherId" @change="$emit('teacherChange', $event.target.value)">
            <option value="">-- Pilih Guru --</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="md:col-span-3 flex flex-col gap-1.5">
          <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mata
            Pelajaran</label>
          <select
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
            v-model="allocForm.subjectId" :disabled="!allocForm.teacherId">
            <option value="">-- Pilih Mapel --</option>
            <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="md:col-span-2 flex flex-col gap-1.5">
          <label
            class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Kelas</label>
          <select
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
            v-model="allocForm.classId"
            :disabled="!!getTeacherHomeroomClass(allocForm.teacherId) || !allocForm.teacherId">
            <option value="">-- Pilih Kelas --</option>
            <option v-for="c in classes" :key="c" :value="c">Kelas {{ c }}</option>
          </select>
        </div>
        <div class="md:col-span-1 flex flex-col gap-1.5">
          <label
            class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">JTM</label>
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-sm text-center font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {{ allocForm.jtm }}
          </div>
        </div>
        <div class="md:col-span-2">
          <AppButton @click="$emit('add')" variant="success"
            class="w-full !py-3.5 !rounded-2xl !bg-emerald-600 dark:!bg-emerald-500 hover:!bg-emerald-700 dark:hover:!bg-emerald-400 !text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 transition-all duration-300 group active:scale-95 disabled:!bg-slate-200 dark:disabled:!bg-slate-800 disabled:!text-slate-400"
            :disabled="!allocForm.teacherId || !allocForm.subjectId || !allocForm.classId">
            <template #icon-left>
              <Plus :size="20" class="group-hover:rotate-90 transition-transform duration-300" />
            </template>
            <span class="font-black uppercase tracking-widest text-[11px]">Tambah Alokasi</span>
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Allocation List with Filters -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm overflow-hidden">
            <Filter :size="24" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Daftar Alokasi</h3>
            <p class="text-xs font-medium text-slate-500 mt-1">Saring berdasarkan filter</p>
          </div>
        </div>

        <div
          class="flex items-center gap-3 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full sm:w-auto transition-colors">
          <select
            class="bg-transparent px-3 py-2 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            :value="filterClass" @change="$emit('update:filterClass', $event.target.value)">
            <option value="all">Semua Kelas</option>
            <option v-for="c in classes" :key="c" :value="c">Kelas {{ c }}</option>
          </select>
          <div class="h-4 w-px bg-slate-100 dark:bg-slate-800"></div>
          <select
            class="bg-transparent px-3 py-2 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            :value="filterTeacher" @change="$emit('update:filterTeacher', $event.target.value)">
            <option value="all">Semua Guru</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto overflow-x-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar content-start pb-8 pt-4">
        <TransitionGroup enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in absolute">
          <div v-for="a in filteredAllocations" :key="a.id"
            class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col min-h-[280px] relative group overflow-visible">

            <!-- Trash Action (Visible on Hover) -->
            <button @click="$emit('remove', a.id)"
              class="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 text-rose-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all z-10 flex items-center justify-center">
              <Trash2 :size="18" />
            </button>

            <!-- ID Badge -->
            <div class="absolute top-8 right-8">
              <span
                class="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">#{{
                  a.id.slice(0, 4) }}</span>
            </div>

            <!-- Class Indicator -->
            <div class="flex items-center gap-3 mb-8">
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
            <div class="flex-1 flex flex-col gap-6">
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
            <div class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
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

        <div v-if="filteredAllocations.length === 0" class="col-span-full py-24 text-center opacity-40">
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
