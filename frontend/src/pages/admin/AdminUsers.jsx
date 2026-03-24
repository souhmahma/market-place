import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/users/')
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (id, role) => {
    await api.patch(`/auth/users/${id}/`, { role })
    setUsers(users.map((u) => u.id === id ? { ...u, role } : u))
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  const ROLE_COLORS = {
    admin    : 'bg-purple-100 text-purple-700',
    moderator: 'bg-blue-100 text-blue-700',
    vendor   : 'bg-green-100 text-green-700',
    customer : 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion Utilisateurs</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Utilisateur</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Rôle</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.username}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}