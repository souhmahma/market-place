import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/auth/users/')
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Erreur chargement utilisateurs'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/auth/users/${id}/`, { role })
      setUsers(users.map((u) => u.id === id ? { ...u, role } : u))
    } catch {
      alert('Erreur lors du changement de rôle')
    }
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>
  if (error)   return <div className="text-center mt-20 text-red-500">{error}</div>
  if (!users.length) return <div className="text-center mt-20 text-gray-500">Aucun utilisateur</div>

  const ROLE_COLORS = {
    admin    : 'bg-purple-100 text-purple-700',
    moderator: 'bg-blue-100 text-blue-700',
    vendor   : 'bg-green-100 text-green-700',
    customer : 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Gestion Utilisateurs
        <span className="ml-3 bg-gray-100 text-gray-600 text-lg px-3 py-1 rounded-full">
          {users.length}
        </span>
      </h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Utilisateur</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Rôle actuel</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Changer rôle</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(user.date_joined).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}