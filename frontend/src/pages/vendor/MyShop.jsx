import { useEffect, useState } from 'react'
import { getMyShop, createShop, updateMyShop } from '../../api/shops'
import { getProducts, deleteProduct, updateProduct } from '../../api/products'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function MyShop() {
  const [shop, setShop]           = useState(null)
  const [products, setProducts]   = useState([])
  const [form, setForm]           = useState({ name: '', description: '' })
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)  // 🆕
  const [productForm, setProductForm]       = useState({})    // 🆕

  const fetchProducts = () => {
    api.get('/products/?all=true')
      .then(({ data }) => setProducts(data))
      .catch(() => getProducts().then(({ data }) => setProducts(data)))
  }

  useEffect(() => {
    getMyShop()
      .then(({ data }) => {
        setShop(data)
        setForm({ name: data.name, description: data.description })
      })
      .catch(() => setShop(null))
      .finally(() => setLoading(false))

    fetchProducts()
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

  // 🆕 Ouvrir le formulaire de modification
  const handleEditProduct = (product) => {
    setEditingProduct(product.id)
    setProductForm({
      name        : product.name,
      description : product.description,
      price       : product.price,
      stock       : product.stock,
    })
  }

  // 🆕 Sauvegarder la modification
  const handleUpdateProduct = async (id) => {
    try {
      await updateProduct(id, productForm)
      setProducts(products.map((p) =>
        p.id === id ? { ...p, ...productForm } : p
      ))
      setEditingProduct(null)
    } catch {
      alert('Erreur lors de la modification')
    }
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>

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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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

  // Filtrer seulement les produits de cette boutique
  const myProducts = products.filter((p) => p.shop_name === shop.name)

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
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Sauvegarder
            </button>
          </form>
        )}
      </div>

      {/* Produits */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Mes Produits
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({myProducts.filter(p => p.status === 'approved').length} approuvés,{' '}
            {myProducts.filter(p => p.status === 'pending').length} en attente)
          </span>
        </h2>
        <Link
          to="/vendor/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className="space-y-3">
        {myProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-4">
              {/* Image */}
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">📦</div>
              )}

              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.price}€ — Stock : {product.stock}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[product.status]}`}>
                  {product.status}
                </span>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>

            {/* 🆕 Formulaire de modification inline */}
            {editingProduct === product.id && (
              <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                  <input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Prix (€)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <input
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={() => handleUpdateProduct(product.id)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    ✅ Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="border text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {myProducts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Aucun produit — <Link to="/vendor/products/add" className="text-blue-600 hover:underline">Ajouter un produit</Link>
          </div>
        )}
      </div>
    </div>
  )
}