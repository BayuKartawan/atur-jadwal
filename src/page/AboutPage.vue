<script setup>
import { 
  Info, User, HelpCircle, Cpu, 
  CheckCircle2, Code2, Database, Layers, 
  ExternalLink, Github, Mail, Globe, PlayCircle 
} from 'lucide-vue-next';
import AppCard from '../components/ui/AppCard.vue';
import AppBadge from '../components/ui/AppBadge.vue';

const techStack = [
  { name: 'Vue.js 3', desc: 'Framework JavaScript progresif untuk membangun antarmuka pengguna.', icon: Code2, color: 'text-emerald-500' },
  { name: 'Vite', desc: 'Build tool generasi berikutnya yang sangat cepat.', icon: Cpu, color: 'text-amber-500' },
  { name: 'Tailwind CSS', desc: 'Framework CSS utility-first untuk desain cepat.', icon: Layers, color: 'text-sky-500' },
  { name: 'Lucide Icons', desc: 'Set ikon vektor yang cantik dan konsisten.', icon: Info, color: 'text-indigo-500' },
  { name: 'LocalStorage', desc: 'Penyimpanan data lokal di browser (Client-side).', icon: Database, color: 'text-rose-500' },
  { name: 'SheetJS (XLSX)', desc: 'Pustaka untuk mengolah file spreadsheet Excel.', icon: ExternalLink, color: 'text-green-600' }
];

const steps = [
  { title: 'Input Data Master', desc: 'Masukkan daftar Guru dan Mata Pelajaran yang tersedia di sekolah.' },
  { title: 'Atur Kurikulum', desc: 'Tentukan jumlah Jam Tatap Muka (JTM) untuk setiap mata pelajaran di setiap kelas.' },
  { title: 'Mapping Wali Kelas', desc: 'Tentukan guru yang bertugas sebagai wali kelas untuk masing-masing kelas.' },
  { title: 'Alokasi Tugas', desc: 'Pasangkan guru dengan mata pelajaran dan kelas yang diampu.' },
  { title: 'Susun Jadwal', desc: 'Gunakan fitur Auto-Schedule untuk menyusun jadwal secara otomatis atau Drag-and-Drop secara manual.' }
];
</script>

<template>
  <div class="h-full overflow-y-auto bg-slate-50/30 dark:bg-slate-950/30 p-4 md:p-8 custom-scrollbar">
    <div class="max-w-5xl mx-auto space-y-12 pb-20">
      
      <!-- Header Section -->
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
          <Info :size="14" />
          Tentang Aplikasi
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Smart <span class="text-indigo-600 dark:text-indigo-400 italic">Schedule</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Sistem manajemen jadwal pelajaran cerdas yang dirancang untuk memudahkan penyusunan jadwal sekolah dengan algoritma otomasi dan antarmuka yang intuitif.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Pembuat Section -->
        <div class="lg:col-span-1 space-y-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <User :size="20" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Pembuat Aplikasi</h2>
          </div>
          
          <AppCard class="p-6 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
            
            <div class="flex flex-col items-center text-center space-y-4">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg shadow-indigo-500/20">
                <div class="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl uppercase">
                  <img src="/logo.png" alt="" class="rounded-xl w-full h-full">
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">BayuGo Go</h3>
                <p class="text-sm text-slate-500 dark:text-slate-500 font-medium">Pemecut AI Handal</p>
              </div>
              
              <div class="flex gap-2 w-full pt-4">
                <a href="#" class="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-500 hover:text-white transition-all flex justify-center">
                  <Github :size="18" />
                </a>
                <a href="#" class="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-all flex justify-center">
                  <Mail :size="18" />
                </a>
                <a href="#" class="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-blue-500 hover:text-white transition-all flex justify-center">
                  <Globe :size="18" />
                </a>
              </div>
            </div>
          </AppCard>

          <div class="p-6 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
             <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
               "Dibuat dengan semangat untuk membantu meningkatkan efisiensi administrasi sekolah melalui teknologi yang sederhana namun bertenaga."
             </p>
          </div>
        </div>

        <!-- Cara Penggunaan -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HelpCircle :size="20" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Cara Penggunaan</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppCard v-for="(step, idx) in steps" :key="idx" class="p-5 flex gap-4 items-start hover:border-indigo-500/30 transition-all">
              <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                {{ idx + 1 }}
              </div>
              <div class="space-y-1">
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">{{ step.title }}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.desc }}</p>
              </div>
            </AppCard>
          </div>
        </div>

      </div>

      <!-- Video Tutorial Section -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <PlayCircle :size="20" />
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Video Tutorial</h2>
        </div>

        <AppCard class="p-0 overflow-hidden">
          <div class="aspect-video w-full bg-slate-900">
            <iframe 
              class="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
              title="Tutorial Smart Schedule" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen
            ></iframe>
          </div>
          <div class="p-6 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Panduan Lengkap Penggunaan Smart Schedule</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Tonton video tutorial ini untuk memahami cara menggunakan aplikasi Smart Schedule secara lengkap, mulai dari input data master hingga penyusunan jadwal otomatis.
            </p>
          </div>
        </AppCard>
      </div>

      <!-- Teknologi Section -->
      <div class="space-y-8">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Cpu :size="20" />
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Teknologi & Database</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tech in techStack" :key="tech.name" 
               class="group p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
            <div :class="[tech.color, 'p-3 rounded-2xl bg-current/10 w-fit mb-4 group-hover:scale-110 transition-transform']">
              <component :is="tech.icon" :size="24" />
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">{{ tech.name }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ tech.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- Version Info -->
      <div class="flex flex-col items-center pt-8 border-t border-slate-200 dark:border-white/5 gap-4">
        <div class="flex items-center gap-2">
          <AppBadge variant="secondary">Version 1.0.0</AppBadge>
          <AppBadge variant="success">Stable Build</AppBadge>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-600 font-medium">
          &copy; 2026 Smart Schedule App. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}
</style>
