<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ChevronDown, Search, Check, X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: [String, Number, Object],
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi...'
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  },
  label: String,
  error: String,
  disabled: Boolean,
  clearable: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v)
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref(null);
const searchInputRef = ref(null);

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
};

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

const selectOption = (option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
};

const clearSelection = (e) => {
  e.stopPropagation();
  emit('update:modelValue', null);
  emit('change', null);
};

// Auto close on select is handled, but let's ensure focus if needed
</script>

<template>
  <div 
    class="flex flex-col gap-1.5 w-full relative" 
    :class="{ 'z-[9999]': isOpen }"
    ref="dropdownRef"
  >
    <label v-if="label" class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
      {{ label }}
    </label>
    
    <!-- Trigger Button -->
    <div 
      @click="toggleDropdown"
      tabindex="0"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      :class="[
        'flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border transition-all cursor-pointer select-none outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50',
        isOpen ? 'ring-2 ring-indigo-500/20 border-indigo-500/50' : 'border-slate-100 dark:border-slate-700',
        error ? 'border-rose-500/50' : '',
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:border-slate-300 dark:hover:border-slate-600'
      ]"
    >
      <div :class="[
        'flex-1 font-medium truncate',
        size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
      ]">
        <span v-if="selectedOption" class="text-slate-700 dark:text-slate-200">
          {{ selectedOption.label }}
        </span>
        <span v-else class="text-slate-400 dark:text-slate-500">
          {{ placeholder }}
        </span>
      </div>
      
      <div class="pr-4 flex items-center gap-1 text-slate-400">
        <X 
          v-if="clearable && modelValue" 
          :size="16" 
          @click="clearSelection" 
          class="hover:text-rose-500 transition-colors"
        />
        <ChevronDown 
          :size="18" 
          :class="['transition-transform duration-300', isOpen ? 'rotate-180' : '']"
        />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div 
        v-if="isOpen"
        class="absolute z-[9999] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[320px] backdrop-blur-xl bg-white/90 dark:bg-slate-900/90"
      >
        <!-- Search -->
        <div class="p-2 border-b border-slate-50 dark:border-slate-800">
          <div class="relative flex items-center">
            <Search :size="14" class="absolute left-3 text-slate-400" />
            <input 
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl pl-9 pr-4 py-2 text-xs outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              :placeholder="searchPlaceholder"
              @click.stop
            />
          </div>
        </div>

        <!-- Options List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-1">
          <div 
            v-for="option in filteredOptions" 
            :key="option.value"
            @click="!option.disabled && selectOption(option)"
            :class="[
              'px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group mb-0.5',
              option.disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer',
              modelValue === option.value 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                : !option.disabled ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : 'text-slate-400'
            ]"
          >
            <div class="flex flex-col">
              <span>{{ option.label }}</span>
              <span v-if="option.description" class="text-[10px] opacity-60 font-medium">{{ option.description }}</span>
            </div>
            <Check 
              v-if="modelValue === option.value" 
              :size="14" 
              class="text-indigo-500"
            />
          </div>
          
          <div v-if="filteredOptions.length === 0" class="py-12 text-center opacity-40">
            <Search :size="24" class="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Tidak ditemukan</p>
          </div>
        </div>
      </div>
    </Transition>

    <span v-if="error" class="text-[9px] font-bold text-rose-500 ml-1 uppercase">{{ error }}</span>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

/* Dark mode scrollbar */
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>
