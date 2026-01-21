<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { X } from 'lucide-vue-next';

// Components
import AppModal from '../components/common/AppModal.vue';
import AppNotification from '../components/common/AppNotification.vue';
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';

// --- CONSTANTS ---
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PERIOD_TIMES = [
  '07:15 - 07:45', '07:45 - 08:15', '08:15 - 08:45', '08:45 - 09:15',
  '10:00 - 10:30', '10:30 - 11:00', '11:20 - 11:50', '11:50 - 12:20'
];

const DEFAULT_CLASSES = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

const DUMMY_TEACHERS = [
  "Hj. NUR HASANAH, S.Pd.I.", "Hj. MUHIBBAH, S.Ag.", "NURHAYATI, S.Pd.",
  "ERPAHARDIANA, S.Pd.", "HERMA NURHIDAYATI NINGSIH, S.Pd.", "LAILA FITRIA HUDIANA, S.Pd.",
  "MURNIATI, S.Pd.I.", "MUSTIKA SARI, S.Pd.", "RUSNAH, S.Pd.I.",
  "SRI SUSILA ANGGRAINI, S.Pd.I.", "M. IMROM. S.Pd."
];

const DUMMY_SUBJECTS = [
  { name: "Al-Qur'an Hadis", type: "agama" },
  { name: "Akidah Akhlak", type: "agama" },
  { name: "Fikih", type: "agama" },
  { name: "SKI", type: "agama" },
  { name: "Pendidikan Pancasila", type: "umum" },
  { name: "Bahasa Indonesia", type: "umum" },
  { name: "Matematika", type: "umum" },
  { name: "IPAS", type: "umum" },
  { name: "PJOK", type: "umum" },
  { name: "Seni Musik", type: "umum" },
  { name: "Seni Rupa", type: "umum" },
  { name: "Bahasa Inggris", type: "umum" },
  { name: "Bahasa Arab", type: "agama" }
];

// --- STATE ---
const teachers = ref([]);
const subjects = ref([]);
const classes = ref(DEFAULT_CLASSES);
const allocations = ref([]);
const schedule = ref({});
const disabledSlots = ref({});
const homerooms = ref({});
const curriculum = ref({});

const allocForm = reactive({ teacherId: '', subjectId: '', classId: '', jtm: 0 });
const selectedAllocation = ref(null);
const filterClass = ref('all');
const filterTeacher = ref('all');

const fileInputRef = ref(null);
const restoreInputRef = ref(null);

const taskClassFilter = ref('all');
const taskSearchQuery = ref('');
const isGenerating = ref(false);

const modal = ref(null);
const notification = ref(null);
const isSidebarOpen = ref(window.innerWidth >= 1024);
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;
const isDisableMode = ref(false);

// --- HELPERS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const showNotification = (msg, type = 'success') => {
  notification.value = { msg, type };
  setTimeout(() => { notification.value = null; }, 3000);
};

// --- PERSISTENCE ---
onMounted(() => {
  const loadedTeachers = JSON.parse(localStorage.getItem('mi_teachers'));
  const loadedSubjects = JSON.parse(localStorage.getItem('mi_subjects'));
  const loadedClasses = JSON.parse(localStorage.getItem('mi_classes'));
  const loadedAllocations = JSON.parse(localStorage.getItem('mi_allocations')) || [];
  const loadedSchedule = JSON.parse(localStorage.getItem('mi_schedule')) || {};
  const loadedDisabledSlots = JSON.parse(localStorage.getItem('mi_disabled_slots')) || {};
  const loadedHomerooms = JSON.parse(localStorage.getItem('mi_homerooms')) || {};
  const loadedCurriculum = JSON.parse(localStorage.getItem('mi_curriculum')) || {};

  teachers.value = (!loadedTeachers || loadedTeachers.length === 0)
    ? DUMMY_TEACHERS.map(name => ({ id: generateId(), name }))
    : loadedTeachers;

  subjects.value = (!loadedSubjects || loadedSubjects.length === 0)
    ? DUMMY_SUBJECTS.map(s => ({ id: generateId(), ...s }))
    : loadedSubjects;

  classes.value = (!loadedClasses || loadedClasses.length === 0) ? DEFAULT_CLASSES : loadedClasses;
  allocations.value = loadedAllocations;
  schedule.value = loadedSchedule;
  disabledSlots.value = loadedDisabledSlots;
  homerooms.value = loadedHomerooms;
  curriculum.value = loadedCurriculum;

  // Load SheetJS dynamically
  if (!window.XLSX) {
    const script = document.createElement('script');
    script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
    script.async = true;
    document.body.appendChild(script);
  }
});

