const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface Experience {
  id: number
  company: string
  role: string
  description_en: string
  description_pt: string
  start_date: string
  end_date: string | null
  location: string
  order: number
}

export interface Project {
  id: number
  title: string
  description_en: string
  description_pt: string
  tech_stack: string[]
  live_url: string | null
  repo_url: string | null
  image_url: string | null
  type: 'freelance' | 'personal' | 'professional'
  featured: boolean
  order: number
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// Public API
export const api = {
  getExperiences: () => request<Experience[]>('/api/experiences'),
  getProjects: () => request<Project[]>('/api/projects'),
  sendContact: (data: ContactForm) =>
    request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Admin API
export const adminApi = {
  login: (username: string, password: string) =>
    request<{ access_token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Experiences
  getExperiences: () => request<Experience[]>('/api/admin/experiences'),
  createExperience: (data: Omit<Experience, 'id'>) =>
    request<Experience>('/api/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExperience: (id: number, data: Partial<Experience>) =>
    request<Experience>(`/api/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteExperience: (id: number) =>
    request<void>(`/api/admin/experiences/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request<Project[]>('/api/admin/projects'),
  createProject: (data: Omit<Project, 'id'>) =>
    request<Project>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: Partial<Project>) =>
    request<Project>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),
}
