<script setup>
import JtmRecap from '../components/reports/JtmRecap.vue';

const props = defineProps({
  teachers: Array,
  allocations: Array,
  getTeacherHomeroomClass: Function,
  getUsedJtm: Function
});
</script>

<template>
  <div class="h-full overflow-y-auto lg:overflow-hidden custom-scrollbar">
    <JtmRecap 
      :teachers="teachers" 
      :allocations="allocations"
      :getTeacherHomeroomClass="getTeacherHomeroomClass" 
      :getUsedJtm="getUsedJtm" 
    />
  </div>
</template>
