export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">✅</p>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Paiement réussi !</h1>
        <p className="text-gray-500 mb-6">Vous allez recevoir un email de confirmation</p>
        <a href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Voir mes commandes
        </a>
      </div>
    </div>
  )
}