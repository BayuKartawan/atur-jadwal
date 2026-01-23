<script setup>
import { ref, computed } from "vue";
import {
  User,
  Calendar,
  Download,
  Printer,
  X as CloseIcon,
} from "lucide-vue-next";
import AppButton from "../components/ui/AppButton.vue";
import AppSelect from "../components/ui/AppSelect.vue";

const props = defineProps({
  teachers: Array,
  classes: Array,
  DAYS: Array,
  PERIOD_TIMES: Array,
  getSlot: Function,
  getAllocDetails: Function,
  allocations: Array,
  schoolName: {
    type: String,
    default: "MI NW PENYENGGIR",
  },
});

const selectedTeacherId = ref("");
const showPrintPreview = ref(false);

const togglePrintPreview = () => {
  showPrintPreview.value = !showPrintPreview.value;
};

const handlePrint = () => {
  window.print();
};

const teacherOptions = computed(() => {
  return props.teachers.map((t) => ({
    label: t.name,
    value: t.id,
  }));
});

const selectedTeacher = computed(() => {
  return props.teachers.find((t) => t.id === selectedTeacherId.value);
});

// Build the schedule for the selected teacher
const teacherSchedule = computed(() => {
  if (!selectedTeacherId.value) return null;

  const schedule = [];

  props.DAYS.forEach((day, dayIdx) => {
    const daySchedule = {
      day: day,
      periods: [],
    };

    props.PERIOD_TIMES.forEach((timeData, periodIdx) => {
      let foundAlloc = null;
      let foundClass = null;

      const timeStr = typeof timeData === "object" ? timeData.time : timeData;
      const isBreak = typeof timeData === "object" && timeData.isBreak;

      // Check all classes to see if this teacher is teaching
      for (const classId of props.classes) {
        const allocId = props.getSlot(dayIdx, periodIdx, classId);
        if (allocId) {
          const details = props.getAllocDetails(allocId);
          if (details && details.teacherId === selectedTeacherId.value) {
            foundAlloc = details;
            foundClass = classId;
            break; // Teacher can only be in one class at a time (ideally)
          }
        }
      }

      daySchedule.periods.push({
        time: timeStr,
        alloc: foundAlloc,
        classId: foundClass,
        isBreak: isBreak,
      });
    });
    schedule.push(daySchedule);
  });

  return schedule;
});

const tableRows = computed(() => {
  if (!props.PERIOD_TIMES) return [];
  return props.PERIOD_TIMES.map((timeData, pIdx) => {
    const timeStr = typeof timeData === "object" ? timeData.time : timeData;
    const isBreak = typeof timeData === "object" && timeData.isBreak;

    const row = {
      time: timeStr,
      isBreak: isBreak,
      cells: props.DAYS.map((_, dIdx) => {
        let foundAlloc = null;
        let foundClass = null;

        // Check all classes to see if this teacher is teaching
        for (const classId of props.classes) {
          const allocId = props.getSlot(dIdx, pIdx, classId);
          if (allocId) {
            const details = props.getAllocDetails(allocId);
            if (details && details.teacherId === selectedTeacherId.value) {
              foundAlloc = details;
              foundClass = classId;
              break;
            }
          }
        }
        return {
          alloc: foundAlloc,
          classId: foundClass,
        };
      }),
    };
    return row;
  });
});