watch([teachers, subjects, classes, allocations, schedule, disabledSlots, homerooms, curriculum], () => {
  localStorage.setItem('mi_teachers', JSON.stringify(teachers.value));
  localStorage.setItem('mi_subjects', JSON.stringify(subjects.value));
  localStorage.setItem('mi_classes', JSON.stringify(classes.value));
  localStorage.setItem('mi_allocations', JSON.stringify(allocations.value));
  localStorage.setItem('mi_schedule', JSON.stringify(schedule.value));
  localStorage.setItem('mi_disabled_slots', JSON.stringify(disabledSlots.value));
  localStorage.setItem('mi_homerooms', JSON.stringify(homerooms.value));
  localStorage.setItem('mi_curriculum', JSON.stringify(curriculum.value));
}, { deep: true });

watch(() => [allocForm.subjectId, allocForm.classId, curriculum.value], () => {
  if (allocForm.subjectId && allocForm.classId) {
    const key = `${allocForm.classId}_${allocForm.subjectId}`;
    allocForm.jtm = parseInt(curriculum.value[key] || 0);
  } else {
    allocForm.jtm = 0;
  }
}, { deep: true });

// --- METHODS ---
const handleBackup = () => {
  const data = {
    teachers: teachers.value,
    subjects: subjects.value,
    classes: classes.value,
    allocations: allocations.value,
    schedule: schedule.value,
    disabledSlots: disabledSlots.value,
    homerooms: homerooms.value,
    curriculum: curriculum.value
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showNotification('Backup berhasil diunduh.');
};

const handleRestore = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      modal.value = {
        title: 'Konfirmasi Restore',
        message: 'Restore akan menimpa data saat ini. Lanjutkan?',
        onConfirm: () => {
          teachers.value = data.teachers || [];
          subjects.value = data.subjects || [];
          classes.value = data.classes || DEFAULT_CLASSES;
          allocations.value = data.allocations || [];
          schedule.value = data.schedule || {};
          disabledSlots.value = data.disabledSlots || {};
          homerooms.value = data.homerooms || {};
          curriculum.value = data.curriculum || {};
          modal.value = null;
          showNotification('Data berhasil dipulihkan.');
        }
      };
    } catch (err) { showNotification('Gagal membaca file backup.', 'error'); }
  };
  reader.readAsText(file);
};

const addTeacher = (name) => {
  teachers.value.push({ id: generateId(), name });
  showNotification('Guru berhasil ditambahkan.');
};

const removeTeacher = (id) => {
  teachers.value = teachers.value.filter(t => t.id !== id);
  showNotification('Guru berhasil dihapus.');
};

const addSubject = (subj) => {
  subjects.value.push({ id: generateId(), ...subj });
  showNotification('Mapel berhasil ditambahkan.');
};

const removeSubject = (id) => {
  subjects.value = subjects.value.filter(s => s.id !== id);
  showNotification('Mapel berhasil dihapus.');
};

const addClass = (cls) => {
  if (classes.value.includes(cls)) return showNotification('Kelas sudah ada.', 'error');
  classes.value.push(cls);
  classes.value.sort();
  showNotification('Kelas berhasil ditambahkan.');
};

const removeClass = (cls) => {
  classes.value = classes.value.filter(c => c !== cls);
  showNotification('Kelas berhasil dihapus.');
};

