export default function StatCard({ label, value, color = 'blue' }) {
  const colors = {
    blue  : 'text-blue-600',
    green : 'text-green-600',
    yellow: 'text-yellow-600',
    red   : 'text-red-600',
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-gray-500 mt-1 text-sm">{label}</p>
    </div>
  )
}