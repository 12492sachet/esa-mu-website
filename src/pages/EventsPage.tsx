import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { eventService } from '../services/api'

export default function EventsPage() {
  const [events,   setEvents]   = useState<unknown[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const categories = ['All', 'Academic', 'Social', 'Sports', 'Career', 'Workshop', 'Other']

  useEffect(() => {
    eventService.getAll()
      .then(r => setEvents(r.data.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? events
    : (events as Record<string, string>[]).filter(e => e.category === filter)

  const catColor: Record<string, string> = {
    Academic:'bg-blue-50 text-blue-700', Social:'bg-purple-50 text-purple-700',
    Sports:'bg-green-50 text-green-700', Career:'bg-amber-50 text-amber-700',
    Workshop:'bg-orange-50 text-orange-700', Other:'bg-gray-100 text-gray-600',
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-crimson-950 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Engineering Students' Association — Moi University</p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Events</h1>
          <p className="text-gray-400 mt-4 max-w-lg">Academic forums, social mixers, career fairs, and more — all happening at ESA-MU.</p>
        </div>
      </section>

      {/* Filter */}
      <section className="border-b border-gray-100 bg-white sticky top-0 z-10 px-6">
        <div className="max-w-4xl mx-auto flex gap-1 overflow-x-auto py-3">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-wider px-4 py-1.5 transition-colors ${filter === c ? 'bg-crimson-800 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse h-28 bg-gray-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">No events found</p>
            <p className="text-gray-300 mt-2 text-sm">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(filtered as Record<string, string>[]).map((ev) => {
              const date = new Date(ev.event_date)
              const isPast = date < new Date()
              return (
                <Link
                  key={ev.id}
                  to={`/events/${ev.id}`}
                  className={`flex gap-5 p-5 border transition-all duration-300 card-hover ${isPast ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                >
                  {/* Date block */}
                  <div className={`flex-shrink-0 w-14 text-center pt-1 ${isPast ? 'opacity-40' : ''}`}>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">{date.toLocaleString('en', { month: 'short' })}</p>
                    <p className="font-display text-3xl font-black text-gray-900 leading-none">{date.getDate()}</p>
                    <p className="font-mono text-[9px] text-gray-400">{date.getFullYear()}</p>
                  </div>

                  {/* Divider */}
                  <div className={`w-px self-stretch ${isPast ? 'bg-gray-100' : 'bg-crimson-200'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className={`font-display font-black text-lg tracking-tight leading-tight ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>{ev.title}</h3>
                        <p className={`text-sm mt-1 line-clamp-2 ${isPast ? 'text-gray-300' : 'text-gray-500'}`}>{ev.description}</p>
                      </div>
                      <span className={`flex-shrink-0 font-mono text-[9px] px-2 py-1 font-semibold uppercase tracking-wider ${catColor[ev.category] ?? 'bg-gray-100 text-gray-600'}`}>{ev.category}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {ev.location}
                      </span>
                      {ev.event_time && (
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {ev.event_time}
                        </span>
                      )}
                      {isPast && <span className="font-mono text-[9px] text-gray-300 uppercase tracking-wider">Past event</span>}
                    </div>
                  </div>

                  {/* Cover image */}
                  {ev.image_path && (
                    <div className="flex-shrink-0 w-24 h-20 overflow-hidden hidden sm:block">
                      <img src={`/api/storage/uploads/${ev.image_path}`} alt="" className={`w-full h-full object-cover ${isPast ? 'grayscale opacity-50' : ''}`} />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
