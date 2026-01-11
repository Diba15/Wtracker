import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API Helper Functions untuk CRUD operations

/**
 * GET: Mengambil semua data pekerjaan
 * @param {string} userId - ID user untuk filter data
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const fetchJobs = async (userId) => {
  try {
    let query = supabase
      .from('work_tables')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by user_id jika userId diberikan
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('Error fetching jobs:', err)
    return { data: null, error: err }
  }
}

/**
 * POST: Menambah data pekerjaan baru
 * @param {Object} jobData - Data pekerjaan yang akan ditambahkan
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const createJob = async (jobData) => {
  try {
    const { data, error } = await supabase
      .from('work_tables')
      .insert([jobData])
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('Error creating job:', err)
    return { data: null, error: err }
  }
}

/**
 * PATCH: Update data pekerjaan
 * @param {string} jobId - ID pekerjaan yang akan diupdate
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const updateJob = async (jobId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('work_tables')
      .update(updateData)
      .eq('id', jobId)
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('Error updating job:', err)
    return { data: null, error: err }
  }
}

/**
 * DELETE: Hapus data pekerjaan
 * @param {string} jobId - ID pekerjaan yang akan dihapus
 * @returns {Promise<{error: Error|null}>}
 */
export const deleteJob = async (jobId) => {
  try {
    const { error } = await supabase
      .from('work_tables')
      .delete()
      .eq('id', jobId)

    if (error) throw error
    return { error: null }
  } catch (err) {
    console.error('Error deleting job:', err)
    return { error: err }
  }
}
