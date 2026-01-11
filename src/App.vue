<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="flex gap-2 justify-between items-center p-4">
      <h1 class="text-2xl font-bold">WT<span class="text-orange-500 text-sm">Work Tracker</span></h1>
    </nav>
  </header>

  <div class="p-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
