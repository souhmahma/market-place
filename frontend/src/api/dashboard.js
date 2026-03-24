import api from './axios'

export const getVendorDashboard    = () => api.get('/dashboard/vendor/')
export const getAdminDashboard     = () => api.get('/dashboard/admin/')
export const getModeratorDashboard = () => api.get('/dashboard/moderator/')