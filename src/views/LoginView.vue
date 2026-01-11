<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import CustomInput from '@/components/CustomInput.vue'

const router = useRouter()
const { signIn, signUp } = useAuth()

const isLogin = ref(true)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  form.value = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    if (isLogin.value) {
      // Login
      if (!form.value.email || !form.value.password) {
        errorMessage.value = 'Email dan password wajib diisi'
        return
      }

      const { error } = await signIn(form.value.email, form.value.password)
      if (error) {
        errorMessage.value = error.message
      } else {
        router.push('/')
      }
    } else {
      // Register
      if (!form.value.email || !form.value.password) {
        errorMessage.value = 'Email dan password wajib diisi'
        return
      }

      if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = 'Password tidak cocok'
        return
      }

      if (form.value.password.length < 6) {
        errorMessage.value = 'Password minimal 6 karakter'
        return
      }

      const { error } = await signUp(form.value.email, form.value.password, {
        name: form.value.name || '',
      })

      if (error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.'
        setTimeout(() => {
          toggleMode()
        }, 2000)
      }
    }
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-800 rounded-lg shadow-xl p-8">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ isLogin ? 'Masuk' : 'Daftar' }}
          </h1>
          <p class="text-gray-400">
            {{ isLogin ? 'Selamat datang kembali!' : 'Buat akun baru untuk mulai' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin">
            <CustomInput v-model="form.name" label="Nama" type="text" placeholder="Masukkan nama Anda" id="name" />
          </div>

          <CustomInput v-model="form.email" label="Email" type="email" placeholder="Masukkan email Anda" id="email" />

          <CustomInput v-model="form.password" label="Password" type="password" placeholder="Masukkan password Anda"
            id="password" />

          <div v-if="!isLogin">
            <CustomInput v-model="form.confirmPassword" label="Konfirmasi Password" type="password"
              placeholder="Konfirmasi password Anda" id="confirmPassword" />
          </div>

          <div v-if="errorMessage"
            class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
            {{ errorMessage }}
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-orange-500 text-white px-4 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button @click="toggleMode" class="text-orange-500 hover:text-orange-400 text-sm transition-colors">
            {{ isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
