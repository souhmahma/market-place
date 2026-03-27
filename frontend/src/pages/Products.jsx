import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import useAuth from '../hooks/useAuth'

export default function Products() {
  const { user }                  = useAuth()
  const navigate                  = useNavigate()
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filtered, setFiltered]   = useState([])

  // Bloquer vendeur/admin/modérateur
  useEffect(() => {
    if (user && ['vendor', 'admin', 'moderator'].includes(user.role)) {
      navigate(`/dashboard/${user.role}`)
    }
  }, [user])

  useEffect(() => {
    getProducts()
      .then(({ data }) => {
        setProducts(data)
        setFiltered(data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shop_name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(results)
  }, [search, products])

  if (loading) return <div className="text-center mt-20">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produits</h1>
        <input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}