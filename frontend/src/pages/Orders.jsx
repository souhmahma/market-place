import { useEffect, useState } from 'react'
import { getOrders } from '../api/orders'

const STATUS_COLORS = {
  pending  : 'bg-yellow-100 text-yellow-700',
  paid     : 'bg-green-100 text-green-700',
  shipped  : 'bg-blue-100 text-blue-700',
  delivered: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center mt-20">Chargement...</div>
  if (!orders.length) return (
    <div className="text-center mt-20 text-gray-500">Aucune commande</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Commande #{order.id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product_name} x{item.quantity}</span>
                  <span>{item.subtotal}€</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-blue-600">{order.total_amount}€</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}