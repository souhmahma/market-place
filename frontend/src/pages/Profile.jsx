import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { updateProfile, updateAvatar } from '../api/auth'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    username : user?.username || '',
    email    : user?.email    || '',
    phone    : user?.phone    || '',
    bio      : user?.bio      || '',
  })
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [preview, setPreview]   = useState(user?.avatar_url || null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await updateProfile(form)
      setSuccess('Profil mis à jour !')
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview immédiat
    setPreview(URL.createObjectURL(file))

    // Upload
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await updateAvatar(formData)
      setSuccess('Photo mise à jour !')
    } catch {
      setError("Erreur lors de l'upload")
    }
  }

  const ROLE_COLORS = {
    admin    : 'bg-purple-100 text-purple-700',
    moderator: 'bg-blue-100 text-blue-700',
    vendor   : 'bg-green-100 text-green-700',
    customer : 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      {/* Avatar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
          {/* Bouton upload */}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-blue-700">
            <span className="text-sm">+</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <p className="text-xl font-semibold">{user?.username}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user?.role]}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow p-6">
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
        {error   && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Infos compte */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-semibold text-lg mb-4">Informations du compte</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Membre depuis</span>
            <span className="font-medium">
              {new Date(user?.date_joined).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Rôle</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${ROLE_COLORS[user?.role]}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}