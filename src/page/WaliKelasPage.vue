<script setup>
import WaliKelasManager from "../components/curriculum/WaliKelasManager.vue";

const props = defineProps({
  teachers: Array,
  classes: Array,
  homerooms: Object,
  getTeacherHomeroomClass: Function,
});

const emit = defineEmits(["setHomeroom"]);
</script>

<template>
  <div class="h-full overflow-hidden">
    <WaliKelasManager
      :teachers="teachers"
      :classes="classes"
      :homerooms="homerooms"
      :getTeacherHomeroomClass="getTeacherHomeroomClass"
      @setHomeroom="
        (classId, teacherId) => $emit('setHomeroom', classId, teacherId)
      "
    />
  </div>
</template>
