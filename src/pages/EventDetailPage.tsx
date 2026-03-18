import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventService } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface EventComment {
  id: number
  name: string
  body: string
  created_at: string
}

interface EventDetail {
  id: number
  title: string
  description: string
  category?: string
  location?: string
  event_date?: string
  event_time?: string
  image_path?: string
  likes_count?: number
  comments?: EventComment[]
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [commentBody, setCommentBody] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    eventService.getOne(Number(id))
      .then(res => setEvent(res.data.data as EventDetail))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    if (!id || likeLoading) return
    setLikeLoading(true)
    try {
      await eventService.like(Number(id))
      setEvent(prev => prev
        ? { ...prev, likes_count: (prev.likes_count ?? 0) + 1 }
        : prev)
    } catch {
      // ignore like errors for now
    } finally {
      setLikeLoading(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !commentBody.trim() || commentLoading) return
    setCommentLoading(true)
    try {
      const name = user?.name ?? 'Student'
      const res = await eventService.comment(Number(id), { name, body: commentBody.trim() })
      const newComment = (res.data.data ?? null) as EventComment | null
      setEvent(prev => prev
        ? {
            ...prev,
            comments: [
              ...(prev.comments ?? []),
              newComment ?? {
                id: Date.now(),
                name,
                body: commentBody.trim(),
                created_at: new Date().toISOString(),
              },
            ],
          }
        : prev)
      setCommentBody('')
    } catch {
      // optionally show error toast later
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 bg-gray-100 animate-pulse" />
          <div className="h-10 bg-gray-100 animate-pulse" />
          <div className="h-40 bg-gray-100 animate-pulse" />
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-white pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">
            Event not found
          </p>
          <Link
            to="/events"
            className="font-mono text-xs text-crimson-700 uppercase tracking-wider hover:underline"
          >
            ← Back to Events
          </Link>
        </div>
      </main>
    )
  }

  const date = event.event_date ? new Date(event.event_date) : null

  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest hover:text-crimson-700 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Events
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
          {/* Left: media + main content (stacks like Instagram on mobile) */}
          <article className="bg-white border border-gray-100">
            {event.image_path && (
              <div className="w-full bg-black/5">
                <img
                  src={`/api/storage/uploads/${event.image_path}`}
                  alt={event.title}
                  className="w-full max-h-[420px] object-cover md:object-contain bg-black"
                />
              </div>
            )}

            <div className="p-4 border-t border-gray-100 space-y-3">
              {/* Title + meta */}
              <div>
                <h1 className="font-display text-lg font-black text-gray-900 leading-snug md:text-xl">
                  {event.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-mono">
                  {date && (
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {date.toLocaleDateString('en-KE', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {event.event_time && ` · ${event.event_time}`}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                        <circle cx="12" cy="11" r="3" />
                      </svg>
                      {event.location}
                    </span>
                  )}
                  {event.category && (
                    <span className="inline-flex items-center px-2 py-1 bg-pink-50 text-crimson-700 uppercase tracking-wider text-[9px] font-semibold rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Like row (Instagram-style button under media) */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className="inline-flex items-center gap-2 text-sm text-crimson-700 hover:text-crimson-900 disabled:opacity-60"
                  type="button"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-5-3.33-8-6.64C2 12.35 2 9.5 4 7.5 5-3.5 9 6 12 9c3-3 7-6.5 8-1.5 2 2 2 4.85 0 6.86C17 17.67 12 21 12 21z" />
                  </svg>
                  <span className="font-mono text-[11px] uppercase tracking-widest">
                    {likeLoading ? 'Liking…' : `Like · ${event.likes_count ?? 0}`}
                  </span>
                </button>
              </div>

              {/* Description / caption */}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </article>

          {/* Right: comments column (drops below on mobile) */}
          <aside className="space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-3">
              Comments
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-100 p-3 bg-gray-50">
              {event.comments && event.comments.length > 0 ? (
                event.comments
                  .slice()
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((c) => (
                    <div key={c.id} className="bg-white border border-gray-100 p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        {c.name}{' '}
                        <span className="text-gray-400">
                          · {new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                        </span>
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">{c.body}</p>
                    </div>
                  ))
              ) : (
                <p className="text-[11px] text-gray-400 font-mono">
                  No comments yet. Be the first to respond.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleComment} className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Add your comment
            </p>
            <textarea
              className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-crimson-500 transition-colors"
              rows={3}
              placeholder="Share a question, feedback, or RSVP note…"
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
            />
            <button
              type="submit"
              disabled={commentLoading || !commentBody.trim()}
              className="w-full bg-crimson-800 text-white py-2.5 font-mono text-[10px] uppercase tracking-wider hover:bg-crimson-700 disabled:opacity-60 transition-colors"
            >
              {commentLoading ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        </aside>
        </div>
      </section>
    </main>
  )
}

