import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  // 🔥 style commun
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-4 py-1 rounded-lg"
      : "bg-gray-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"

  const textLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition"

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      <NavLink to="/" className="text-xl font-bold text-blue-600">
        Marketplace
      </NavLink>

      <div className="flex items-center gap-4 text-sm">

        {/* Produits */}
        {(!user || user.role === 'customer') && (
  <NavLink to="/products" className={linkClass}>
    Produits
  </NavLink>
)}

        {/* CUSTOMER */}
        {user?.role === 'customer' && <>
          <NavLink to="/cart" className={linkClass}>
            Panier
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Commandes
          </NavLink>
        </>}

        {/* VENDOR */}
        {user?.role === 'vendor' && <>
          <NavLink to="/vendor/shop" className={linkClass}>
            Ma boutique
          </NavLink>
          <NavLink to="/dashboard/vendor" className={linkClass}>
            Dashboard
          </NavLink>
        </>}

        {/* MODERATOR */}
        {user?.role === 'moderator' && <>
          <NavLink to="/moderator/shops" className={linkClass}>
            Boutiques En Attente
          </NavLink>
          <NavLink to="/moderator/products" className={linkClass}>
            Produits En Attente
          </NavLink>
          <NavLink to="/dashboard/moderator" className={linkClass}>
            Dashboard
          </NavLink>
        </>}

        {/* ADMIN */}
        {user?.role === 'admin' && <>
          <NavLink to="/admin/users" className={linkClass}>
            Utilisateurs
          </NavLink>
          <NavLink to="/dashboard/admin" className={linkClass}>
            Dashboard
          </NavLink>
        </>}

        {/* AUTH */}
        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Déconnexion
          </button>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login" className={linkClass}>
              Connexion
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Inscription
            </NavLink>
          </div>
        )}

        {/* PROFILE */}
        {user && (
          <NavLink to="/profile" className="flex items-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                {user.username?.[0]?.toUpperCase()}
              </span>
            )}
          </NavLink>
        )}

      </div>
    </nav>
  )
}