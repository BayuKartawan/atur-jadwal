<script setup>
import { ref, computed } from 'vue';
import { User, Calendar, Download } from 'lucide-vue-next';
import AppButton from '../components/ui/AppButton.vue';
import AppSelect from '../components/ui/AppSelect.vue';

const props = defineProps({
    teachers: Array,
    classes: Array,
    DAYS: Array,
    PERIOD_TIMES: Array,
    getSlot: Function,
    getAllocDetails: Function,
    allocations: Array,
});

const selectedTeacherId = ref('');

const teacherOptions = computed(() => {
    return props.teachers.map(t => ({
        label: t.name,
        value: t.id
    }));
});

const selectedTeacher = computed(() => {
    return props.teachers.find(t => t.id === selectedTeacherId.value);
});

// Build the schedule for the selected teacher
const teacherSchedule = computed(() => {
    if (!selectedTeacherId.value) return null;

    const schedule = [];

    props.DAYS.forEach((day, dayIdx) => {
        const daySchedule = {
            day: day,
            periods: []
        };

        props.PERIOD_TIMES.forEach((timeData, periodIdx) => {
            let foundAlloc = null;
            let foundClass = null;

            const timeStr = typeof timeData === 'object' ? timeData.time : timeData;
            const isBreak = typeof timeData === 'object' && timeData.isBreak;

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
                isBreak: isBreak
            });
        });
        schedule.push(daySchedule);
    });

    return schedule;
});

const downloadTeacherSchedule = () => {
    if (!selectedTeacherId.value || !window.XLSX) return;

    const wb = window.XLSX.utils.book_new();
    const wsData = [
        ['JADWAL MENGAJAR'],
        ['Nama Guru', selectedTeacher.value.name],
        [''],
        ['HARI', 'WAKTU', 'KELAS', 'MATA PELAJARAN']
    ];

    teacherSchedule.value.forEach(day => {
        day.periods.forEach(p => {
            // Skip breaks if you want, or include them
            if (p.isBreak) {
                wsData.push([day.day, p.time, 'ISTIRAHAT', '-']);
            } else if (p.alloc) {
                wsData.push([day.day, p.time, `Kelas ${p.classId}`, p.alloc.subjectName]);
            } else {
                wsData.push([day.day, p.time, '-', '-']);
            }
        });
    });

    const ws = window.XLSX.utils.aoa_to_sheet(wsData);

    // Styling widths
    const colWidths = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 40 }];
    ws['!cols'] = colWidths;

    window.XLSX.utils.book_append_sheet(wb, ws, "Jadwal Guru");

    // Clean teacher name for filename
    const safeName = selectedTeacher.value.name.replace(/[^a-zA-Z0-9]/g, '_');
    window.XLSX.writeFile(wb, `Jadwal_${safeName}.xlsx`);
};

</script>

<template>
    <div class="h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50">

        <!-- Header Section -->
        <header
            class="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div class="px-4 py-2 lg:px-8  flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                <!-- Title & Icon Group -->
                <div class="flex items-center gap-3 lg:gap-6">
                    <div
                        class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
                        <Calendar :size="20" class="lg:hidden" />
                        <Calendar :size="32" class="hidden lg:block" />
                    </div>
                    <div>
                        <h3
                            class="text-base lg:text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                            Rekap Jadwal Guru
                        </h3>
                        <p
                            class="text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 lg:mt-2 uppercase tracking-[0.2em] flex items-center gap-1.5 focus-within:">
                            <span class="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            Detail Jadwal Mapel
                        </p>
                    </div>
                </div>

                <!-- Controls Group -->
                <div class="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
                    <div class="flex-1 sm:w-72">
                        <AppSelect v-model="selectedTeacherId" :options="teacherOptions"
                            placeholder="Pilih Nama Guru..." searchPlaceholder="Cari tenaga pendidik..."
                            class="!w-full" />
                    </div>

                    <AppButton @click="downloadTeacherSchedule" :disabled="!selectedTeacherId" variant="primary"
                        class="!rounded-xl !py-2.5 !h-[42px] lg:!h-auto !px-4 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all !bg-cyan-600 hover:!bg-cyan-700 disabled:shadow-none disabled:!bg-slate-100 dark:disabled:!bg-slate-800 disabled:!text-slate-400 shrink-0">
                        <template #icon-left>
                            <Download :size="16" />
                        </template>
                        <span class="hidden md:inline text-[10px] font-black uppercase tracking-widest">Unduh</span>
                    </AppButton>
                </div>

            </div>
        </header>

        <!-- Content -->
        <div class="flex-1 overflow-auto custom-scrollbar p-4 lg:p-8">

            <!-- Empty State -->
            <div v-if="!selectedTeacherId" class="h-full flex flex-col items-center justify-center opacity-40">
                <div
                    class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 animate-float">
                    <User :size="48" class="text-slate-300 dark:text-slate-600" />
                </div>
                <p class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Silakan
                    pilih
                    guru terlebih dahulu</p>
            </div>

            <!-- Schedule Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="(day, idx) in teacherSchedule" :key="idx"
                    class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">

                    <div
                        class="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                        <h4 class="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm">{{
                            day.day }}
                        </h4>
                        <span
                            class="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {{day.periods.filter(p => p.alloc && !p.isBreak).length}} JP
                        </span>
                    </div>

                    <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        <div v-for="(period, pIdx) in day.periods" :key="pIdx"
                            class="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">

                            <div
                                class="w-12 shrink-0 py-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                                {{ period.time ? period.time.split(' - ')[0] : '-' }}
                                <span class="opacity-50 text-[8px]">s/d</span>
                                {{ period.time && period.time.includes(' - ') ? period.time.split(' - ')[1] : '-' }}
                            </div>

                            <div class="flex-1 min-w-0">
                                <div v-if="period.isBreak" class="h-full flex items-center">
                                    <span
                                        class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                        Istirahat
                                    </span>
                                </div>
                                <div v-else-if="period.alloc">
                                    <div class="font-bold text-slate-800 dark:text-slate-200 text-xs truncate"
                                        :title="period.alloc.subjectName">
                                        {{ period.alloc.subjectName }}
                                    </div>
                                    <div class="mt-1 flex items-center gap-2">
                                        <span
                                            class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50">
                                            KELAS {{ period.classId }}
                                        </span>
                                    </div>
                                </div>
                                <div v-else class="h-full flex items-center">
                                    <span
                                        class="text-[10px] uppercase font-bold text-slate-300 dark:text-slate-700 italic tracking-wider">
                                        Kosong
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
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
