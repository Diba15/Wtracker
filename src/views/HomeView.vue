<script setup>
import { ref, computed } from 'vue'
import CustomInput from '@/components/CustomInput.vue'

// Sample data - replace with actual data source
const jobs = ref([
  { id: 1, company: 'PT. ABC', url: 'https://www.abc.com', date: '2024-01-15', status: 'applied', notes: 'Melamar posisi Frontend Developer' },
  { id: 2, company: 'PT. XYZ', url: 'https://www.xyz.com', date: '2024-01-16', status: 'interview', notes: 'Interview tahap 1' },
  { id: 3, company: 'PT. DEF', url: 'https://www.def.com', date: '2024-01-17', status: 'pending', notes: 'Menunggu konfirmasi' },
  { id: 4, company: 'PT. GHI', url: 'https://www.ghi.com', date: '2024-01-18', status: 'applied', notes: 'Melamar posisi Backend Developer' },
  { id: 5, company: 'PT. JKL', url: 'https://www.jkl.com', date: '2024-01-19', status: 'rejected', notes: 'Tidak memenuhi kualifikasi' },
  { id: 6, company: 'PT. MNO', url: 'https://www.mno.com', date: '2024-01-20', status: 'interview', notes: 'Interview tahap 2' },
  { id: 7, company: 'PT. PQR', url: 'https://www.pqr.com', date: '2024-01-21', status: 'applied', notes: 'Melamar posisi Full Stack Developer' },
  { id: 8, company: 'PT. STU', url: 'https://www.stu.com', date: '2024-01-22', status: 'pending', notes: 'Menunggu review CV' },
  { id: 9, company: 'PT. VWX', url: 'https://www.vwx.com', date: '2024-01-23', status: 'hired', notes: 'Diterima!' },
  { id: 10, company: 'PT. YZA', url: 'https://www.yza.com', date: '2024-01-24', status: 'applied', notes: 'Melamar posisi DevOps Engineer' },
  { id: 11, company: 'PT. BCD', url: 'https://www.bcd.com', date: '2024-01-25', status: 'interview', notes: 'Interview tahap 1' },
  { id: 12, company: 'PT. EFG', url: 'https://www.efg.com', date: '2024-01-26', status: 'pending', notes: 'Menunggu feedback' },
  { id: 13, company: 'PT. HIJ', url: 'https://www.hij.com', date: '2024-01-27', status: 'rejected', notes: 'Posisi sudah terisi' },
  { id: 14, company: 'PT. KLM', url: 'https://www.klm.com', date: '2024-01-28', status: 'applied', notes: 'Melamar posisi UI/UX Designer' },
  { id: 15, company: 'PT. NOP', url: 'https://www.nop.com', date: '2024-01-29', status: 'interview', notes: 'Interview tahap 3' },
  { id: 16, company: 'PT. QRS', url: 'https://www.qrs.com', date: '2024-01-30', status: 'pending', notes: 'Menunggu keputusan' },
  { id: 17, company: 'PT. TUV', url: 'https://www.tuv.com', date: '2024-01-31', status: 'applied', notes: 'Melamar posisi Mobile Developer' },
  { id: 18, company: 'PT. WXY', url: 'https://www.wxy.com', date: '2024-02-01', status: 'hired', notes: 'Diterima sebagai Mobile Developer' },
  { id: 19, company: 'PT. ZAB', url: 'https://www.zab.com', date: '2024-02-02', status: 'rejected', notes: 'Tidak cocok dengan budaya perusahaan' },
  { id: 20, company: 'PT. CDE', url: 'https://www.cde.com', date: '2024-02-03', status: 'interview', notes: 'Interview final' },
  { id: 21, company: 'PT. FGH', url: 'https://www.fgh.com', date: '2024-02-04', status: 'pending', notes: 'Menunggu konfirmasi interview' },
  { id: 22, company: 'PT. IJK', url: 'https://www.ijk.com', date: '2024-02-05', status: 'applied', notes: 'Melamar posisi Data Scientist' },
])

const currentPage = ref(1)
const itemsPerPage = 10

// Edit modal state
const showEditModal = ref(false)
const editingJob = ref(null)
const editForm = ref({
  company: '',
  url: '',
  date: '',
  status: 'pending',
  notes: '',
})

