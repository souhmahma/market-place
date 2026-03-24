import { useEffect, useState } from 'react'
import { getMyShop, createShop, updateMyShop } from '../../api/shops'
import { getProducts, deleteProduct } from '../../api/products'
import { Link } from 'react-router-dom'

export default function MyShop() {
  const [shop, setShop]       = useState(null)
  const [products, setProducts] = useState([])
  const [form, setForm]       = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    getMyShop()
      .then(({ data }) => {
        setShop(data)
        setForm({ name: data.name, description: data.description })
      })
      .catch(() => setShop(null))
      .finally(() => setLoading(false))

    getProducts().then(({ data }) => setProducts(data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const { data } = await createShop(form)
    setShop(data)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { data } = await updateMyShop(form)
    setShop(data)
    setEditing(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await deleteProduct(id)
    setProducts(products.filter((p) => p.id !== id))
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  // Pas encore de boutique → formulaire de création
  if (!shop) return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Créer ma boutique</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 space-y-4">
        <input
          placeholder="Nom de la boutique"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Créer la boutique
        </button>
      </form>
    </div>
  )

  const STATUS_COLORS = {
    pending : 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    banned  : 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header boutique */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <p className="text-gray-500 mt-1">{shop.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[shop.status]}`}>
              {shop.status}
            </span>
            <button
              onClick={() => setEditing(!editing)}
              className="text-blue-600 hover:underline text-sm"
            >
              Modifier
            </button>
          </div>
        </div>

        {/* Formulaire modification */}
        {editing && (
          <form onSubmit={handleUpdate} className="mt-4 space-y-3 border-t pt-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </form>
        )}
      </div>

      {/* Produits */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mes Produits</h2>
        <Link
          to="/vendor/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500 text-sm">{product.price}€ — Stock : {product.stock}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[product.status]}`}>
                {product.status}
              </span>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}