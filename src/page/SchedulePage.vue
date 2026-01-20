<script setup>
import { ref } from 'vue';
import { Settings2, X } from 'lucide-vue-next';
import TaskSidebar from '../components/scheduling/TaskSidebar.vue';
import ScheduleGrid from '../components/scheduling/ScheduleGrid.vue';

const showControlPanel = ref(false);

const props = defineProps({
  isDisableMode: Boolean,
  isGenerating: Boolean,
  classes: Array,
  taskClassFilter: String,
  taskSearchQuery: String,
  taskSidebarClasses: Array,
  isTaskResultsEmpty: Boolean,
  allocations: Array,
  selectedAllocation: Object,
  DAYS: Array,
  PERIOD_TIMES: Array,
  getSlot: Function,
  getAllocDetails: Function,
  getUsedJtm: Function,
  isSlotDisabled: Function
});

const emit = defineEmits([
  'toggleDisableMode', 'autoSchedule', 'update:taskClassFilter', 
  'update:taskSearchQuery', 'selectAlloc', 'resetSlots', 'cellClick', 'resetSchedule'
]);
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full overflow-hidden relative">
    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="showControlPanel" 
      @click="showControlPanel = false"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <TaskSidebar 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0',
        showControlPanel ? 'translate-x-0' : '-translate-x-full'
      ]"
      :isDisableMode="isDisableMode" 
      :isGenerating="isGenerating" 
      :classes="classes"
      :taskClassFilter="taskClassFilter" 
      :taskSearchQuery="taskSearchQuery" 
      :taskSidebarClasses="taskSidebarClasses"
      :isTaskResultsEmpty="isTaskResultsEmpty" 
      :allocations="allocations" 
      :getAllocDetails="getAllocDetails"
      :getUsedJtm="getUsedJtm" 
      :selectedAllocation="selectedAllocation"
      @toggleDisableMode="$emit('toggleDisableMode')" 
      @autoSchedule="$emit('autoSchedule')"
      @resetSchedule="$emit('resetSchedule')"
      @update:taskClassFilter="$emit('update:taskClassFilter', $event)" 
      @update:taskSearchQuery="$emit('update:taskSearchQuery', $event)"
      @selectAlloc="$emit('selectAlloc', $event)" 
      @resetSlots="$emit('resetSlots', $event)" 
    />

    <div class="flex-1 min-w-0 h-full overflow-hidden flex flex-col relative">
      <ScheduleGrid 
        class="h-full w-full"
        :DAYS="DAYS" 
        :PERIOD_TIMES="PERIOD_TIMES" 
        :classes="classes" 
        :isSlotDisabled="isSlotDisabled"
        :getSlot="getSlot" 
        :getAllocDetails="getAllocDetails" 
        :isDisableMode="isDisableMode"
        @cellClick="(d, p, c) => $emit('cellClick', d, p, c)" 
      />
    </div>

    <!-- Toggle Button for Mobile -->
    <button 
      @click="showControlPanel = !showControlPanel"
      class="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-indigo-700 active:scale-95 transition-all"
    >
      <X v-if="showControlPanel" :size="24" />
      <Settings2 v-else :size="24" />
    </button>
  </div>
</template>
