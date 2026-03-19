import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('esamu_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('esamu_token')
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

export const authService = {
  login:  (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me:     () => api.get('/auth/me'),
}

export const heroService = {
  getAll: () => api.get('/hero-slides'),
  create: (data: FormData) =>
    api.post('/admin/hero-slides', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/hero-slides/${id}`),
}

export const examService = {
  getAll:   (params?: Record<string, string>) => api.get('/exams', { params }),
  getOne:   (id: number) => api.get(`/exams/${id}`),
  download: (id: number) => api.get(`/exams/${id}/download`, { responseType: 'blob' }),
  create:   (data: FormData) =>
    api.post('/admin/exams', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id: number, data: FormData) =>
    api.post(`/admin/exams/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:   (id: number) => api.delete(`/admin/exams/${id}`),
}

export const productService = {
  getAll:        (params?: Record<string, string>) => api.get('/products', { params }),
  getOne:        (slug: string) => api.get(`/products/${slug}`),
  getCategories: () => api.get('/products/categories'),
  create: (data: FormData) =>
    api.post('/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) =>
    api.post(`/admin/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
}

export const orderService = {
  create: (data: {
    name: string
    phone_number: string
    items: { product_id: number; quantity: number }[]
  }) => api.post('/orders', data),
  adminGetAll: (page = 1) => api.get(`/admin/orders?page=${page}`),
}

export const blogService = {
  getAll: (params?: Record<string, string>) => api.get('/blog', { params }),
  getOne: (id: number) => api.get(`/blog/${id}`),
  create: (data: FormData) =>
    api.post('/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) =>
    api.post(`/admin/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/blog/${id}`),
}

export const teamService = {
  getAll: () => api.get('/team'),
  create: (data: FormData) =>
    api.post('/admin/team', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) =>
    api.post(`/admin/team/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/team/${id}`),
}

export const galleryService = {
  getAll:        (category?: string) =>
    api.get('/gallery', { params: category ? { category } : {} }),
  getCategories: () => api.get('/gallery/categories'),
  upload: (data: FormData) =>
    api.post('/admin/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/gallery/${id}`),
}

export const cmsService = {
  getPage:      (slug: string) => api.get(`/pages/${slug}`),
  getPages:     () => api.get('/admin/pages'),
  createPage:   (data: object) => api.post('/admin/pages', data),
  updatePage:   (id: number, data: object) => api.put(`/admin/pages/${id}`, data),
  deletePage:   (id: number) => api.delete(`/admin/pages/${id}`),
  getSettings:  () => api.get('/admin/settings'),
  saveSettings: (data: object) => api.post('/admin/settings', data),
  contact:      (data: object) => api.post('/contact', data),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
}

export const eventService = {
  getAll: (params?: Record<string, string>) => api.get('/events', { params }),
  getOne: (id: number) => api.get(`/events/${id}`),
  // IMPORTANT: do NOT set Content-Type manually for FormData in the browser.
  // Axios/browser will set the correct multipart boundary automatically.
  create: (data: FormData) => api.post('/admin/events', data),
  update: (id: number, data: FormData) => api.post(`/admin/events/${id}`, data),
  delete: (id: number) => api.delete(`/admin/events/${id}`),
  like: (id: number) => api.post(`/events/${id}/like`),
  comment: (id: number, payload: { name: string; body: string }) =>
    api.post(`/events/${id}/comments`, payload),
  likeComment: (eventId: number, commentId: number) =>
    api.post(`/events/${eventId}/comments/${commentId}/like`),
  replyToComment: (eventId: number, commentId: number, payload: { name: string; body: string }) =>
    api.post(`/events/${eventId}/comments/${commentId}/replies`, payload),
}

export const projectService = {
  getAll: (params?: Record<string, string>) => api.get('/projects', { params }),
  create: (data: FormData) =>
    api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const adminProjectService = {
  getAll: (params?: Record<string, string>) => api.get('/admin/projects', { params }),
  approve: (id: number) => api.post(`/admin/projects/${id}/approve`),
  reject: (id: number) => api.post(`/admin/projects/${id}/reject`),
  delete: (id: number) => api.delete(`/admin/projects/${id}`),
}

export const analyticsService = {
  trackVisit: (path: string) =>
    api.post('/analytics/visit', { path }),
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const partnerService = {
  getAll: () => api.get('/partners'),
  create: (data: FormData) =>
    api.post('/admin/partners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/admin/partners/${id}`),
}
