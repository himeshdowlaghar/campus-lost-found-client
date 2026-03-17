import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Feed() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  useEffect(() => {
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/api/items`, {
      params: { type: filter, search }
    })
    .then(res => {
      setItems(Array.isArray(res.data) ? res.data : [])
      setLoading(false)
    })
    .catch(() => {
      setItems([])
      setLoading(false)
    })
  }, [filter, search])

  async function resolve(id) {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/items/${id}/resolve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setItems(items.filter(i => i._id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-6 flex-wrap">
        <input placeholder="Search items..."
          className="border rounded-lg px-3 py-2 flex-1 min-w-0 text-sm"
          onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setFilter('')}
          className={`px-3 py-2 border rounded-lg text-sm font-medium ${
            filter === '' ? 'bg-black text-white' : 'text-gray-600'
          }`}>All</button>
        <button onClick={() => setFilter('lost')}
          className={`px-3 py-2 border rounded-lg text-sm font-medium ${
            filter === 'lost' ? 'bg-red-500 text-white' : 'text-red-500'
          }`}>Lost</button>
        <button onClick={() => setFilter('found')}
          className={`px-3 py-2 border rounded-lg text-sm font-medium ${
            filter === 'found' ? 'bg-green-500 text-white' : 'text-green-600'
          }`}>Found</button>
      </div>

      {loading && (
        <p className="text-center text-gray-400 mt-12">Loading...</p>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">No items yet. Be the first to post!</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map(item => (
          <div key={item._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
            {item.imageUrl && (
              <img src={item.imageUrl} className="w-full h-48 object-cover rounded-lg mb-3" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.type.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="font-semibold text-lg">{item.title}</h2>
            {item.location && <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>}
            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
            <p className="text-xs text-gray-400 mt-3">
                Posted by {item.postedBy?.name}
                </p>
                <div className="flex gap-3 mt-1">
                {item.contactEmail && (
                    <a href={`mailto:${item.contactEmail}`}
                    className="text-xs text-blue-500 hover:underline">
                    📧 {item.contactEmail}
                    </a>
                )}
                {item.contactPhone && (
                    <a href={`tel:${item.contactPhone}`}
                    className="text-xs text-green-500 hover:underline">
                    📞 {item.contactPhone}
                    </a>
                )}
                </div>
            {user && item.postedBy?._id === user.id && (
              <button onClick={() => resolve(item._id)}
                className="mt-3 text-xs border rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-50">
                Mark as resolved ✓
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}