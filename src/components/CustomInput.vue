<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'CustomInput',
})

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const inputClasses = computed(() => {
  const base = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 bg-gray-800 text-white'
  return props.type === 'textarea' ? base + ' min-h-[100px] resize-y' : base
})
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-300 mb-1">
      {{ label }}
    </label>
    <input v-if="type !== 'textarea'" :type="type" :placeholder="placeholder" :id="id" v-model="inputValue"
      :class="inputClasses" />
    <textarea v-else :placeholder="placeholder" :id="id" v-model="inputValue" :class="inputClasses"></textarea>
  </div>
</template>