const setHomeroomTeacher = (classId, teacherId) => {
  const newH = { ...homerooms.value };
  if (teacherId === '') delete newH[classId];
  else newH[classId] = teacherId;
  homerooms.value = newH;
};

const updateCurriculum = (classId, subjectId, val) => {
  curriculum.value[`${classId}_${subjectId}`] = val;
};

const downloadCurriculumTemplate = () => {
  if (!window.XLSX) return showNotification('Pustaka Excel belum siap.', 'error');
  const wsData = [
    ['Mata Pelajaran', ...classes.value]
  ];
  subjects.value.forEach(s => {
    wsData.push([s.name, ...classes.value.map(c => curriculum.value[`${c}_${s.id}`] || '')]);
  });
  const ws = window.XLSX.utils.aoa_to_sheet(wsData);
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, "Curriculum");
  
  try {
    window.XLSX.writeFile(wb, "Template_JTM_Kurikulum.xlsx");
  } catch (err) {
    console.error("XLSX Write Error:", err);
    showNotification('Gagal mengunduh template.', 'error');
  }
};

const handleUploadExcel = (e) => {
  const file = e.target.files[0];
  if (!file || !window.XLSX) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = window.XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const ws = workbook.Sheets[sheetName];
    const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1 });
    const header = rows[0];
    const newCur = { ...curriculum.value };
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const subjectName = row[0];
      const subjectObj = subjects.value.find(s => s.name === subjectName);
      if (!subjectObj) continue;
      for (let j = 1; j < header.length; j++) {
        const classId = header[j];
        if (classes.value.includes(classId.toString())) {
          newCur[`${classId}_${subjectObj.id}`] = row[j] || 0;
        }
      }
    }
    curriculum.value = newCur;
    showNotification('Kurikulum berhasil diunggah.');
  };
  reader.readAsArrayBuffer(file);
};

const getTeacherHomeroomClass = (teacherId) => Object.keys(homerooms.value).find(c => homerooms.value[c] === teacherId);

const handleTeacherChangeInAlloc = (teacherId) => {
  allocForm.teacherId = teacherId;
  const hrClass = getTeacherHomeroomClass(teacherId);
  if (hrClass) allocForm.classId = hrClass;
  else allocForm.classId = '';
};

const addAllocation = () => {
  if (!allocForm.teacherId || !allocForm.subjectId || !allocForm.classId) return;

  const isDuplicate = allocations.value.some(a => 
    a.subjectId === allocForm.subjectId && a.classId === allocForm.classId
  );

  if (isDuplicate) {
    return showNotification('Mata pelajaran ini sudah ada di kelas tersebut!', 'error');
  }

  allocations.value.push({
    id: generateId(),
    teacherId: allocForm.teacherId,
    subjectId: allocForm.subjectId,
    classId: allocForm.classId,
    jtm: allocForm.jtm
  });
  showNotification('Alokasi berhasil ditambahkan.');
};

const removeAllocation = (id) => {
  const newSch = { ...schedule.value };
  Object.keys(newSch).forEach(d => {
    if (!newSch[d]) return;
    Object.keys(newSch[d]).forEach(p => {
      if (!newSch[d][p]) return;
      Object.keys(newSch[d][p]).forEach(c => { if (newSch[d][p][c] === id) delete newSch[d][p][c]; });
    });
  });
  schedule.value = newSch;
  allocations.value = allocations.value.filter(a => a.id !== id);
  showNotification('Alokasi berhasil dihapus.');
};

const resetAllocationSlots = (allocId) => {
  const newSch = { ...schedule.value };
  Object.keys(newSch).forEach(d => {
    if (!newSch[d]) return;
    Object.keys(newSch[d]).forEach(p => {
      if (!newSch[d][p]) return;
      Object.keys(newSch[d][p]).forEach(c => { if (newSch[d][p][c] === allocId) delete newSch[d][p][c]; });
    });
  });
  schedule.value = newSch;
  showNotification('Slot berhasil dikosongkan.');
};

