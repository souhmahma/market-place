export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">❌</p>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Paiement annulé</h1>
        <p className="text-gray-500 mb-2">Le paiement n'a pas été effectué.</p>
        <p className="text-green-600 mb-6">✅ Vos articles sont toujours dans votre panier.</p>
        <div className="flex gap-4 justify-center">
          
          <a  href="/cart"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour au panier
          </a>
          <a
            href="/products"
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            Continuer mes achats
          </a>
        </div>
      </div>
    </div>
  )
}