import api from './axios'

export const register = (data)        => api.post('/auth/register/', data)
export const login    = (data)        => api.post('/auth/login/', data)
export const getMe    = ()            => api.get('/auth/me/')
export const updateProfile = (data)   => api.patch('/auth/profile/', data)
export const updateAvatar = (formData) => api.patch('/auth/avatar/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})