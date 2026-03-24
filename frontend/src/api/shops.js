import api from './axios'

export const getShops       = ()       => api.get('/shops/')
export const createShop     = (data)   => api.post('/shops/create/', data)
export const getMyShop      = ()       => api.get('/shops/me/')
export const updateMyShop   = (data)   => api.patch('/shops/me/', data)
export const moderateShop   = (id, data) => api.patch(`/shops/${id}/moderate/`, data)
export const getPendingShops = () => api.get('/shops/pending/')