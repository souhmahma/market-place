import { useEffect, useState } from 'react'
import api from '../api/axios'
import useAuth from '../hooks/useAuth'

export default function Dashboard() {
  const { user }          = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user) return
    const url = {
      admin    : '/dashboard/admin/',
      vendor   : '/dashboard/vendor/',
      moderator: '/dashboard/moderator/',
    }[user.role]

    if (url) api.get(url).then(({ data }) => setStats(data))
  }, [user])

  if (!stats) return <div className="text-center mt-20">Chargement...</div>

  // Dashboard Vendeur
  if (user.role === 'vendor') return (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Ma Boutique — {stats.shop}</h1>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Commandes"           value={stats.stats.total_orders} />
      <StatCard label="Revenus"             value={`${stats.stats.total_revenue}€`} />
      <StatCard label="Produits approuvés"  value={stats.stats.approved_products} color="green" />
      <StatCard label="Produits en attente" value={stats.stats.pending_products}  color="yellow" />
    </div>
  </div>
)

  // Dashboard Admin
  if (user.role === 'admin') return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Utilisateurs"  value={stats.user_stats.total_users} />
        <StatCard label="Commandes"     value={stats.order_stats.paid_orders} />
        <StatCard label="Revenus"       value={`${stats.order_stats.total_revenue}€`} />
        <StatCard label="Commissions"   value={`${stats.order_stats.total_commission}€`} />
      </div>
    </div>
  )

  // Dashboard Modérateur
  if (user.role === 'moderator') return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Modérateur</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Boutiques en attente" value={stats.pending.shops} />
        <StatCard label="Produits en attente"  value={stats.pending.products} />
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className="text-3xl font-bold text-blue-600">{value}</p>
      <p className="text-gray-500 mt-1 text-sm">{label}</p>
    </div>
  )
}