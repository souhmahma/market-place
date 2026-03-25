import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, removeCartItem, clearCart, checkout } from '../api/orders'

export default function Cart() {
  const [cart, setCart]     = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  const fetchCart = () => {
    getCart()
      .then(({ data }) => setCart(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId)
    fetchCart()
  }

  const handleClear = async () => {
    await clearCart()
    fetchCart()
  }

  const handleCheckout = async () => {
    try {
      const { data } = await checkout()
      // Rediriger vers Stripe
      window.location.href = data.checkout_url
    } catch {
      alert('Erreur lors du checkout')
    }
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>
  if (!cart || cart.cart_items.length === 0) return (
    <div className="text-center mt-20">
      <p className="text-gray-500 text-xl">Votre panier est vide</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mon Panier</h1>
        <button
          onClick={handleClear}
          className="text-red-500 hover:underline text-sm"
        >
          Vider le panier
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cart.cart_items.map((item) => (
  <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    {/* Image produit */}
    {item.product_image ? (
      <img
        src={item.product_image}
        alt={item.product_name}
        className="w-16 h-16 rounded-lg object-cover"
      />
    ) : (
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
        📦
      </div>
    )}
    <div className="flex-1">
      <p className="font-semibold">{item.product_name}</p>
      <p className="text-gray-500 text-sm">Quantité : {item.quantity}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-bold text-blue-600">{item.subtotal}€</span>
      <button
        onClick={() => handleRemove(item.id)}
        className="text-red-400 hover:text-red-600 text-sm"
      >
        Supprimer
      </button>
    </div>
  </div>
))}
      </div>

      {/* Total */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-2xl font-bold text-blue-600">{cart.total}€</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Payer avec Stripe
        </button>
      </div>
    </div>
  )
}