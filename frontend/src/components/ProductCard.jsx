import { useState } from 'react'
import { addToCart } from '../api/orders'
import useAuth from '../hooks/useAuth'

export default function ProductCard({ product }) {
  const { user }         = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleAddToCart = async () => {
    if (!user) return alert('Connectez-vous pour acheter')
    setLoading(true)
    try {
      await addToCart({ product_id: product.id, quantity })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      alert("Erreur lors de l'ajout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
          📦
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{product.shop_name}</p>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>

        {/* Stock */}
        <p className={`text-xs mt-2 ${product.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>
          {product.stock < 5
            ? `⚠️ Plus que ${product.stock} en stock !`
            : `✅ En stock (${product.stock})`
          }
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-blue-600 font-bold text-xl">{product.price}€</span>

          {/* Sélecteur quantité +/- */}
          {user?.role === 'customer' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                >
                  −
                </button>
                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition
                  ${added
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}
              >
                {added ? '✓ Ajouté !' : loading ? '...' : '🛒'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
