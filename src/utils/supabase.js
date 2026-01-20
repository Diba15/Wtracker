import { createClient } from '@supabase/supabase-js'

// 1. Inisialisasi Supabase (Hanya untuk keperluan AUTH)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Konfigurasi URL API Elysia Anda (Sesuaikan dengan URL Vercel Backend Anda)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Helper untuk mendapatkan Header Authorization (Bearer Token)
 */
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

/**
 * GET: Mengambil semua data pekerjaan melalui API Elysia
 */
export const fetchJobs = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: 'GET',
      headers
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Gagal mengambil data')

    return { data, error: null }
  } catch (err) {
    console.error('Error fetching jobs:', err)
    return { data: null, error: err }
  }
}

/**
 * POST: Menambah data pekerjaan baru melalui API Elysia
 */
export const createJob = async (jobData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(jobData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Gagal menambah data')

    return { data: [data], error: null }
  } catch (err) {
    console.error('Error creating job:', err)
    return { data: null, error: err }
  }
}

/**
 * PATCH: Update data pekerjaan melalui API Elysia
 */
export const updateJob = async (jobId, updateData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Gagal update data')

    return { data: [data], error: null }
  } catch (err) {
    console.error('Error updating job:', err)
    return { data: null, error: err }
  }
}

/**
 * DELETE: Hapus data pekerjaan melalui API Elysia
 */
export const deleteJob = async (jobId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
      method: 'DELETE',
      headers
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Gagal menghapus data')

    return { error: null }
  } catch (err) {
    console.error('Error deleting job:', err)
    return { error: err }
  }
}
