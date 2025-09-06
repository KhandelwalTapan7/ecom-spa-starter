import { useEffect, useMemo, useState } from 'react'
import api from '../api'

export default function Home() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = useMemo(() => ['Electronics', 'Sports', 'Home'], [])

  async function load() {
    try {
      setError('')
      setLoading(true)
      const { data } = await api.get('/items', {
        params: { search, category, minPrice, maxPrice },
      })
      setItems(Array.isArray(data) ? data : data.items || [])
    } catch (e) {
      console.error('GET /items failed:', e)
      setError('Failed to load items')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-3 items-end mb-4">
        <div className="grow">
          <label className="block text-sm mb-1">Search</label>
          <input className="w-full border rounded px-3 py-2" value={search}
                 onChange={e=>setSearch(e.target.value)} placeholder="Search items..." />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select className="border rounded px-3 py-2" value={category}
                  onChange={e=>setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Min Price</label>
          <input type="number" className="border rounded px-3 py-2 w-28"
                 value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Price</label>
          <input type="number" className="border rounded px-3 py-2 w-28"
                 value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        </div>
        <button className="btn bg-black text-white" onClick={load}>Apply</button>
        <button className="btn" onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); load(); }}>Clear</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-3">{error}</div>}
      {loading ? <p>Loading…</p> : (
        items.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map(it => (
              <div key={it._id} className="card">
                <img src={it.imageUrl} alt={it.title} className="rounded-xl w-full h-48 object-cover"/>
                <div className="mt-3 font-semibold">{it.title}</div>
                <div className="text-sm text-gray-600">{it.description}</div>
                <div className="mt-2 font-bold">₹{it.price}</div>
              </div>
            ))}
          </div>
        ) : <p>No items found. Try adjusting filters.</p>
      )}
    </div>
  )
}