const getSlot = (dayIdx, periodIdx, classId) => schedule.value[dayIdx]?.[periodIdx]?.[classId];
const isSlotDisabled = (dayIdx, periodIdx, classId) => disabledSlots.value[`${dayIdx}_${periodIdx}_${classId}`];

const toggleSlotDisable = (dayIdx, periodIdx, classId) => {
  const key = `${dayIdx}_${periodIdx}_${classId}`;
  const newDis = { ...disabledSlots.value };
  if (newDis[key]) delete newDis[key];
  else {
    newDis[key] = true;
    const newSch = { ...schedule.value };
    if (newSch[dayIdx]?.[periodIdx]?.[classId]) delete newSch[dayIdx][periodIdx][classId];
    schedule.value = newSch;
  }
  disabledSlots.value = newDis;
};

const getAllocDetails = (allocId) => {
  const alloc = allocations.value.find(a => a.id === allocId);
  if (!alloc) return null;
  return {
    ...alloc,
    teacherName: teachers.value.find(t => t.id === alloc.teacherId)?.name,
    subjectName: subjects.value.find(s => s.id === alloc.subjectId)?.name
  };
};

const getUsedJtm = (allocId) => {
  let count = 0;
  Object.values(schedule.value).forEach(day => {
    if (!day) return;
    Object.values(day).forEach(period => {
      if (!period) return;
      Object.values(period).forEach(alloc => {
        if (alloc === allocId) count++;
      });
    });
  });
  return count;
};

const checkConflict = (dayIdx, periodIdx, teacherId, currentClassId) => {
  for (const cls of classes.value) {
    if (cls === currentClassId) continue;
    const allocId = schedule.value[dayIdx]?.[periodIdx]?.[cls];
    if (allocId && allocations.value.find(a => a.id === allocId)?.teacherId === teacherId) return { conflict: true, location: `Kelas ${cls}` };
  }
  return { conflict: false };
};

const handleCellClick = (dayIdx, periodIdx, classId) => {
  if (isDisableMode.value) return toggleSlotDisable(dayIdx, periodIdx, classId);
  if (!selectedAllocation.value) {
    if (getSlot(dayIdx, periodIdx, classId)) {
      modal.value = {
        title: 'Hapus Jadwal',
        message: 'Hapus mata pelajaran dari slot ini?',
        onConfirm: () => {
          const newSch = { ...schedule.value };
          delete newSch[dayIdx][periodIdx][classId];
          schedule.value = newSch;
          modal.value = null;
        }
      };
    }
    return;
  }
  const teacherId = selectedAllocation.value.teacherId;
  const conflict = checkConflict(dayIdx, periodIdx, teacherId, classId);
  if (conflict.conflict) return showNotification(`Bentrok: Guru sedang mengajar di ${conflict.location}`, 'error');
  const newSch = { ...schedule.value };
  if (!newSch[dayIdx]) newSch[dayIdx] = {};
  if (!newSch[dayIdx][periodIdx]) newSch[dayIdx][periodIdx] = {};
  newSch[dayIdx][periodIdx][classId] = selectedAllocation.value.id;
  schedule.value = newSch;
  if (getUsedJtm(selectedAllocation.value.id) >= selectedAllocation.value.jtm) selectedAllocation.value = null;
};

