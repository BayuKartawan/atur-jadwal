<script setup>
import CurriculumSettings from '../components/curriculum/CurriculumSettings.vue';

const props = defineProps({
  subjects: Array,
  classes: Array,
  curriculum: Object
});

const emit = defineEmits(['downloadTemplate', 'uploadExcel', 'updateCurriculum']);
</script>

<template>
  <div class="h-full overflow-hidden">
    <CurriculumSettings 
      :subjects="subjects" 
      :classes="classes"
      :curriculum="curriculum" 
      @downloadTemplate="$emit('downloadTemplate')"
      @uploadExcel="$emit('uploadExcel')" 
      @updateCurriculum="(classId, subjectId, val) => $emit('updateCurriculum', classId, subjectId, val)" 
    />
  </div>
</template>
