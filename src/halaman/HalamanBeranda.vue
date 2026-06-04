<script setup>
import { 
  Users,
  BookOpen,
  Calendar,
  Layers
} from "lucide-vue-next";

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  allocations: Array,
});

const stats = [
  { label: 'Total Guru', value: props.teachers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Mata Pelajaran', value: props.subjects.length, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Total Kelas', value: props.classes.length, icon: Layers, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Alokasi Jam', value: props.allocations.length, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
];

</script>

<template>
  <div class="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Selamat Datang, Admin
        </h1>
        <p class="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Kelola jadwal sekolah Anda dengan efisien dan cerdas.
        </p>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:shadow-md group"
      >
        <div class="flex items-center gap-4">
          <div :class="[stat.bg, stat.color]" class="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110">
            <component :is="stat.icon" :size="24" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
            <h3 class="text-2xl font-semibold text-slate-900 dark:text-white mt-0.5">{{ stat.value }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
