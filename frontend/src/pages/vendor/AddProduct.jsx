import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct, getCategories } from '../../api/products'
import api from '../../api/axios'

export default function AddProduct() {
  const [form, setForm]             = useState({
    name: '', description: '', price: '', stock: '', category: ''
  })
  const [image, setImage]           = useState(null)
  const [preview, setPreview]       = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const navigate                    = useNavigate()

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Utiliser FormData pour envoyer l'image
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => formData.append(key, val))
      if (image) formData.append('image', image)

      await api.post('/products/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/vendor/shop')
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ajouter un produit</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">

        {/* Upload image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image du produit
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-40 object-cover rounded" />
            ) : (
              <div className="text-gray-400">
                <p className="text-4xl mb-2">📷</p>
                <p className="text-sm">Cliquer pour ajouter une image</p>
              </div>
            )}
            <input
              type="file" accept="image/*"
              className="hidden" id="image-upload"
              onChange={handleImage}
            />
          </div>
          <label
            htmlFor="image-upload"
            className="mt-2 block text-center text-blue-600 text-sm cursor-pointer hover:underline"
          >
            Choisir une image
          </label>
        </div>

        <input
          name="name" placeholder="Nom du produit"
          value={form.name} onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description" placeholder="Description"
          value={form.description} onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="price" type="number" placeholder="Prix (€)"
          value={form.price} onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="stock" type="number" placeholder="Stock"
          value={form.stock} onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="category" value={form.category} onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </form>
    </div>
  )
}