const runAutoSchedule = () => {
  const newSch = { ...schedule.value };
  const zones = [[0, 1], [2, 3], [4, 5], [6, 7]];
  const sortedAllocs = [...allocations.value].sort((a, b) => b.jtm - a.jtm);

  for (const alloc of sortedAllocs) {
    let remaining = alloc.jtm - getUsedJtm(alloc.id);
    if (remaining <= 0) continue;
    const shuffledDays = [...Array(DAYS.length).keys()].sort(() => Math.random() - 0.5);
    for (const d of shuffledDays) {
      if (remaining <= 0) break;
      if (!newSch[d]) newSch[d] = {};
      for (const zone of zones) {
        if (remaining <= 0) break;
        const step = Math.min(remaining, 2);
        for (let i = 0; i <= zone.length - step; i++) {
          const indices = zone.slice(i, i + step);
          const safe = indices.every(idx =>
            !newSch[d][idx]?.[alloc.classId] &&
            !isSlotDisabled(d, idx, alloc.classId) &&
            !checkConflict(d, idx, alloc.teacherId, alloc.classId).conflict
          );
          if (safe) {
            indices.forEach(idx => {
              if (!newSch[d][idx]) newSch[d][idx] = {};
              newSch[d][idx][alloc.classId] = alloc.id;
            });
            remaining -= step;
            break;
          }
        }
      }
    }
  }
  schedule.value = newSch;
  showNotification(`Penyusunan selesai.`);
};

const handleAutoSchedule = () => {
  isGenerating.value = true;
  setTimeout(() => {
    runAutoSchedule();
    isGenerating.value = false;
  }, 1000);
};

const handleResetSchedule = () => {
  modal.value = {
    title: 'Reset Jadwal',
    message: 'Apakah Anda yakin ingin menghapus semua data jadwal yang telah disusun? Data batasan jam dan alokasi tugas tidak akan dihapus.',
    onConfirm: () => {
      schedule.value = {};
      modal.value = null;
      showNotification('Semua jadwal berhasil dikosongkan.');
    }
  };
};

const exportToExcel = () => {
  if (!window.XLSX) return showNotification('Excel library not loaded.');
  const wb = window.XLSX.utils.book_new();
  const wsData = [
    ["HARI", "JAM", ...classes.value.map(c => "KELAS " + c)]
  ];
  DAYS.forEach((day, dIdx) => {
    for (let pIdx = 0; pIdx < PERIOD_TIMES.length; pIdx++) {
      const row = [day, PERIOD_TIMES[pIdx]];
      classes.value.forEach(cls => {
        if (isSlotDisabled(dIdx, pIdx, cls)) {
          row.push("NONAKTIF");
        } else {
          const det = getAllocDetails(getSlot(dIdx, pIdx, cls));
          row.push(det ? `${det.subjectName} (${det.teacherName})` : "-");
        }
      });
      wsData.push(row);
      if (pIdx === 3) wsData.push([day, "09:15 - 10:00", ...classes.value.map(() => "ISTIRAHAT 1")]);
      if (pIdx === 5) wsData.push([day, "11:00 - 11:20", ...classes.value.map(() => "ISTIRAHAT 2")]);
    }
  });
  const ws = window.XLSX.utils.aoa_to_sheet(wsData);
  window.XLSX.utils.book_append_sheet(wb, ws, "SmartSchedule");
  window.XLSX.writeFile(wb, "Jadwal_Pelajaran_MI.xlsx");
};


// --- COMPUTED ---
const filteredAllocations = computed(() => {
  return allocations.value.filter(a =>
    (filterClass.value === 'all' || a.classId === filterClass.value) &&
    (filterTeacher.value === 'all' || a.teacherId === filterTeacher.value)
  );
});

const taskSidebarClasses = computed(() => {
  return classes.value.filter(c => taskClassFilter.value === 'all' || taskClassFilter.value === c);
});

const isTaskResultsEmpty = computed(() => {
  return taskSidebarClasses.value.every(cls =>
    allocations.value.filter(a => {
      const det = getAllocDetails(a.id);
      return a.classId === cls && (taskSearchQuery.value === '' || (det && det.subjectName.toLowerCase().includes(taskSearchQuery.value.toLowerCase())));
    }).length === 0
  );
});
</script>

