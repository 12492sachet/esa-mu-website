import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { teamService, galleryService, galleryService as gs, cmsService } from '../services/api'
import { TeamMember, GalleryImage, GalleryCategory } from '../types'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />
}

// ─── About ───────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <main className="pt-20 min-h-screen bg-white">
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Who We Are</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight">About ESA-MU</h1>
        </div>
      </div>

      {/* Mission / Vision split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
        <div className="bg-white p-10 md:p-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-600 uppercase tracking-widest">Our Mission</span>
          </div>
          <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight leading-snug mb-6">
            Empowering engineering students through community, knowledge, and opportunity.
          </h2>
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>The Engineering Students' Association of Moi University (ESA-MU) supports every student in the School of Engineering across Civil, Electrical, Mechanical, Chemical, and all other disciplines.</p>
            <p>We build platforms that give students access to academic resources, a peer-driven marketplace, career events, and a strong alumni network. ESA-MU is run by students, for students.</p>
          </div>
        </div>
        <div className="bg-gray-950 p-10 md:p-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Our Vision</span>
          </div>
          <h3 className="font-display text-xl font-black text-white tracking-tight leading-snug mb-6">
            To be Africa's most impactful engineering student community.
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every engineering student at Moi University — regardless of background — deserves access to the tools, networks, and mentorship needed to become a world-class engineer.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800">
        {[['2019','Founded'],['280+','Active Members'],['130+','Past Papers'],['5','Departments']].map(([v, l]) => (
          <div key={l} className="bg-gray-950 p-8 hover:border-b-2 hover:border-crimson-700 transition-all">
            <div className="font-display text-4xl font-black text-white tracking-tight">{v}</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600 mt-2">{l}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="py-16 max-w-7xl mx-auto px-6 text-center">
        <h3 className="font-display text-3xl font-black text-gray-900 tracking-tight mb-4">Ready to get involved?</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Reach out to our team or start using our platform today.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/contact"
            className="inline-flex items-center gap-2 bg-gray-950 text-white px-8 py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-800 transition-colors">
            Contact Us
          </Link>
          <Link to="/team"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-8 py-4 font-mono text-xs uppercase tracking-wider hover:border-gray-400 transition-colors">
            Meet the Team
          </Link>
        </div>
      </div>
    </main>
  )
}

export function TeamPage() {
  const [members,  setMembers]  = useState<TeamMember[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    teamService.getAll()
      .then(res => setMembers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="pt-20 min-h-screen bg-white">
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Leadership</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight mb-3">Our Team</h1>
          <p className="text-gray-500 text-sm">Student leaders elected to serve the engineering community at Moi University.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-7 space-y-3 text-center">
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, i) => (
              <div
                key={member.id}
                className="bg-white overflow-hidden rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="h-72 bg-gray-100 overflow-hidden rounded-t-2xl">
                  {member.profile_image ? (
                    <img
                      src={`/api/storage/uploads/${member.profile_image}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>

                <div className="p-8 text-center">
                  <p className="font-display font-black text-gray-900 tracking-tight text-2xl">
                    {member.name}
                  </p>
                  <p className="text-gray-500 text-base mt-2">{member.role}</p>

                  <div className="flex justify-center gap-5 mt-8 text-gray-900">
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="inline-flex items-center justify-center hover:text-crimson-800 transition-colors"
                      >
                        <FaInstagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="inline-flex items-center justify-center hover:text-crimson-800 transition-colors"
                      >
                        <FaLinkedinIn className="w-5 h-5" />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        className="inline-flex items-center justify-center hover:text-crimson-800 transition-colors"
                      >
                        <FaXTwitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────
export function GalleryPage() {
  const [images,     setImages]     = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [active,     setActive]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    gs.getCategories().then(res => setCategories(res.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    galleryService.getAll(active || undefined)
      .then(res => setImages(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [active])

  return (
    <main className="pt-20 min-h-screen bg-white">
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Moments</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight">Gallery</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          <button onClick={() => setActive('')}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${!active ? 'bg-gray-950 text-white border-gray-950' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActive(c.slug)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${active === c.slug ? 'bg-gray-950 text-white border-gray-950' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className={`aspect-square ${i === 0 ? 'col-span-2 row-span-2' : ''} rounded-none`} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <div
              className="relative overflow-hidden group cursor-pointer col-span-2 row-span-2"
              style={{ minHeight: '280px' }}
            >
              <img
                src="/IMG_6351.JPG"
                alt="ESA-MU"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-crimson-900/0 group-hover:bg-crimson-900/50 transition-all flex items-end">
                <div className="p-3">
                  <p className="font-mono text-[10px] text-white uppercase tracking-wider">ESA-MU Moments</p>
                  <p className="font-mono text-[9px] text-white/60 uppercase">Gallery</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={img.id}
                className={`relative overflow-hidden group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : 'aspect-square'}`}
                style={{ minHeight: i === 0 ? '280px' : '0' }}>
                {img.image_path
                  ? <img src={`/api/storage/uploads/${img.image_path}`} alt={img.title || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                }
                <div className="absolute inset-0 bg-crimson-900/0 group-hover:bg-crimson-900/60 transition-all flex items-end">
                  <div className="p-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <p className="font-mono text-[10px] text-white uppercase tracking-wider">{img.title}</p>
                    <p className="font-mono text-[9px] text-white/60 uppercase">{img.category_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// ─── Contact ─────────────────────────────────────────────────────
export function ContactPage() {
  const [form,    setForm]    = useState({ name:'', email:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await cmsService.contact(form)
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-20 min-h-screen bg-white">
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Get In Touch</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight mb-3">Contact Us</h1>
          <p className="text-gray-500 text-sm">Have a question, suggestion, or want to collaborate?</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-gray-100">
          {/* Info */}
          <div className="md:col-span-2 bg-gray-950 p-10 space-y-8">
            {[
              {
                label: 'Address',
                val: 'School of Engineering\nMoi University, Eldoret, Kenya',
                icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
              },
              {
                label: 'Email',
                val: 'esamu@mu.ac.ke',
                icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
              },
              {
                label: 'Hours',
                val: 'Mon – Fri\n8:00 AM – 5:00 PM EAT',
                icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="w-9 h-9 bg-crimson-900/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-crimson-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">{item.icon}</svg>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-3 bg-white p-10">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-14 h-14 bg-emerald-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-gray-900 tracking-tight mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Name</label>
                      <input className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-crimson-400 transition-colors"
                        placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Email</label>
                      <input className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-crimson-400 transition-colors"
                        type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                    <input className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-crimson-400 transition-colors"
                      placeholder="What is this about?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Message</label>
                    <textarea className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-crimson-400 transition-colors resize-none"
                      rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                  </div>
                  {error && <p className="font-mono text-[10px] text-crimson-700 uppercase tracking-wider">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-gray-950 text-white py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</> : 'Send Message →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
