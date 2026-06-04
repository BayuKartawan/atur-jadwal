<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import TeacherManager from "../komponen/data-master/PengelolaGuru.vue";
import SubjectManager from "../komponen/data-master/PengelolaMapel.vue";
import ClassManager from "../komponen/data-master/PengelolaKelas.vue";
import TimeSlotManager from "../komponen/data-master/PengelolaWaktu.vue";

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  periodTimes: Array,
  getTeacherHomeroomClass: Function,
  homerooms: Object,
});

const emit = defineEmits([
  "addTeacher",
  "removeTeacher",
  "updateTeacher",
  "addSubject",
  "removeSubject",
  "updateSubject",
  "addClass",
  "removeClass",
  "addPeriod",
  "removePeriod",
  "updatePeriod",
  "updatePeriodOrder",
  "setHomeroom",
]);

const route = useRoute();

const masterSubTab = computed(() => {
  if (route.path.endsWith("/mapel")) return "mapel";
  if (route.path.endsWith("/kelas")) return "kelas";
  if (route.path.endsWith("/jam")) return "jam";
  return "guru";
});
</script>

<template>
  <div class="p-2 lg:p-4 flex flex-col h-full overflow-hidden">
    <!-- Content Area -->
    <div
      class="flex-1 overflow-y-auto pr-0 lg:pr-2 custom-scrollbar pb-20 lg:pb-12"
    >
      <TeacherManager
        v-if="masterSubTab === 'guru'"
        :teachers="teachers"
        :getTeacherHomeroomClass="getTeacherHomeroomClass"
        @add="$emit('addTeacher', $event)"
        @remove="$emit('removeTeacher', $event)"
        @update="$emit('updateTeacher', $event.id, $event.name)"
      />
      <SubjectManager
        v-if="masterSubTab === 'mapel'"
        :subjects="subjects"
        @add="$emit('addSubject', $event)"
        @remove="$emit('removeSubject', $event)"
        @update="$emit('updateSubject', $event.id, $event.data)"
      />
      <ClassManager
        v-if="masterSubTab === 'kelas'"
        :classes="classes"
        :teachers="teachers"
        :homerooms="homerooms"
        :getTeacherHomeroomClass="getTeacherHomeroomClass"
        @add="$emit('addClass', $event)"
        @remove="$emit('removeClass', $event)"
        @setHomeroom="(classId, teacherId) => $emit('setHomeroom', classId, teacherId)"
      />
      <TimeSlotManager
        v-if="masterSubTab === 'jam'"
        :periodTimes="periodTimes"
        @addPeriod="$emit('addPeriod', $event)"
        @removePeriod="$emit('removePeriod', $event)"
        @updatePeriod="$emit('updatePeriod', $event)"
        @updatePeriodOrder="$emit('updatePeriodOrder', $event)"
      />
    </div>
  </div>
</template>
