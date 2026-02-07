<script setup>
import { 
  LayoutDashboard, 
  Lock, 
  Unlock, 
  DatabaseBackup, 
  RefreshCw, 
  Download, 
  Trash2,
  Users,
  BookOpen,
  Calendar,
  Layers
} from "lucide-vue-next";
import AppCard from "../components/ui/AppCard.vue";
import AppButton from "../components/ui/AppButton.vue";
import { useLockSystem } from "../composables/useLockSystem";
import { ref } from "vue";
import LockModal from "../components/common/LockModal.vue";
import AppModal from "../components/common/AppModal.vue";

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  allocations: Array,
});

const emit = defineEmits([
  "backup",
  "restore",
  "export",
  "notify",
]);

const { isLocked, lockApp, unlockApp } = useLockSystem();
const showLockModal = ref(false);
const lockValidationError = ref("");
const showClearConfirm = ref(false);

const handleLockClick = () => {
  lockValidationError.value = "";
  showLockModal.value = true;
};

const handleLockConfirm = async (password) => {
  if (isLocked.value) {
    const success = await unlockApp(password);
    if (!success) {
      lockValidationError.value = "Password salah!";
    } else {
      showLockModal.value = false;
      emit("notify", "Aplikasi berhasil dibuka.");
    }
  } else {
    await lockApp(password);
    showLockModal.value = false;
  }
};

const handleClearData = () => {
  showClearConfirm.value = true;
};

const confirmClearData = () => {
  const content = localStorage.getItem('theme');
  localStorage.clear();
  if(content) localStorage.setItem('theme', content);
  showClearConfirm.value = false;
  window.location.reload();
};

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
        <h1 class="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Selamat Datang, Admin
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Kelola jadwal sekolah Anda dengan efisien dan cerdas.
        </p>
      </div>
      <div class="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div 
          :class="isLocked ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <div class="w-2 h-2 rounded-full animate-pulse" :class="isLocked ? 'bg-rose-500' : 'bg-emerald-500'"></div>
          System {{ isLocked ? 'Locked' : 'Active' }}
        </div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div class="flex items-center gap-4">
          <div :class="[stat.bg, stat.color]" class="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
            <component :is="stat.icon" :size="24" />
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{{ stat.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions & Controls Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- System Controls Card -->
      <AppCard class="lg:col-span-2" bodyClass="!p-6 lg:!p-8">
        <template #header>
          <div class="flex items-center gap-3">
             <div class="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                <LayoutDashboard :size="20" stroke-width="2.5" />
             </div>
             <h3 class="text-lg font-bold text-slate-900 dark:text-white">Kontrol Sistem</h3>
          </div>
        </template>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Security -->
          <div class="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between group">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">Keamanan Aplikasi</h4>
              <p class="text-xs text-slate-500 mt-1 font-medium">Batasi akses edit data dengan password sistem.</p>
            </div>
            <AppButton 
              @click="handleLockClick"
              :variant="isLocked ? 'danger' : 'secondary'"
              class="mt-6 !rounded-2xl w-full justify-between group-hover:shadow-lg transition-all"
            >
              <span>{{ isLocked ? 'Buka Kunci' : 'Kunci Sistem' }}</span>
              <template #icon-right>
                <Lock v-if="isLocked" :size="18" />
                <Unlock v-else :size="18" />
              </template>
            </AppButton>
          </div>

          <!-- Data Backup -->
          <div class="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between group">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">Cadangkan Data</h4>
              <p class="text-xs text-slate-500 mt-1 font-medium">Unduh file backup untuk mengamankan data Anda.</p>
            </div>
            <div class="flex gap-2 mt-6">
              <AppButton 
                @click="$emit('backup')"
                variant="primary"
                class="flex-1 !rounded-2xl !bg-indigo-600 hover:!bg-indigo-700 shadow-indigo-200 dark:shadow-none"
              >
                <template #icon-left><DatabaseBackup :size="18" /></template>
                <span>Backup</span>
              </AppButton>
              <AppButton 
                @click="$emit('restore')"
                variant="secondary"
                class="!rounded-2xl !p-3"
                title="Restore Data"
              >
                <RefreshCw :size="18" />
              </AppButton>
            </div>
          </div>

          <!-- Export Excel -->
          <div class="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between sm:col-span-2 group">
             <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="max-w-md">
                   <h4 class="font-bold text-slate-900 dark:text-white">Ekspor Laporan Lengkap</h4>
                   <p class="text-xs text-slate-500 mt-1 font-medium">Dapatkan semua data (Guru, Mapel, Kelas, JTM, dan Jadwal) dalam satu file Excel profesional.</p>
                </div>
                <AppButton 
                  @click="$emit('export')"
                  variant="primary"
                  size="lg"
                  class="!rounded-2xl !bg-indigo-600 hover:!bg-indigo-700 shadow-indigo-200 dark:shadow-none shrink-0"
                >
                  <template #icon-left><Download :size="20" /></template>
                  <span>Unduh File Excel (.xlsx)</span>
                </AppButton>
             </div>
          </div>
        </div>
      </AppCard>

      <!-- Risk Zone Card -->
      <AppCard class="h-full" bodyClass="!p-6 lg:!p-8">
         <template #header>
            <div class="flex items-center gap-3">
               <div class="bg-rose-50 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
                  <Trash2 :size="20" stroke-width="2.5" />
               </div>
               <h3 class="text-lg font-bold text-slate-900 dark:text-white">Area Berbahaya</h3>
            </div>
         </template>

         <div class="space-y-6">
            <div class="p-5 rounded-3xl border-2 border-dashed border-rose-100 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10">
               <p class="text-xs text-rose-700 dark:text-rose-400 font-bold mb-4 flex items-center gap-2">
                  <Trash2 :size="14" /> PERINGATAN:
               </p>
               <p class="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Menghapus data akan membersihkan semua pengaturan guru, mapel, kelas, dan jadwal yang telah Anda buat secara permanen.
               </p>
               <AppButton 
                  @click="handleClearData"
                  variant="danger"
                  class="mt-6 !w-full !rounded-2xl border-none !bg-rose-500 hover:!bg-rose-600 text-white shadow-rose-200 dark:shadow-none"
                  :disabled="isLocked"
               >
                  Hapus Seluruh Data
               </AppButton>
            </div>
            
            <p class="text-[10px] text-slate-400 text-center font-medium">
               Pastikan Anda telah melakukan backup sebelum melakukan penghapusan data masal.
            </p>
         </div>
      </AppCard>
    </div>

    <!-- Modals -->
    <AppModal
      :show="showClearConfirm"
      title="Hapus Semua Data"
      message="Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan dan semua jadwal Anda akan hilang."
      confirm-text="Ya, Hapus Semua"
      cancel-text="Batal"
      variant="danger"
      @confirm="confirmClearData"
      @cancel="showClearConfirm = false"
    />

    <LockModal
      v-model:show="showLockModal"
      :is-locked="isLocked"
      :validation-error="lockValidationError"
      @confirm="handleLockConfirm"
    />
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
