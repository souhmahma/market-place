import { useEffect, useState } from 'react'
import { getPendingProducts, moderateProduct } from '../../api/products'

export default function ModerateProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchPending = () => {
    setLoading(true)
    getPendingProducts()
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPending() }, [])

  const handleModerate = async (id, status) => {
    await moderateProduct(id, { status })
    fetchPending()
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Produits en attente
        <span className="ml-3 bg-yellow-100 text-yellow-700 text-lg px-3 py-1 rounded-full">
          {products.length}
        </span>
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          Aucun produit en attente 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
  <div key={product.id} className="bg-white rounded-xl shadow p-6">
    <div className="flex gap-4">
      {/* Image */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
          📦
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm">Boutique : {product.shop_name}</p>
            <p className="text-gray-500 text-sm">Prix : {product.price}€</p>
            <p className="text-gray-400 text-sm mt-1">{product.description}</p>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleModerate(product.id, 'approved')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
          >
            ✅ Approuver
          </button>
          <button
            onClick={() => handleModerate(product.id, 'rejected')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 text-sm"
          >
            ❌ Rejeter
          </button>
        </div>
      </div>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  )
}