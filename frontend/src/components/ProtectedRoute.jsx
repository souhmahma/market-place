import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  // Non connecté → login
  if (!user) return <Navigate to="/login" />

  // Rôle non autorisé → accueil
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}