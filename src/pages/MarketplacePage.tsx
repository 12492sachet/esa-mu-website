import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/api'
import { Product, ProductCategory } from '../types'
import { useCart } from '../context/CartContext'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  Electronics: <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Instruments: <svg className="w-8 h-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><line x1="2" y1="22" x2="22" y2="2"/><line x1="6" y1="18" x2="18" y2="6"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Textbooks:   <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  'Safety Gear': <svg className="w-8 h-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
}

export default function MarketplacePage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [category,   setCategory]   = useState('')
  const [draft,      setDraft]      = useState('')
  const [search,     setSearch]     = useState('')
  const [sort,       setSort]       = useState('')
  const [addedId,    setAddedId]    = useState<number | null>(null)
  const { addItem, itemCount }      = useCart()

  const load = useCallback((cat: string, q: string, s: string, p: number) => {
    setLoading(true)
    const params: Record<string, string> = { page: String(p) }
    if (cat) params.category = cat
    if (q)   params.q        = q
    if (s)   { const [field, dir] = s.split('_'); params.sort = field; params.dir = dir.toUpperCase() }
    productService.getAll(params)
      .then(res => { setProducts(res.data.data); setTotal(res.data.meta.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(category, search, sort, page) }, [category, search, sort, page, load])

  useEffect(() => {
    productService.getCategories()
      .then(res => setCategories(res.data.data))
      .catch(() => {})
  }, [])

  const handleAdd = (product: Product) => {
    if (product.stock === 0) return
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1400)
  }

  const lastPage = Math.ceil(total / 12)

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-crimson-600" />
              <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Student Shop</span>
            </div>
            <h1 className="font-display text-4xl font-black text-white tracking-tight mb-3">Marketplace</h1>
            <p className="text-gray-500 text-sm">Engineering instruments, textbooks, and tools. Pay with M-Pesa.</p>
          </div>
          <Link to="/marketplace/cart"
            className="relative flex items-center gap-2 bg-crimson-800 text-white px-6 py-3 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
            View Cart
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-crimson-800 text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Search</div>
            <div className="flex gap-0">
              <input className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-crimson-400 transition-colors"
                placeholder="Product name..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setSearch(draft); setPage(1) } }}
              />
              <button onClick={() => { setSearch(draft); setPage(1) }}
                className="px-4 bg-gray-950 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-crimson-800 transition-colors">
                Go
              </button>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Category</div>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => { setCategory(''); setPage(1) }}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${!category ? 'bg-gray-950 text-white border-gray-950' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                All
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => { setCategory(c.slug); setPage(1) }}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${category === c.slug ? 'bg-gray-950 text-white border-gray-950' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Sort</div>
            <select
              className="border border-gray-200 px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-gray-400 bg-white"
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="">Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name A–Z</option>
            </select>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-6">
          {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white">
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-5 w-1/2 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {products.map(product => (
              <div key={product.id} className="bg-white group hover:bg-gray-50 transition-colors flex flex-col">
                {/* Image */}
                <div className="h-36 bg-gray-950 flex items-center justify-center relative overflow-hidden">
                  {product.image_path
                    ? <img src={`/api/storage/uploads/${product.image_path}`} alt={product.name}
                        className="w-full h-full object-cover opacity-70" />
                    : <div className="opacity-20">{CAT_ICONS[product.category_name ?? ''] ?? null}</div>
                  }
                  <span className="absolute top-2 left-2 font-mono text-[9px] bg-black/60 text-gray-300 px-2 py-0.5 uppercase tracking-wider">
                    {product.category_name}
                  </span>
                  {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider bg-black/60 px-2 py-1">Out of stock</span>
                    </div>
                  ) : product.stock <= 5 ? (
                    <span className="absolute top-2 right-2 font-mono text-[9px] bg-amber-900/80 text-amber-300 px-2 py-0.5 uppercase">
                      {product.stock} left
                    </span>
                  ) : null}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-crimson-800 transition-colors flex-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-display font-black text-lg text-gray-900">
                      KES {Number(product.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={product.stock === 0}
                      className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${
                        product.stock === 0
                          ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                          : addedId === product.id
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-gray-950 border-gray-950 text-white hover:bg-crimson-800 hover:border-crimson-800'
                      }`}>
                      {product.stock === 0 ? 'Sold out' : addedId === product.id ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center gap-2 mt-10 justify-center">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-gray-200 disabled:opacity-30 hover:border-gray-400 transition-colors">
              ← Prev
            </button>
            <span className="font-mono text-[10px] text-gray-500 px-4">Page {page} of {lastPage}</span>
            <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
              className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-gray-200 disabled:opacity-30 hover:border-gray-400 transition-colors">
              Next →
            </button>
          </div>
        )}

        {/* M-Pesa note */}
        <div className="mt-12 p-5 bg-emerald-950 border border-emerald-900 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div>
            <p className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">Pay with M-Pesa</p>
            <p className="text-xs text-emerald-700 mt-1">Add items to cart → enter Safaricom number → approve STK push. Instant confirmation.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
