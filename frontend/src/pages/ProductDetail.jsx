import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts } from '../api/products'
import { addToCart } from '../api/orders'
import useAuth from '../hooks/useAuth'

export default function ProductDetail() {
  const { id }              = useParams()
  const { user }            = useAuth()
  const navigate            = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading]   = useState(true)
  const [added, setAdded]       = useState(false)

  useEffect(() => {
    getProducts()
      .then(({ data }) => {
        const found = data.find((p) => p.id === parseInt(id))
        if (!found) navigate('/')
        setProduct(found)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')  // ← redirect si non connecté
      return
    }
    try {
      await addToCart({ product_id: product.id, quantity })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      alert("Erreur lors de l'ajout")
    }
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>
  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 hover:underline mb-6 flex items-center gap-1"
      >
        ← Retour aux produits
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="md:w-1/2 p-8">
            <p className="text-blue-600 text-sm font-medium mb-2">
              {product.category_name}
            </p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-4">
              Vendu par <span className="font-medium">{product.shop_name}</span>
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Stock */}
            <p className={`text-sm mb-4 ${product.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>
              {product.stock === 0
                ? '❌ Rupture de stock'
                : product.stock < 5
                ? `⚠️ Plus que ${product.stock} en stock !`
                : `✅ En stock (${product.stock} disponibles)`
              }
            </p>

            {/* Prix */}
            <p className="text-4xl font-bold text-blue-600 mb-6">
              {product.price}€
            </p>

            {/* Quantité + Ajouter */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2 rounded-lg font-medium transition
                    ${added
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
                </button>
              </div>
            )}

            {/* Non connecté */}
            {!user && (
              <p className="text-gray-400 text-sm mt-4 text-center">
                <span
                  onClick={() => navigate('/login')}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Connectez-vous
                </span>{' '}
                pour acheter ce produit
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}