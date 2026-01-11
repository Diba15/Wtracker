<script setup>
import { ref, computed, onMounted } from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { fetchJobs, createJob, updateJob, deleteJob } from '@/utils/supabase'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

// State Utama
const jobs = ref([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// Form Tambah (New Job)
const newJob = ref({
  company_name: '',
  vacancy_url: '',
  apply_date: new Date().toISOString().split('T')[0],
  status: 'pending',
  notes: ''
})

// State Modal Edit
const showEditModal = ref(false)
const editingJob = ref(null)
const editForm = ref({
  company_name: '',
  vacancy_url: '',
  apply_date: '',
  status: 'pending',
  notes: '',
})

// State Modal Delete
const showDeleteModal = ref(false)
const jobToDelete = ref(null)

// --- FUNGSI SUPABASE ---

// 1. Ambil Data
const loadJobs = async () => {
  if (!user.value) return

  loading.value = true
  const { data, error } = await fetchJobs(user.value.id)

  if (error) {
    console.error('Gagal mengambil data:', error.message)
    alert('Gagal mengambil data: ' + error.message)
  } else {
    jobs.value = data || []
  }
  loading.value = false
}

// 2. Tambah Data
const addJob = async () => {
  if (!newJob.value.company_name) return alert('Nama perusahaan wajib diisi')
  if (!user.value) return alert('Anda harus login terlebih dahulu')

  loading.value = true
  const { data, error } = await createJob({ ...newJob.value, user_id: user.value.id })

  if (error) {
    alert('Gagal menambah: ' + error.message)
  } else {
    // Update local state agar tidak perlu refresh
    if (data && data[0]) {
      jobs.value.unshift(data[0])
    }
    // Reset form
    newJob.value = {
      company_name: '',
      vacancy_url: '',
      apply_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    }
  }
  loading.value = false
}

// 3. Update Data
const saveEdit = async () => {
  if (!editingJob.value) return

  loading.value = true
  const updateData = {
    company_name: editForm.value.company_name,
    vacancy_url: editForm.value.vacancy_url,
    apply_date: editForm.value.apply_date,
    status: editForm.value.status,
    notes: editForm.value.notes
  }

  const { data, error } = await updateJob(editingJob.value.id, updateData)

  if (error) {
    alert('Gagal update: ' + error.message)
  } else {
    // Update local state
    const index = jobs.value.findIndex((j) => j.id === editingJob.value.id)
    if (index !== -1 && data && data[0]) {
      jobs.value[index] = { ...jobs.value[index], ...data[0] }
    }
    closeEditModal()
  }
  loading.value = false
}

// 4. Hapus Data
const confirmDelete = async () => {
  if (!jobToDelete.value) return

  loading.value = true
  const { error } = await deleteJob(jobToDelete.value.id)

  if (error) {
    alert('Gagal menghapus: ' + error.message)
  } else {
    jobs.value = jobs.value.filter((j) => j.id !== jobToDelete.value.id)
    // Adjust pagination if needed
    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value)
    }
    closeDeleteModal()
  }
  loading.value = false
}

// Ambil data saat halaman dibuka
onMounted(loadJobs)

// --- LOGIKA UI & PAGINATION ---

const totalPages = computed(() => Math.ceil(jobs.value.length / itemsPerPage))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return jobs.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    interview: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    hired: 'bg-green-500/20 text-green-400 border-green-500/30',
  }
  return classes[status] || classes.pending
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const openEditModal = (job) => {
  editingJob.value = job
  editForm.value = {
    company_name: job.company_name,
    vacancy_url: job.vacancy_url,
    apply_date: job.apply_date,
    status: job.status,
    notes: job.notes,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingJob.value = null
}

const openDeleteModal = (job) => {
  jobToDelete.value = job
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  jobToDelete.value = null
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
          placeholder="Contoh: PT. Maju Jaya" />
        <CustomInput v-model="newJob.vacancy_url" label="URL Lowongan" type="text" placeholder="https://..." />
        <CustomInput v-model="newJob.apply_date" label="Tanggal Lamar" type="date" />
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
      <CustomInput v-model="newJob.notes" label="Catatan" type="textarea" placeholder="Detail tambahan..." />
      <button type="submit" :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md transition-all">
        {{ loading ? 'Memproses...' : 'Tambah Pelacakan' }}
      </button>
    </form>

    <!-- Tabel Daftar -->
    <div class="w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div class="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-white">Daftar Lowongan Kerja</h2>
        <span class="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
          Total: {{ jobs.length }} Data
        </span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-700">
        <table class="w-full text-left">
          <thead class="bg-gray-700/50 text-gray-300 text-xs uppercase">
            <tr>
              <th class="px-6 py-4">No</th>
              <th class="px-6 py-4">Perusahaan</th>
              <th class="px-6 py-4">Tanggal</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="py-10 text-gray-500">Memuat data dari database...</td>
            </tr>
            <tr v-else-if="jobs.length === 0" class="text-center">
              <td colspan="5" class="py-10 text-gray-500">Belum ada data pelacakan.</td>
            </tr>
            <tr v-for="(job, index) in paginatedJobs" :key="job.id" class="hover:bg-gray-700/30 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-white">{{ job.company_name }}</div>
                <a :href="job.vacancy_url" target="_blank"
                  class="text-xs text-blue-400 hover:underline truncate block max-w-[150px]">Link Lowongan</a>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300">
                {{ formatDate(job.apply_date) }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase"
                  :class="getStatusBadgeClass(job.status)">
                  {{ job.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="openEditModal(job)"
                    class="p-2 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="openDeleteModal(job)"
                    class="p-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50">Sebelumnnya</button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50">Selanjutnya</button>
        </div>
        <div class="flex gap-1">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="['px-3 py-1 rounded-md text-sm', currentPage === page ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modals (Edit & Delete) tetap menggunakan logika yang sama, hanya pastikan v-model diarahkan ke state yang benar -->
    <!-- [MODAL EDIT & DELETE DISINI...] -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-xl border border-gray-700 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Edit Data Lamaran</h3>
        <div class="grid grid-cols-1 gap-4">
          <CustomInput v-model="editForm.company_name" label="Nama Perusahaan" />
          <CustomInput v-model="editForm.vacancy_url" label="URL Lowongan" />
          <CustomInput v-model="editForm.apply_date" label="Tanggal" type="date" />
          <select v-model="editForm.status" class="w-full rounded-md p-3 bg-gray-700 text-white border-gray-600">
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
          <CustomInput v-model="editForm.notes" label="Catatan" type="textarea" />
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="closeEditModal" class="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
          <button @click="saveEdit" class="px-6 py-2 bg-blue-600 text-white rounded-md font-bold">Simpan
            Perubahan</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-sm border border-gray-700">
        <h3 class="text-lg font-bold text-white mb-2">Hapus Data?</h3>
        <p class="text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan. Hapus pelacakan untuk <b>{{
          jobToDelete?.company_name }}</b>?</p>
        <div class="flex justify-end gap-3">
          <button @click="closeDeleteModal" class="px-4 py-2 text-gray-400">Batal</button>
          <button @click="confirmDelete" class="px-6 py-2 bg-red-600 text-white rounded-md font-bold">Ya, Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>