const downloadTeacherSchedule = () => {
  if (!selectedTeacherId.value || !window.XLSX) return;

  const wb = window.XLSX.utils.book_new();
  const wsData = [
    ["JADWAL MENGAJAR"],
    ["Nama Guru", selectedTeacher.value.name],
    [""],
    ["HARI", "WAKTU", "KELAS", "MATA PELAJARAN"],
  ];

  teacherSchedule.value.forEach((day) => {
    day.periods.forEach((p) => {
      // Skip breaks if you want, or include them
      if (p.isBreak) {
        wsData.push([day.day, p.time, "ISTIRAHAT", "-"]);
      } else if (p.alloc) {
        wsData.push([
          day.day,
          p.time,
          `Kelas ${p.classId}`,
          p.alloc.subjectName,
        ]);
      } else {
        wsData.push([day.day, p.time, "-", "-"]);
      }
    });
  });

  const ws = window.XLSX.utils.aoa_to_sheet(wsData);

  // Styling widths
  const colWidths = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 40 }];
  ws["!cols"] = colWidths;

  window.XLSX.utils.book_append_sheet(wb, ws, "Jadwal Guru");

  // Clean teacher name for filename
  const safeName = selectedTeacher.value.name.replace(/[^a-zA-Z0-9]/g, "_");
  window.XLSX.writeFile(wb, `Jadwal_${safeName}.xlsx`);
};
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
    <!-- Header Section -->
    <header
      class="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      <div
        class="px-4 py-2 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <!-- Title & Icon Group -->
        <div class="flex items-center gap-3 lg:gap-6">
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <Calendar :size="20" class="lg:hidden" />
            <Calendar :size="32" class="hidden lg:block" />
          </div>
          <div>
            <h3
              class="text-base lg:text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight"
            >
              Rekap Jadwal Guru
            </h3>
            <p
              class="text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 lg:mt-2 uppercase tracking-[0.2em] flex items-center gap-1.5 focus-within:"
            >
              <span
                class="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-cyan-500 animate-pulse"
              ></span>
              Detail Jadwal Mapel
            </p>
          </div>
        </div>

        <!-- Controls Group -->
        <div class="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
          <div class="flex-1 sm:w-72">
            <AppSelect
              v-model="selectedTeacherId"
              :options="teacherOptions"
              placeholder="Pilih Nama Guru..."
              searchPlaceholder="Cari tenaga pendidik..."
              class="!w-full"
            />
          </div>

          <AppButton
            @click="togglePrintPreview"
            :disabled="!selectedTeacherId"
            variant="primary"
            class="!rounded-xl !py-2.5 !h-[42px] lg:!h-auto !px-4 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all !bg-cyan-600 hover:!bg-cyan-700 disabled:shadow-none disabled:!bg-slate-100 dark:disabled:!bg-slate-800 disabled:!text-slate-400 shrink-0"
          >
            <template #icon-left>
              <Printer :size="16" />
            </template>
            <span
              class="hidden md:inline text-[10px] font-black uppercase tracking-widest"
              >Cetak</span
            >
          </AppButton>

          <AppButton
            @click="downloadTeacherSchedule"
            :disabled="!selectedTeacherId"
            variant="primary"
            class="!rounded-xl !py-2.5 !h-[42px] lg:!h-auto !px-4 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all !bg-cyan-600 hover:!bg-cyan-700 disabled:shadow-none disabled:!bg-slate-100 dark:disabled:!bg-slate-800 disabled:!text-slate-400 shrink-0"
          >
            <template #icon-left>
              <Download :size="16" />
            </template>
            <span
              class="hidden md:inline text-[10px] font-black uppercase tracking-widest"
              >Unduh</span
            >
          </AppButton>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 overflow-auto custom-scrollbar p-4 lg:p-8">
      <!-- Empty State -->
      <div
        v-if="!selectedTeacherId"
        class="h-full flex flex-col items-center justify-center opacity-40"
      >
        <div
          class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 animate-float"
        >
          <User :size="48" class="text-slate-300 dark:text-slate-600" />
        </div>
        <p
          class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
        >
          Silakan pilih guru terlebih dahulu
        </p>
      </div>

      <!-- Schedule Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="(day, idx) in teacherSchedule"
          :key="idx"
          class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
        >
          <div
            class="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0"
          >
            <h4
              class="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm"
            >
              {{ day.day }}
            </h4>
            <span
              class="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400"
            >
              {{ day.periods.filter((p) => p.alloc && !p.isBreak).length }} JP
            </span>
          </div>

          <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <div
              v-for="(period, pIdx) in day.periods"
              :key="pIdx"
              class="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div
                class="w-12 shrink-0 py-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider"
              >
                {{ period.time ? period.time.split(" - ")[0] : "-" }}
                <span class="opacity-50 text-[8px]">s/d</span>
                {{
                  period.time && period.time.includes(" - ")
                    ? period.time.split(" - ")[1]
                    : "-"
                }}
              </div>

              <div class="flex-1 min-w-0">
                <div v-if="period.isBreak" class="h-full flex items-center">
                  <span
                    class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                  >
                    Istirahat
                  </span>
                </div>
                <div v-else-if="period.alloc">
                  <div
                    class="font-bold text-slate-800 dark:text-slate-200 text-xs truncate"
                    :title="period.alloc.subjectName"
                  >
                    {{ period.alloc.subjectName }}
                  </div>
                  <div class="mt-1 flex items-center gap-2">
                    <span
                      class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50"
                    >
                      KELAS {{ period.classId }}
                    </span>
                  </div>
                </div>
                <div v-else class="h-full flex items-center">
                  <span
                    class="text-[10px] uppercase font-bold text-slate-300 dark:text-slate-700 italic tracking-wider"
                  >
                    Kosong
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Preview Overlay -->
    <div
      v-if="showPrintPreview"
      class="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-300"
    >
      <!-- Toolbar -->
      <div
        class="h-16 border-b border-white/10 bg-slate-900 px-6 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-4">
          <Printer class="text-cyan-400" :size="20" />
          <h2 class="text-white font-black uppercase text-xs tracking-widest">
            Pratinjau Cetak (Ukuran F4)
          </h2>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="handlePrint"
            class="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            Cetak Sekarang
          </button>
          <button
            @click="togglePrintPreview"
            class="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <CloseIcon :size="24" />
          </button>
        </div>
      </div>

      <!-- Preview Area -->
      <div
        class="flex-1 overflow-auto p-8 flex justify-center bg-slate-800/50 print:bg-white print:p-0"
      >
        <!-- F4 Paper Canvas Simulation -->
        <div
          id="print-area"
          class="bg-white text-black p-[2.5cm] shadow-2xl origin-top transition-transform duration-500 print:shadow-none print:p-0"
          style="width: 210mm; min-height: 330mm"
        >
          <!-- Paper Content -->
          <div class="text-center mb-8 border-b-2 border-black pb-4">
            <h1 class="text-sm font-black uppercase mb-1">{{ schoolName }}</h1>
            <h2 class="text-lg font-black uppercase tracking-widest mb-1">
              JADWAL MENGAJAR GURU
            </h2>
            <p class="text-[10px] font-bold uppercase italic">
              Tahun Pelajaran 2025/2026
            </p>
          </div>

          <div class="flex justify-between items-end mb-4 px-2">
            <div class="text-[10px] font-black uppercase">
              Nama Guru:
              <span class="border-b border-black ml-1 pr-8">{{
                selectedTeacher?.name
              }}</span>
            </div>
            <div class="text-[8px] italic">
              Dicetak pada: {{ new Date().toLocaleDateString("id-ID") }}
            </div>
          </div>

          <table
            class="w-full border-collapse border-2 border-black text-[9px]"
          >
            <thead>
              <tr class="bg-slate-100 print:bg-slate-50">
                <th class="border-2 border-black py-3 px-1 w-20 font-black">
                  WAKTU
                </th>
                <th
                  v-for="day in DAYS"
                  :key="day"
                  class="border-2 border-black py-3 px-1 font-black"
                >
                  {{ day.toUpperCase() }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rIdx) in tableRows" :key="rIdx">
                <!-- Time Column -->
                <td
                  class="border-2 border-black p-2 text-center font-black bg-slate-50/50"
                >
                  {{ row.time.replace(" - ", "\n") }}
                </td>

                <!-- Day Columns -->
                <template v-for="(cell, cIdx) in row.cells" :key="cIdx">
                  <td
                    v-if="row.isBreak"
                    :class="[cIdx === 0 ? '' : 'hidden']"
                    :colspan="DAYS.length"
                    class="border-2 border-black p-2 text-center font-black italic bg-amber-50 uppercase tracking-[0.5em]"
                  >
                    ISTIRAHAT
                  </td>
                  <td
                    v-else
                    class="border-2 border-black p-1 text-center align-middle h-20"
                  >
                    <div
                      v-if="cell.alloc"
                      class="flex flex-col h-full justify-between gap-1 py-1"
                    >
                      <div
                        class="font-black leading-tight uppercase line-clamp-2"
                      >
                        {{ cell.alloc.subjectName }}
                      </div>
                      <div
                        class="text-[8px] font-black border-t border-black/10 pt-1 mt-auto"
                      >
                        KELAS {{ cell.classId }}
                      </div>
                    </div>
                    <div
                      v-else
                      class="text-[8px] text-slate-300 italic font-bold"
                    >
                      -
                    </div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>

          <!-- Footer / Digital Signature Space -->
          <div class="mt-12 grid grid-cols-2 gap-8 text-[10px] px-8">
            <div class="text-center">
              <p>Mengetahui,</p>
              <p class="mb-16">Kepala Madrasah</p>
              <p class="font-black underline">
                ..........................................
              </p>
              <p>NIP. .................................</p>
            </div>
            <div class="text-center">
              <p>
                Purwokerto,
                {{
                  new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                }}
              </p>
              <p class="mb-16">Waka Kurikulum</p>
              <p class="font-black underline">
                ..........................................
              </p>
              <p>NIP. .................................</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: 210mm 330mm;
    margin: 0;
  }
  body * {
    visibility: hidden;
  }
  #print-area,
  #print-area * {
    visibility: visible;
  }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm !important;
    height: 330mm !important;
    padding: 2cm !important;
    margin: 0 !important;
    box-shadow: none !important;
  }
  .no-print {
    display: none !important;
  }

  /* Force background colors for printing */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