<template>
  <div class="h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
    <!-- Sidebar -->
    <AppSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Mobile Sidebar Overlay -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
      ></div>
    </Transition>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Main Header -->
      <AppHeader 
        :isSidebarOpen="isSidebarOpen"
        :isGenerating="isGenerating" 
        @toggleSidebar="toggleSidebar"
        @backup="handleBackup" 
        @restore="restoreInputRef?.click()"
        @export="exportToExcel" 
      />
      <input type="file" ref="restoreInputRef" @change="handleRestore" accept=".json" class="hidden" />

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
        <router-view v-slot="{ Component }">
          <component 
            :is="Component"
            :isDisableMode="isDisableMode"
            :isGenerating="isGenerating"
            :classes="classes"
            :taskClassFilter="taskClassFilter"
            :taskSearchQuery="taskSearchQuery"
            :taskSidebarClasses="taskSidebarClasses"
            :isTaskResultsEmpty="isTaskResultsEmpty"
            :allocations="allocations"
            :selectedAllocation="selectedAllocation"
            :DAYS="DAYS"
            :PERIOD_TIMES="PERIOD_TIMES"
            :teachers="teachers"
            :subjects="subjects"
            :curriculum="curriculum"
            :homerooms="homerooms"
            :allocForm="allocForm"
            :filterClass="filterClass"
            :filterTeacher="filterTeacher"
            :filteredAllocations="filteredAllocations"
            :getSlot="getSlot"
            :getAllocDetails="getAllocDetails"
            :getUsedJtm="getUsedJtm"
            :isSlotDisabled="isSlotDisabled"
            :getTeacherHomeroomClass="getTeacherHomeroomClass"
            @toggleDisableMode="isDisableMode = !isDisableMode"
            @autoSchedule="handleAutoSchedule"
            @update:taskClassFilter="taskClassFilter = $event"
            @update:taskSearchQuery="taskSearchQuery = $event"
            @selectAlloc="selectedAllocation = $event"
            @resetSlots="resetAllocationSlots($event.id)"
            @resetSchedule="handleResetSchedule"
            @cellClick="handleCellClick"
            @addTeacher="addTeacher"
            @removeTeacher="removeTeacher"
            @addSubject="addSubject"
            @removeSubject="removeSubject"
            @addClass="addClass"
            @removeClass="removeClass"
            @update:filterClass="filterClass = $event"
            @update:filterTeacher="filterTeacher = $event"
            @add="addAllocation"
            @remove="removeAllocation"
            @teacherChange="handleTeacherChangeInAlloc"
            @downloadTemplate="downloadCurriculumTemplate"
            @uploadExcel="fileInputRef?.click()"
            @updateCurriculum="updateCurriculum"
            @setHomeroom="setHomeroomTeacher"
            @showModal="modal = $event"
          />
        </router-view>
        <input type="file" ref="fileInputRef" @change="handleUploadExcel" accept=".xlsx, .xls" class="hidden" />
      </main>
    </div>

    <!-- Global Common Components -->
    <AppModal 
      :show="!!modal" 
      :title="modal?.title || ''" 
      :message="modal?.message || ''" 
      @confirm="modal?.onConfirm"
      @cancel="modal = null" 
    />

    <AppNotification 
      :show="!!notification" 
      :msg="notification?.msg || ''" 
      :type="notification?.type" 
    />

    <!-- Selection Indicator -->
    <Transition 
      enter-active-class="transition duration-500 ease-out" 
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0" 
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0" 
      leave-to-class="opacity-0 translate-y-20"
    >
      <div v-if="selectedAllocation"
        class="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 border border-white/10 rounded-3xl px-8 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-40 flex items-center gap-6 border-b-4 border-b-indigo-500 transition-colors duration-300">
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 italic">Menyusun Jadwal:</span>
          <span class="text-sm font-bold text-white tracking-tight">
            {{ getAllocDetails(selectedAllocation.id)?.subjectName }}
            <span class="text-white/40 mx-2">|</span>
            <span class="text-indigo-400">Kelas {{ selectedAllocation.classId }}</span>
          </span>
        </div>
        <button @click="selectedAllocation = null"
          class="p-2.5 bg-white/10 hover:bg-rose-500 text-white/50 hover:text-white rounded-2xl transition-all active:scale-95">
          <X :size="20" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Advanced custom scrollbar for overall maintenance */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
