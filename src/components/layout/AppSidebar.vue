<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-full border-r transition-all duration-300 transform overflow-hidden shrink-0',
      'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800',
      isOpen
        ? 'translate-x-0 w-64 shadow-2xl lg:shadow-none'
        : '-translate-x-full lg:translate-x-0 w-64 lg:w-20',
    ]"
  >
    <!-- Sidebar Header / Logo -->
    <div class="h-20 flex items-center justify-center lg:justify-start px-6">
      <div 
        class="flex items-center gap-3 transition-all duration-300"
        :class="!isOpen ? 'lg:justify-center w-full' : ''"
      >
        <div class="bg-indigo-600 p-2.5 rounded-xl text-white shrink-0 shadow-md shadow-indigo-200 dark:shadow-none bg-gradient-to-br from-indigo-500 to-indigo-700">
          <School :size="22" stroke-width="2.5" />
        </div>
        
        <div 
          v-if="isOpen"
          class="flex flex-col animate-fade-in"
        >
          <span class="text-slate-900 dark:text-white font-extrabold text-sm tracking-tight leading-none"
            >SmartSchedule</span
          >
          <span
            class="text-slate-500 dark:text-slate-400 text-[10px] font-medium tracking-wide mt-0.5"
            >v2.0 Pro</span
          >
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar custom-scroll">
      <div v-for="item in menuItems" :key="item.id">
        <!-- Single Item -->
        <router-link
          v-if="!item.children"
          :to="item.path"
          @click="handleNavClick"
          v-slot="{ isActive }"
          class="block group"
        >
          <div class="relative">
            <button
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200',
                !isOpen ? 'justify-center lg:px-2' : ''
              ]"
            >
              <component 
                :is="item.icon" 
                :size="20" 
                class="shrink-0 transition-colors"
                :class="isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'"
                stroke-width="2" 
              />
              
              <span 
                v-if="isOpen" 
                class="whitespace-nowrap transition-opacity duration-200"
              >
                {{ item.label }}
              </span>
              
              <!-- Tooltip for collapsed mode -->
              <div 
                v-if="!isOpen" 
                class="hidden lg:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in pointer-events-none"
              >
                {{ item.label }}
                <!-- Arrow -->
                <div class="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-slate-800"></div>
              </div>
            </button>
            
            <!-- Active Indicator for Collapsed Mode -->
            <div 
              v-if="!isOpen && isActive"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
            ></div>
          </div>
        </router-link>

        <!-- Group Item -->
        <div v-else class="group">
          <div class="relative">
            <button
              @click="handleParentClick(item)"
              :class="[
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                isParentActive(item)
                  ? 'bg-slate-50 text-slate-900 dark:bg-slate-900/30 dark:text-slate-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200',
                !isOpen ? 'justify-center lg:px-2' : ''
              ]"
            >
              <div class="flex items-center gap-3">
                <component 
                  :is="item.icon" 
                  :size="20" 
                  class="shrink-0 transition-colors"
                  :class="isParentActive(item) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'"
                  stroke-width="2"
                />
                <span v-if="isOpen" class="whitespace-nowrap">{{ item.label }}</span>
              </div>
              
              <div v-if="isOpen">
                <ChevronDown 
                  :size="14" 
                  class="text-slate-400 transition-transform duration-200"
                  :class="expandedMenus[item.id] ? 'rotate-180' : ''"
                />
              </div>

               <!-- Tooltip for collapsed mode -->
               <div 
                v-if="!isOpen" 
                class="hidden lg:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in pointer-events-none"
              >
                {{ item.label }}
                 <div class="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-slate-800"></div>
              </div>
            </button>
          </div>

          <!-- Children -->
          <div 
            v-if="expandedMenus[item.id] && isOpen" 
            class="mt-1 space-y-0.5 px-3"
          >
            <!-- Wrapper for line effect -->
            <div class="pl-3 border-l-2 border-slate-100 dark:border-slate-800 ml-2.5 space-y-1">
               <router-link
                v-for="child in item.children"
                :key="child.id"
                :to="child.path"
                @click="handleNavClick"
                v-slot="{ isActive }"
                class="block"
              >
                <button
                  :class="[
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-[12px] transition-all',
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-500/10'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/50',
                  ]"
                >
                   <div 
                      class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                      :class="isActive ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400'"
                   ></div>
                  <span>{{ child.label }}</span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800/50">
      <router-link to="/about" @click="handleNavClick" v-slot="{ isActive }" class="group relative">
        <button
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-[13px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
             isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200',
            !isOpen ? 'justify-center lg:px-2' : ''
          ]"
        >
          <Info :size="20" stroke-width="2" class="shrink-0" />
          <span v-if="isOpen" class="whitespace-nowrap">Tentang Aplikasi</span>

           <!-- Tooltip -->
            <div 
              v-if="!isOpen" 
               class="hidden lg:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in pointer-events-none"
            >
              Tentang Aplikasi
               <div class="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-slate-800"></div>
            </div>
        </button>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import {
  LayoutDashboard,
  School,
  ClipboardList,
  DatabaseBackup,
  RefreshCw,
  BookOpen,
  User,
  FileBarChart,
  UserCheck,
  X,
  Info,
  Printer,
  ChevronDown,
} from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRoute } from 'vue-router';

