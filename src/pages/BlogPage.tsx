import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogService } from '../services/api'
import { BlogPost } from '../types'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />
}

// ─── Blog List ─────────────────────────────────────────────────────
export function BlogPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [draft,   setDraft]   = useState('')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { page: String(page) }
    if (search) params.q = search
    blogService.getAll(params)
      .then(res => { setPosts(res.data.data); setTotal(res.data.meta.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search])

  const lastPage = Math.ceil(total / 12)

  return (
    <main className="pt-20 min-h-screen bg-white">
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Community</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight mb-3">Blog & News</h1>
          <p className="text-gray-500 text-sm">Events, study resources, and updates from the ESA-MU community.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search */}
        <div className="flex gap-0 mb-10 max-w-md">
          <input className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-crimson-400 transition-colors"
            placeholder="Search posts..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(draft); setPage(1) } }}
          />
          <button onClick={() => { setSearch(draft); setPage(1) }}
            className="px-4 bg-gray-950 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-crimson-800 transition-colors">
            Search
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white">
                <Skeleton className="h-44 rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {posts.map((post, i) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="bg-white group hover:-translate-y-1 transition-transform duration-200 block">
                <div className="h-44 bg-gray-950 flex items-center justify-center relative border-b-2 border-crimson-700 overflow-hidden">
                  {post.featured_image
                    ? <img src={`/api/storage/uploads/${post.featured_image}`} alt={post.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300" />
                    : <img src="/IMG_6351.JPG" alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300" />
                  }
                </div>
                <div className="p-6">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t.id} className="font-mono text-[9px] text-crimson-700 border border-crimson-200 px-2 py-0.5 uppercase tracking-wider">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-display font-bold text-base text-gray-900 leading-snug mb-2 group-hover:text-crimson-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center font-mono text-[10px] text-gray-400 pt-3 border-t border-gray-100">
                    <span>{post.author_name}</span>
                    <span>{new Date(post.published_at).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>
                </div>
              </Link>
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
      </div>
    </main>
  )
}

// ─── Blog Post Detail ─────────────────────────────────────────────
export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const [post,    setPost]    = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    if (!id) return
    blogService.getOne(Number(id))
      .then(res => setPost(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <main className="pt-28 min-h-screen bg-white max-w-3xl mx-auto px-6 py-12 space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-48 mt-4" />
      <div className="space-y-3 mt-8">
        {Array(6).fill(0).map((_, i) => <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />)}
      </div>
    </main>
  )

  if (error || !post) return (
    <main className="pt-28 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">Post not found</p>
        <Link to="/blog" className="font-mono text-xs text-crimson-700 uppercase tracking-wider hover:underline">← Back to Blog</Link>
      </div>
    </main>
  )

  const paragraphs = post.content.split('\n\n')

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="flex items-center gap-2 font-mono text-xs text-crimson-500 uppercase tracking-wider mb-6 hover:text-crimson-400 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Blog
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(t => (
                <span key={t.id} className="font-mono text-[9px] text-crimson-500 border border-crimson-800/50 px-2 py-0.5 uppercase tracking-wider">
                  {t.name}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-black text-white tracking-tight mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 bg-crimson-800 flex items-center justify-center font-display font-bold text-white text-xs">
              {post.author_name?.charAt(0) ?? 'E'}
            </div>
            <span className="font-mono text-xs text-gray-500">{post.author_name}</span>
            <span className="font-mono text-xs text-gray-600">·</span>
            <span className="font-mono text-xs text-gray-500">
              {new Date(post.published_at).toLocaleDateString('en-KE', { day:'numeric', month:'long', year:'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {post.featured_image && (
          <img src={`/api/storage/uploads/${post.featured_image}`} alt={post.title}
            className="w-full h-64 object-cover mb-10 border border-gray-100" />
        )}

        <div className="space-y-5">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## '))
              return <h2 key={i} className="font-display text-2xl font-bold text-gray-900 mt-10 mb-4 tracking-tight">{para.replace('## ', '')}</h2>
            if (para.startsWith('# '))
              return <h1 key={i} className="font-display text-3xl font-bold text-gray-900 mt-10 mb-4 tracking-tight">{para.replace('# ', '')}</h1>
            if (para.match(/^\d+\. /)) {
              const items = para.split('\n').filter(Boolean)
              return (
                <ol key={i} className="list-decimal list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
                  {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s/, '')}</li>)}
                </ol>
              )
            }
            return <p key={i} className="text-gray-700 text-sm leading-relaxed">{para}</p>
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-gray-950">
          <h4 className="font-display font-bold text-white mb-2">Access more resources</h4>
          <p className="text-sm text-gray-500 mb-5">Download past papers from the ESA-MU Exam Bank, or browse the Marketplace.</p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/exam-bank"
              className="inline-flex items-center gap-2 bg-crimson-800 text-white px-6 py-3 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 transition-colors">
              Exam Bank
            </Link>
            <Link to="/marketplace"
              className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-gray-500 transition-colors">
              Marketplace
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
