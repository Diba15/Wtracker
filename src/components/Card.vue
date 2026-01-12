<script setup>
defineOptions({
  name: 'CustomCard'
})
defineProps({
  cardTitle: {
    type: String,
    required: true
  },
  cardSubtitle: {
    type: String,
    required: true
  },
  cardValue: {
    type: String,
    required: true
  },
  cardIcon: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="min-w-98 p-4 bg-gray-800 border border-gray-700 rounded-lg">
    <h1 class="text-2xl font-bold text-white mb-2">{{ cardTitle }}</h1>
    <h2 class="text-sm text-gray-400 mb-2">{{ cardSubtitle }}</h2>
    <h1 class="text-4xl font-bold text-white mb-2">{{ cardValue }}</h1>
  </div>
</template>
