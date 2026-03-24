import api from './axios'

export const getCart        = ()       => api.get('/orders/cart/')
export const addToCart      = (data)   => api.post('/orders/cart/', data)
export const clearCart      = ()       => api.delete('/orders/cart/')
export const removeCartItem = (id)     => api.delete(`/orders/cart/${id}/delete/`)
export const checkout       = ()       => api.post('/orders/checkout/')
export const getOrders      = ()       => api.get('/orders/')
export const getOrderDetail = (id)     => api.get(`/orders/${id}/`)