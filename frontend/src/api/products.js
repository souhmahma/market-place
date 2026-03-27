import api from './axios'

export const getProducts = (page = 1, pageSize = 10) =>
  api.get(`/products/?page=${page}&page_size=${pageSize}`)
export const createProduct    = (data)     => api.post('/products/create/', data)
export const updateProduct    = (id, data) => api.patch(`/products/${id}/`, data)
export const deleteProduct    = (id)       => api.delete(`/products/${id}/`)
export const moderateProduct  = (id, data) => api.patch(`/products/${id}/moderate/`, data)
export const getCategories    = ()         => api.get('/products/categories/')
export const getPendingProducts = () => api.get('/products/pending/')