// Delete confirmation state
const showDeleteModal = ref(false)
const jobToDelete = ref(null)

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

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    applied: 'Applied',
    interview: 'Interview',
    rejected: 'Rejected',
    hired: 'Hired',
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Edit functions
const openEditModal = (job) => {
  editingJob.value = job
  editForm.value = {
    company: job.company,
    url: job.url,
    date: job.date,
    status: job.status,
    notes: job.notes,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingJob.value = null
  editForm.value = {
    company: '',
    url: '',
    date: '',
    status: 'pending',
    notes: '',
  }
}

const saveEdit = () => {
  if (editingJob.value) {
    const index = jobs.value.findIndex((j) => j.id === editingJob.value.id)
    if (index !== -1) {
      jobs.value[index] = {
        ...jobs.value[index],
        ...editForm.value,
      }
    }
    closeEditModal()
  }
}

// Delete functions
const openDeleteModal = (job) => {
  jobToDelete.value = job
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  jobToDelete.value = null
}

const confirmDelete = () => {
  if (jobToDelete.value) {
    const index = jobs.value.findIndex((j) => j.id === jobToDelete.value.id)
    if (index !== -1) {
      jobs.value.splice(index, 1)
      // Adjust current page if needed
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    }
    closeDeleteModal()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <form action="" class="flex flex-col gap-4 bg-gray-800 p-4 rounded-md">
      <CustomInput label="Nama Perusahaan" type="text" placeholder="Masukkan nama perusahaan" id="company-name" />
      <CustomInput label="URL Lowongan Kerja" type="text" placeholder="Masukkan URL lowongan kerja" id="job-url" />
      <CustomInput label="Tanggal Lamar" type="date" placeholder="Masukkan tanggal lamar" id="apply-date" />
      <select id="status"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 bg-gray-800">
        <option value="pending">Pending</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
        <option value="hired">Hired</option>
      </select>
      <CustomInput label="Catatan" type="textarea" placeholder="Masukkan catatan" id="notes" />
      <button type="submit" class="bg-orange-500 text-white px-4 py-2 rounded-md">Tambah</button>
    </form>

    <div class="w-full bg-gray-800 p-6 rounded-md shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white">Daftar Lowongan Kerja</h2>
        <span class="text-sm text-gray-400">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, jobs.length) }}
          dari {{ jobs.length }} pekerjaan
        </span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-700">
        <table class="w-full">
          <thead class="bg-gray-700/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Nama Perusahaan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                URL Lowongan Kerja
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Tanggal Lamar
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Catatan
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="(job, index) in paginatedJobs" :key="job.id"
              class="hover:bg-gray-700/50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {{ job.company }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-300">
                <a :href="job.url" target="_blank" rel="noopener noreferrer"
                  class="text-blue-400 hover:text-blue-300 hover:underline truncate block max-w-xs" :title="job.url">
                  {{ job.url }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(job.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="getStatusBadgeClass(job.status)">
                  {{ getStatusLabel(job.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300 max-w-xs">
                <p class="truncate" :title="job.notes">{{ job.notes }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(job)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span class="ml-1">Edit</span>
                  </button>
                  <button @click="openDeleteModal(job)"
                    class="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="ml-1">Hapus</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          ]">
            Sebelumnya
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          ]">
            Selanjutnya
          </button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">Halaman</span>
          <div class="flex gap-1">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]">
              {{ page }}
            </button>
          </div>
          <span class="text-sm text-gray-400">dari {{ totalPages }}</span>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeEditModal">
      <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">Edit Pekerjaan</h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEdit" class="flex flex-col gap-4">
            <CustomInput v-model="editForm.company" label="Nama Perusahaan" type="text"
              placeholder="Masukkan nama perusahaan" id="edit-company-name" />
            <CustomInput v-model="editForm.url" label="URL Lowongan Kerja" type="text"
              placeholder="Masukkan URL lowongan kerja" id="edit-job-url" />
            <CustomInput v-model="editForm.date" label="Tanggal Lamar" type="date" placeholder="Masukkan tanggal lamar"
              id="edit-apply-date" />
            <div>
              <label for="edit-status" class="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select id="edit-status" v-model="editForm.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 bg-gray-700 text-white">
                <option value="pending">Pending</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
            <CustomInput v-model="editForm.notes" label="Catatan" type="textarea" placeholder="Masukkan catatan"
              id="edit-notes" />
            <div class="flex gap-3 justify-end mt-4">
              <button type="button" @click="closeEditModal"
                class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button type="submit"
                class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeDeleteModal">
      <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">Konfirmasi Hapus</h3>
            <button @click="closeDeleteModal" class="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mb-6">
            <p class="text-gray-300 mb-2">
              Apakah Anda yakin ingin menghapus pekerjaan ini?
            </p>
            <div class="bg-gray-700 p-3 rounded-md">
              <p class="text-white font-medium">{{ jobToDelete?.company }}</p>
              <p class="text-gray-400 text-sm mt-1">{{ jobToDelete?.url }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
              Batal
            </button>
            <button @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
