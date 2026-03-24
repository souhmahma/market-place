import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Marketplace</h1>
        <p className="text-xl mb-8 text-blue-100">
          Achetez et vendez en toute confiance
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Voir les produits
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer un compte
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🛒', title: 'Achat sécurisé',    desc: 'Paiement sécurisé via Stripe' },
            { icon: '🏪', title: 'Vendeurs vérifiés', desc: 'Chaque boutique est validée par notre équipe' },
            { icon: '🚀', title: 'Livraison rapide',  desc: 'Expédition en 24-48h' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}