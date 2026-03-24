import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home             from './pages/Home'
import Login            from './pages/Login'
import Register         from './pages/Register'
import Products         from './pages/Products'
import Cart             from './pages/Cart'
import Orders           from './pages/Orders'
import Dashboard        from './pages/Dashboard'
import MyShop           from './pages/vendor/MyShop'
import AddProduct       from './pages/vendor/AddProduct'
import ModerateShops    from './pages/moderator/ModerateShops'
import ModerateProducts from './pages/moderator/ModerateProducts'
import AdminUsers       from './pages/admin/AdminUsers'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />

          {/* Customer */}
          <Route path="/cart" element={
            <ProtectedRoute roles={['customer']}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute roles={['customer']}>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Vendor */}
          <Route path="/dashboard/vendor" element={
            <ProtectedRoute roles={['vendor']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/vendor/shop" element={
            <ProtectedRoute roles={['vendor']}>
              <MyShop />
            </ProtectedRoute>
          } />
          <Route path="/vendor/products/add" element={
            <ProtectedRoute roles={['vendor']}>
              <AddProduct />
            </ProtectedRoute>
          } />

          {/* Moderator */}
          <Route path="/dashboard/moderator" element={
            <ProtectedRoute roles={['moderator']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/moderator/shops" element={
            <ProtectedRoute roles={['moderator']}>
              <ModerateShops />
            </ProtectedRoute>
          } />
          <Route path="/moderator/products" element={
            <ProtectedRoute roles={['moderator']}>
              <ModerateProducts />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />

<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}