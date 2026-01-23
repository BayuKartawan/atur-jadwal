<script setup>
import { ref } from "vue";
import { User, BookOpen, Layers, Clock } from "lucide-vue-next";
import TeacherManager from "../components/data-master/TeacherManager.vue";
import SubjectManager from "../components/data-master/SubjectManager.vue";
import ClassManager from "../components/data-master/ClassManager.vue";
import TimeSlotManager from "../components/data-master/TimeSlotManager.vue";
import AppButton from "../components/ui/AppButton.vue";

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  periodTimes: Array,
  getTeacherHomeroomClass: Function,
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
]);

const masterSubTab = ref("guru");
</script>

<template>
  <div class="p-2 lg:p-4 flex flex-col h-full overflow-hidden">
    <!-- Tabs Navigation -->
    <div
      class="flex gap-2 lg:gap-4 mb-4 lg:mb-6 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full lg:w-fit shrink-0 overflow-x-auto custom-scrollbar"
    >
      <AppButton
        v-for="tab in [
          { id: 'guru', label: 'Guru', icon: User },
          { id: 'mapel', label: 'Mapel', icon: BookOpen },
          { id: 'kelas', label: 'Kelas', icon: Layers },
          { id: 'jam', label: 'Jam', icon: Clock },
        ]"
        :key="tab.id"
        @click="masterSubTab = tab.id"
        :variant="masterSubTab === tab.id ? 'primary' : 'ghost'"
        size="md"
        class="!rounded-xl flex-1 lg:flex-none whitespace-nowrap min-w-[100px]"
      >
        <template #icon-left>
          <component :is="tab.icon" :size="16" />
        </template>
        {{ tab.label }}
      </AppButton>
    </div>

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
        @remove="$emit('addClass', $event, true)"
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
