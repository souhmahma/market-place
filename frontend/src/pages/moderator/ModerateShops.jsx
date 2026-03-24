import { useEffect, useState } from 'react'
import { getPendingShops, moderateShop } from '../../api/shops'

export default function ModerateShops() {
  const [shops, setShops]     = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPending = () => {
    setLoading(true)
    getPendingShops()
      .then(({ data }) => setShops(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPending() }, [])

  const handleModerate = async (id, status) => {
    await moderateShop(id, { status })
    fetchPending()
  }

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Boutiques en attente
        <span className="ml-3 bg-yellow-100 text-yellow-700 text-lg px-3 py-1 rounded-full">
          {shops.length}
        </span>
      </h1>

      {shops.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          Aucune boutique en attente 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{shop.name}</h3>
                  <p className="text-gray-500 text-sm">Vendeur : {shop.owner_username}</p>
                  <p className="text-gray-400 text-sm mt-1">{shop.description}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(shop.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleModerate(shop.id, 'approved')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  ✅ Approuver
                </button>
                <button
                  onClick={() => handleModerate(shop.id, 'rejected')}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 text-sm"
                >
                  ❌ Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}