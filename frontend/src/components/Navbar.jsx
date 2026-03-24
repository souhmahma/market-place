import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">Marketplace</Link>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/products" className="text-gray-600 hover:text-blue-600">Produits</Link>

        {user?.role === 'customer' && <>
          <Link to="/cart"   className="text-gray-600 hover:text-blue-600">Panier</Link>
          <Link to="/orders" className="text-gray-600 hover:text-blue-600">Commandes</Link>
        </>}

        {user?.role === 'vendor' && <>
          <Link to="/vendor/shop"         className="text-gray-600 hover:text-blue-600">Ma boutique</Link>
          <Link to="/dashboard/vendor"    className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        </>}

        {user?.role === 'moderator' && <>
          <Link to="/moderator/shops"    className="text-gray-600 hover:text-blue-600">Boutiques</Link>
          <Link to="/moderator/products" className="text-gray-600 hover:text-blue-600">Produits</Link>
          <Link to="/dashboard/moderator" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        </>}

        {user?.role === 'admin' && <>
          <Link to="/admin/users"      className="text-gray-600 hover:text-blue-600">Utilisateurs</Link>
          <Link to="/dashboard/admin"  className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        </>}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Déconnexion
          </button>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"    className="text-gray-600 hover:text-blue-600">Connexion</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700">
              Inscription
            </Link>
          </div>
        )}
      {user && (
  <Link to="/profile" className="text-gray-600 hover:text-blue-600">
    {/* Avatar miniature */}
    {user.avatar_url ? (
      <img
        src={user.avatar_url}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover inline"
      />
    ) : (
      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold inline-flex items-center justify-center">
        {user.username?.[0]?.toUpperCase()}
      </span>
    )}
  </Link>
  )}
      </div>
    </nav>
  )
}