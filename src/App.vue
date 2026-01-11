<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { checkUser, initAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, signOut } = useAuth()

// Initialize auth
onMounted(() => {
  checkUser()
  initAuth()
})

const handleLogout = async () => {
  await signOut()
  router.push('/login')
}

const getUserEmail = () => {
  return user.value?.email || ''
}
</script>

<template>
  <header>
    <nav class="flex gap-2 justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
      <h1 class="text-2xl font-bold text-white">
        WT<span class="text-orange-500 text-sm">Work Tracker</span>
      </h1>
      <div v-if="user" class="flex items-center gap-4">
        <span class="text-sm text-gray-300">{{ getUserEmail() }}</span>
        <button @click="handleLogout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors">
          Logout
        </button>
      </div>
    </nav>
  </header>

  <div class="p-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