// Menu Items Definition
const menuItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "data_master",
    path: "/data-master",
    label: "Data Master",
    icon: DatabaseBackup,
  },
  { id: "curriculum", path: "/curriculum", label: "Kurikulum", icon: BookOpen },
  { id: "walikelas", path: "/wali-kelas", label: "Wali Kelas", icon: User },
  {
    id: "allocation",
    path: "/allocation",
    label: "Alokasi Jam",
    icon: RefreshCw,
  },
  {
    id: "schedule",
    path: "/schedule",
    label: "Jadwal Pelajaran",
    icon: ClipboardList,
  },
  {
    id: "laporan",
    label: "Laporan & Cetak",
    icon: Printer,
    children: [
      {
        id: "class_schedule",
        path: "/class-schedule",
        label: "Jadwal Kelas",
        icon: School,
      },
      {
        id: "teacher_schedule",
        path: "/teacher-schedule",
        label: "Jadwal Guru",
        icon: UserCheck,
      },
      { id: "rekap", path: "/rekap", label: "Rekap JTM", icon: FileBarChart },
    ]
  },
];

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "toggle"]);

const route = useRoute();
const expandedMenus = ref({
  laporan: false 
});

const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    emit("close");
  }
};

const handleParentClick = (item) => {
  if (!props.isOpen && item.children) {
    // If collapsed, open sidebar first then expand
    emit('toggle');
    setTimeout(() => {
      expandedMenus.value[item.id] = true;
    }, 200);
  } else {
    // Toggle expand
    expandedMenus.value[item.id] = !expandedMenus.value[item.id];
  }
};

const isParentActive = (item) => {
  if (item.children) {
    return item.children.some(child => child.path === route.path);
  }
  return false;
};

// Automatically expand/highlight based on route
watch(() => route.path, () => {
   menuItems.forEach(item => {
    if (item.children && item.children.some(child => child.path === route.path)) {
       // Only auto-expand if sidebar is open, or rely on user action
       if(props.isOpen) expandedMenus.value[item.id] = true;
       // We can also just set it true regardless if we want it pre-opened
       expandedMenus.value[item.id] = true;
    }
   });
}, { immediate: true });
</script>

<style scoped>
/* Scrollbar Styling */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 225, 0.4) transparent;
}
.dark .custom-scroll {
   scrollbar-color: rgba(51, 65, 85, 0.4) transparent;
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
}
.custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(203, 213, 225, 0.4);
}
.dark .custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(51, 65, 85, 0.4);
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
