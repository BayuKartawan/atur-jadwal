<script setup>
import { computed } from 'vue';
import { Download, Users } from 'lucide-vue-next';
import AppButton from '../ui/AppButton.vue';

const props = defineProps({
    classes: Array,
    teachers: Array,
    subjects: Array,
    allocations: Array,
    getUsedJtm: Function
});

const classRecaps = computed(() => {
    return props.classes.map(cls => {
        // Filter allocations for this class
        const classAllocations = props.allocations.filter(a => a.classId === cls);

        // Group by teacher
        const teacherMap = new Map();

        classAllocations.forEach(alloc => {
            if (!teacherMap.has(alloc.teacherId)) {
                const teacher = props.teachers?.find(t => t.id === alloc.teacherId);
                teacherMap.set(alloc.teacherId, {
                    id: alloc.teacherId,
                    name: teacher ? teacher.name : 'Unknown',
                    subjects: [],
                    totalJtm: 0,
                    usedJtm: 0
                });
            }

            const entry = teacherMap.get(alloc.teacherId);
            const subject = props.subjects?.find(s => s.id === alloc.subjectId);
            if (subject && !entry.subjects.includes(subject.name)) {
                entry.subjects.push(subject.name);
            }
            entry.totalJtm += parseInt(alloc.jtm) || 0;
            entry.usedJtm += props.getUsedJtm(alloc.id);
        });

        return {
            name: cls,
            teachers: Array.from(teacherMap.values()).sort((a, b) => b.totalJtm - a.totalJtm)
        };
    });
});

const downloadClassRecap = () => {
    if (!window.XLSX) {
        alert("Excel library not loaded.");
        return;
    }

    const wb = window.XLSX.utils.book_new();

    classRecaps.value.forEach(cls => {
        const headers = ['Nama Guru', 'Mata Pelajaran', 'Total JTM', 'Terisi', 'Persentase'];
        const data = cls.teachers.map(t => {
            const percentage = t.totalJtm > 0 ? Math.round((t.usedJtm / t.totalJtm) * 100) : 0;
            return [t.name, t.subjects.join(', '), t.totalJtm, t.usedJtm, `${percentage}%`];
        });

        const wsData = [headers, ...data];
        const ws = window.XLSX.utils.aoa_to_sheet(wsData);

        // Auto-width
        const colWidths = [{ wch: 30 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
        ws['!cols'] = colWidths;

        // Sheet names can't be too long or contain certain chars. Class names are usually short.
        // Safe check for sheet name length (max 31 chars)
        const sheetName = `Kelas ${cls}`.substring(0, 31);
        window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const now = new Date();
    const date = now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const time = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '.');
    window.XLSX.writeFile(wb, `Rekap_Perkelas_${date}_${time}.xlsx`);
};

</script>

<template>
    <div
        class="p-4 lg:p-8 pt-0 lg:pt-0 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full transition-all duration-300">

            <!-- Header Section -->
            <div
                class="p-4 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 first:rounded-t-2xl lg:first:rounded-t-[2rem]">
                <div class="flex items-center gap-4 lg:gap-6">
                    <div
                        class="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 border border-pink-100/50 dark:border-pink-800/50 shadow-sm shrink-0">
                        <Users :size="24" class="lg:hidden" />
                        <Users :size="32" class="hidden lg:block" />
                    </div>
                    <div>
                        <h3
                            class="text-lg lg:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                            Rekap Per Kelas</h3>
                        <p
                            class="text-[9px] lg:text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1.5 lg:mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-pink-500 animate-pulse"></span>
                            Distribusi Guru
                        </p>
                    </div>
                    <div class="ml-auto">
                        <AppButton @click="downloadClassRecap" variant="primary"
                            class="!rounded-xl !py-2.5 !px-4 shadow-lg shadow-pink-500/20 active:scale-95 transition-all !bg-pink-600 hover:!bg-pink-700">
                            <template #icon-left>
                                <Download :size="16" />
                            </template>
                            <span class="hidden lg:inline text-xs font-bold uppercase tracking-wider">Download
                                Excel</span>
                            <span class="lg:hidden text-xs font-bold uppercase tracking-wider">Excel</span>
                        </AppButton>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div v-for="cls in classRecaps" :key="cls.name"
                        class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <!-- h-full allows it to grow if parent flex allows, but grid layout handles it. Removed fixed height -->

                        <div
                            class="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
                            <h4 class="font-black text-slate-800 dark:text-slate-200 text-lg">KELAS {{ cls.name }}</h4>
                            <span
                                class="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                {{ cls.teachers.length }} Guru
                            </span>
                        </div>

                        <div class="flex-1"> <!-- Removed overflows to show full list -->
                            <table class="w-full text-left text-sm">
                                <thead
                                    class="bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider sticky top-0">
                                    <tr>
                                        <th class="px-3 lg:px-4 py-3">Guru & Mapel</th>
                                        <th class="px-3 lg:px-4 py-3 text-center">JTM</th>
                                        <th class="px-3 lg:px-4 py-3 text-center w-16">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    <tr v-for="teacher in cls.teachers" :key="teacher.id"
                                        class="hover:bg-white dark:hover:bg-slate-700/50 transition-colors">
                                        <td class="px-3 lg:px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                            <div class="line-clamp-1 text-xs lg:text-sm" :title="teacher.name">{{
                                                teacher.name }}
                                            </div>
                                            <div class="mt-1 flex flex-wrap gap-1">
                                                <div class="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md inline-block border border-indigo-100 dark:border-indigo-800/30"
                                                    v-for="subj in teacher.subjects" :key="subj">
                                                    {{ subj }}
                                                </div>
                                            </div>
                                        </td>
                                        <!-- Removed separate Mapel column td -->
                                        <td
                                            class="px-3 lg:px-4 py-3 text-center font-bold text-slate-900 dark:text-slate-100 text-xs lg:text-sm">
                                            {{ teacher.totalJtm }}
                                        </td>
                                        <td class="px-3 lg:px-4 py-3 min-w-[60px]">
                                            <div
                                                class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div class="h-full bg-pink-500"
                                                    :style="{ width: `${Math.min(100, (teacher.usedJtm / teacher.totalJtm) * 100)}%` }">
                                                </div>
                                            </div>
                                            <div class="text-[9px] text-center mt-1 font-medium text-slate-400">
                                                {{ teacher.usedJtm }}/{{ teacher.totalJtm }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="cls.teachers.length === 0">
                                        <td colspan="4" class="px-4 py-8 text-center text-slate-400 italic text-xs">
                                            Belum ada guru di kelas ini
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Summary Footer for Class -->
                        <div
                            class="p-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
                            <div
                                class="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                <span>Total Beban Kelas</span>
                                <span>{{cls.teachers.reduce((sum, t) => sum + t.totalJtm, 0)}} Jam</span>
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
    width: 4px;
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
</style>
