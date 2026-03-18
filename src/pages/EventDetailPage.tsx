import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventService } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface EventComment {
  id: number
  name: string
  body: string
  created_at: string
  likes_count?: number
  replies?: EventComment[]
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
  const [replyingTo, setReplyingTo] = useState<EventComment | null>(null)
  const [replyBody, setReplyBody] = useState('')

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

  const handleLikeComment = async (commentId: number) => {
    if (!id) return
    try {
      await eventService.likeComment(Number(id), commentId)
      setEvent(prev => prev
        ? {
            ...prev,
            comments: (prev.comments ?? []).map(c =>
              c.id === commentId
                ? { ...c, likes_count: (c.likes_count ?? 0) + 1 }
                : c
            ),
          }
        : prev)
    } catch {
      // ignore errors for now
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !replyingTo || !replyBody.trim()) return
    try {
      const name = user?.name ?? 'Student'
      await eventService.replyToComment(Number(id), replyingTo.id, {
        name,
        body: replyBody.trim(),
      })
      // optimistic local update (flat replies list)
      setEvent(prev =>
        prev
          ? {
              ...prev,
              comments: (prev.comments ?? []).map(c =>
                c.id === replyingTo.id
                  ? {
                      ...c,
                      replies: [
                        ...(c.replies ?? []),
                        {
                          id: Date.now(),
                          name,
                          body: replyBody.trim(),
                          created_at: new Date().toISOString(),
                        },
                      ],
                    }
                  : c
              ),
            }
          : prev
      )
      setReplyBody('')
      setReplyingTo(null)
    } catch {
      // ignore for now
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
            <div className="w-full bg-black/5">
              <img
                src={
                  event.image_path
                    ? `/api/storage/uploads/${event.image_path}`
                    : '/esamu-logo.jpeg'
                }
                alt={event.title}
                className="w-full max-h-[420px] object-cover md:object-contain bg-black"
              />
            </div>

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
                {/* Share actions */}
                <button
                  type="button"
                  onClick={() => {
                    const url = window.location.href
                    const text = `${event.title} — ${event.description?.slice(0, 120) ?? ''}`
                    if (navigator.share) {
                      navigator
                        .share({ title: event.title, text, url })
                        .catch(() => {})
                    } else {
                      const wa = `https://wa.me/?text=${encodeURIComponent(`${event.title}\n${url}`)}`
                      window.open(wa, '_blank')
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="16" />
                  </svg>
                  Share
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
                    <div key={c.id} className="bg-white border border-gray-100 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                          {c.name}{' '}
                          <span className="text-gray-400">
                            · {new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleLikeComment(c.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-crimson-600"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21s-5-3.33-8-6.64C2 12.35 2 9.5 4 7.5 5-3.5 9 6 12 9c3-3 7-6.5 8-1.5 2 2 2 4.85 0 6.86C17 17.67 12 21 12 21z" />
                          </svg>
                          <span>{c.likes_count ?? 0}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{c.body}</p>
                      {/* Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="mt-2 space-y-1 pl-3 border-l border-gray-100">
                          {c.replies.map(r => (
                            <div key={r.id}>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-gray-500">
                                {r.name}{' '}
                                <span className="text-gray-400">
                                  · {new Date(r.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                                </span>
                              </p>
                              <p className="text-[11px] text-gray-700 leading-relaxed">{r.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(c)
                          setReplyBody('')
                        }}
                        className="font-mono text-[9px] uppercase tracking-wider text-gray-400 hover:text-crimson-600"
                      >
                        Reply
                      </button>
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
          {replyingTo && (
            <form onSubmit={handleReply} className="space-y-2 border-t border-gray-100 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                Replying to {replyingTo.name}
              </p>
              <textarea
                className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-crimson-500 transition-colors"
                rows={2}
                placeholder="Write a reply…"
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!replyBody.trim()}
                  className="flex-1 bg-gray-900 text-white py-2 font-mono text-[10px] uppercase tracking-wider hover:bg-crimson-700 disabled:opacity-60 transition-colors"
                >
                  Post Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </aside>
        </div>
      </section>
    </main>
  )
}

