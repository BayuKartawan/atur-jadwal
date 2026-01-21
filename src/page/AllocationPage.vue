<script setup>
import AllocationManager from '../components/scheduling/AllocationManager.vue';

const props = defineProps({
  teachers: Array,
  subjects: Array,
  classes: Array,
  allocations: Array,
  allocForm: Object,
  filterClass: String,
  filterTeacher: String,
  filteredAllocations: Array,
  getAllocDetails: Function,
  getTeacherHomeroomClass: Function
});

const emit = defineEmits([
  'update:filterClass', 'update:filterTeacher', 
  'add', 'remove', 'teacherChange', 'showModal'
]);
</script>

<template>
  <div class="h-full overflow-y-auto lg:overflow-hidden custom-scrollbar">
    <AllocationManager 
      :teachers="teachers" 
      :subjects="subjects" 
      :classes="classes"
      :allocations="allocations" 
      :allocForm="allocForm" 
      :filterClass="filterClass" 
      :filterTeacher="filterTeacher"
      :filteredAllocations="filteredAllocations" 
      :getAllocDetails="getAllocDetails"
      :getTeacherHomeroomClass="getTeacherHomeroomClass" 
      @update:filterClass="$emit('update:filterClass', $event)"
      @update:filterTeacher="$emit('update:filterTeacher', $event)" 
      @add="$emit('add')" 
      @remove="$emit('remove', $event)"
      @teacherChange="$emit('teacherChange', $event)" 
      @showModal="$emit('showModal', $event)"
    />
  </div>
</template>
