<script setup>
import { ref } from "vue";
import TaskSidebar from "../components/scheduling/TaskSidebar.vue";
import ScheduleGrid from "../components/scheduling/ScheduleGrid.vue";
import { PanelLeftClose, PanelLeftOpen } from "lucide-vue-next";

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
  isSlotDisabled: Function,
  isAppHeaderVisible: Boolean,
});

const emit = defineEmits([
  "toggleDisableMode",
  "autoSchedule",
  "update:taskClassFilter",
  "update:taskSearchQuery",
  "selectAlloc",
  "resetSlots",
  "cellClick",
  "resetSchedule",
  "toggleAppHeader",
]);

const isSidebarOpen = ref(true);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full overflow-hidden relative">
    <!-- Mobile Toggle Button -->
    <!-- Mobile Toggle Button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center"
    >
      <PanelLeftOpen v-if="!isSidebarOpen" :size="20" />
      <PanelLeftClose v-else :size="20" />
    </button>

    <TaskSidebar
      :is-open="isSidebarOpen"
      @update:is-open="isSidebarOpen = $event"
      :isDisableMode="isDisableMode"
      :classes="classes"
      :taskClassFilter="taskClassFilter"
      :taskSearchQuery="taskSearchQuery"
      :taskSidebarClasses="taskSidebarClasses"
      :isTaskResultsEmpty="isTaskResultsEmpty"
      :allocations="allocations"
      :getAllocDetails="getAllocDetails"
      :getUsedJtm="getUsedJtm"
      :selectedAllocation="selectedAllocation"
      @update:taskClassFilter="$emit('update:taskClassFilter', $event)"
      @update:taskSearchQuery="$emit('update:taskSearchQuery', $event)"
      @selectAlloc="
        (a) => {
          $emit('selectAlloc', a);
          if (window.innerWidth < 1024) isSidebarOpen = false;
        }
      "
      @resetSlots="$emit('resetSlots', $event)"
    />

    <div class="flex-1 h-full overflow-hidden flex flex-col min-w-0">
      <ScheduleGrid
        :DAYS="DAYS"
        :PERIOD_TIMES="PERIOD_TIMES"
        :classes="classes"
        :isSlotDisabled="isSlotDisabled"
        :getSlot="getSlot"
        :getAllocDetails="getAllocDetails"
        :isDisableMode="isDisableMode"
        :isGenerating="isGenerating"
        :selectedAllocation="selectedAllocation"
        :isAppHeaderVisible="isAppHeaderVisible"
        @cellClick="(d, p, c) => $emit('cellClick', d, p, c)"
        @toggleDisableMode="$emit('toggleDisableMode')"
        @autoSchedule="$emit('autoSchedule')"
        @resetSchedule="$emit('resetSchedule')"
        @toggleAppHeader="$emit('toggleAppHeader')"
      />
    </div>

    <!-- Overlay for mobile when sidebar is open -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-10 transition-opacity"
    ></div>
  </div>
</template>
