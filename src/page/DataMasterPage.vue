<script setup>
import { ref } from 'vue';
import { User, BookOpen, Layers } from 'lucide-vue-next';
import TeacherManager from '../components/data-master/TeacherManager.vue';
import SubjectManager from '../components/data-master/SubjectManager.vue';
import ClassManager from '../components/data-master/ClassManager.vue';
import AppButton from '../components/ui/AppButton.vue';

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  getTeacherHomeroomClass: Function
});

const emit = defineEmits(['addTeacher', 'removeTeacher', 'addSubject', 'removeSubject', 'addClass', 'removeClass']);

const masterSubTab = ref('guru');
</script>

<template>
  <div class="p-8 flex flex-col h-full overflow-hidden">
    <div class="flex gap-4 mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit shrink-0">
      <AppButton 
        v-for="tab in [
          { id: 'guru', label: 'Guru', icon: User },
          { id: 'mapel', label: 'Mapel', icon: BookOpen },
          { id: 'kelas', label: 'Kelas', icon: Layers }
        ]" 
        :key="tab.id" 
        @click="masterSubTab = tab.id"
        :variant="masterSubTab === tab.id ? 'primary' : 'ghost'"
        size="md"
        class="!rounded-xl"
      >
        <template #icon-left>
          <component :is="tab.icon" :size="16" />
        </template>
        {{ tab.label }}
      </AppButton>
    </div>

    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12">
      <TeacherManager 
        v-if="masterSubTab === 'guru'" 
        :teachers="teachers"
        :getTeacherHomeroomClass="getTeacherHomeroomClass" 
        @add="$emit('addTeacher', $event)" 
        @remove="$emit('removeTeacher', $event)" 
      />
      <SubjectManager 
        v-if="masterSubTab === 'mapel'" 
        :subjects="subjects" 
        @add="$emit('addSubject', $event)"
        @remove="$emit('removeSubject', $event)" 
      />
      <ClassManager 
        v-if="masterSubTab === 'kelas'" 
        :classes="classes" 
        @add="$emit('addClass', $event)" 
        @remove="$emit('removeClass', $event)" 
      />
    </div>
  </div>
</template>
