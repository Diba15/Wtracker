<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomInput from '@/components/CustomInput.vue'
import { createJob } from '@/utils/supabase'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

const loading = ref(false)

// Form Tambah (New Job)
const newJob = ref({
  company_name: '',
  vacancy_url: '',
  apply_date: new Date().toISOString().split('T')[0],
  status: 'pending',
  notes: ''
})

// Tambah Data
const addJob = async () => {
  if (!newJob.value.company_name) return alert('Nama perusahaan wajib diisi')
  if (!user.value) return alert('Anda harus login terlebih dahulu')

  loading.value = true
  const { error } = await createJob({ ...newJob.value, user_id: user.value.id })

  if (error) {
    alert('Gagal menambah: ' + error.message)
  } else {
    // Reset form
    newJob.value = {
      company_name: '',
      vacancy_url: '',
      apply_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    }
    // Redirect ke home setelah berhasil
    router.push('/')
  }
  loading.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 md:p-8 bg-gray-900 min-h-screen">
    <!-- Form Tambah -->
    <form @submit.prevent="addJob"
      class="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <h2 class="text-lg font-bold text-white mb-2">Lacak Lamaran Baru</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput v-model="newJob.company_name" label="Nama Perusahaan" type="text"
          placeholder="Contoh: PT. Maju Jaya" id="company_name" />
        <CustomInput v-model="newJob.vacancy_url" label="URL Lowongan" type="text" placeholder="https://..."
          id="vacancy_url" />
        <CustomInput v-model="newJob.apply_date" label="Tanggal Lamar" type="date" id="apply_date" />
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select v-model="newJob.status"
            class="w-full rounded-md border-gray-600 shadow-sm p-3 bg-gray-700 text-white focus:ring-orange-500">
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>
      <CustomInput v-model="newJob.notes" label="Catatan" type="textarea" placeholder="Detail tambahan..." id="notes" />
      <button type="submit" :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md transition-all">
        {{ loading ? 'Memproses...' : 'Tambah Pelacakan' }}
      </button>
    </form>
  </div>
</template>
