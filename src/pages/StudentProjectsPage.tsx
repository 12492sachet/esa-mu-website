import { useState, useEffect, useRef } from 'react'
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaGlobe } from 'react-icons/fa6'
import api from '../services/api'
import { DEPARTMENTS } from './DepartmentsPage'

interface Project {
  id: number
  title: string
  description: string
  student_name: string
  student_reg: string
  department: string
  year_of_study: string
  tech_stack: string
  project_url?: string
  github_url?: string
  image_path?: string
  linkedin_url?: string
  created_at: string
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />
}

const DEPT_OPTS = ['All', ...DEPARTMENTS.map(d => d.short)]
const YEAR_OPTS = ['All', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5']

// ─── Submit Modal ─────────────────────────────────────────────────
function SubmitModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', student_name: '', student_reg: '',
    department: DEPARTMENTS[0].short, year_of_study: 'Y1',
    tech_stack: '', project_url: '', github_url: '', linkedin_url: '',
  })

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (fileRef.current?.files?.[0]) fd.append('image', fileRef.current.files[0])
      await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      onSuccess()
      onClose()
    } catch {
      setErr('Failed to submit. Make sure all required fields are filled.')
    } finally { setSaving(false) }
  }

  const inp = "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-crimson-500 transition-colors"
  const sel = "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-crimson-500 bg-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <p className="font-display font-black text-gray-900 tracking-tight">Submit Your Project</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none">×</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && <p className="text-red-500 text-xs font-mono bg-red-50 p-3">{err}</p>}

          <div className="p-3 bg-crimson-50 border-l-2 border-crimson-700">
            <p className="font-mono text-[10px] uppercase tracking-widest text-crimson-700">
              Projects are reviewed by admins before going live.
            </p>
          </div>

          {/* Project details */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Project Title *</label>
            <input className={inp} value={form.title} onChange={f('title')} required placeholder="e.g. Solar-Powered Water Pump" />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Description *</label>
            <textarea className={inp} rows={4} value={form.description} onChange={f('description')} required
              placeholder="What does your project do? What problem does it solve?" />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Tech Stack / Tools Used</label>
            <input className={inp} value={form.tech_stack} onChange={f('tech_stack')}
              placeholder="e.g. Arduino, Python, SolidWorks, AutoCAD..." />
          </div>

          {/* Student details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Your Full Name *</label>
              <input className={inp} value={form.student_name} onChange={f('student_name')} required />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Reg. Number *</label>
              <input className={inp} value={form.student_reg} onChange={f('student_reg')} required placeholder="ENG/…" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Department *</label>
              <select className={sel} value={form.department} onChange={f('department')}>
                {DEPARTMENTS.map(d => <option key={d.slug} value={d.short}>{d.short} — {d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Year of Study *</label>
              <select className={sel} value={form.year_of_study} onChange={f('year_of_study')}>
                {YEAR_OPTS.filter(y => y !== 'All').map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">GitHub URL</label>
            <input className={inp} type="url" value={form.github_url} onChange={f('github_url')} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Live / Demo URL</label>
            <input className={inp} type="url" value={form.project_url} onChange={f('project_url')} placeholder="https://..." />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Your LinkedIn (optional)</label>
            <input className={inp} type="url" value={form.linkedin_url} onChange={f('linkedin_url')} placeholder="https://linkedin.com/in/..." />
          </div>

          {/* Cover image */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">Cover Image (optional)</label>
            <input type="file" ref={fileRef} accept="image/*" className="text-sm text-gray-600" />
            <p className="font-mono text-[9px] text-gray-400 mt-1">A photo of your project, schematic, or screenshot.</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-crimson-800 text-white py-3 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 disabled:opacity-60 transition-colors">
              {saving ? 'Submitting…' : 'Submit Project →'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 border border-gray-200 font-mono text-xs text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const dept = DEPARTMENTS.find(d => d.short === project.department)
  const tags = project.tech_stack?.split(',').map(t => t.trim()).filter(Boolean) ?? []

  return (
    <div className="bg-white border border-gray-100 hover:border-crimson-200 transition-all duration-300 group overflow-hidden card-hover anim-scale">
      {/* Cover image or placeholder */}
      <div className="h-40 overflow-hidden bg-gray-50 relative">
        {project.image_path ? (
          <img src={`/api/storage/uploads/${project.image_path}`} alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: dept?.bg ?? '#fdf2f2' }}>
            <div style={{ color: dept?.color ?? '#8B1A1A' }}>
              {dept?.icon ?? (
                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              )}
            </div>
          </div>
        )}
        {/* Year badge */}
        <span className="absolute top-2 right-2 font-mono text-[9px] uppercase tracking-wider bg-white/90 text-gray-700 px-2 py-0.5">
          {project.year_of_study}
        </span>
      </div>

      <div className="p-5">
        {/* Dept + name */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5"
            style={{ background: dept?.bg ?? '#fdf2f2', color: dept?.color ?? '#8B1A1A' }}>
            {project.department}
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-gray-900 leading-snug mb-2 group-hover:text-crimson-800 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{project.description}</p>

        {/* Tech stack tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map(tag => (
              <span key={tag} className="font-mono text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 uppercase tracking-wide">
                {tag}
              </span>
            ))}
            {tags.length > 4 && <span className="font-mono text-[9px] text-gray-400">+{tags.length - 4}</span>}
          </div>
        )}

        {/* Author + links */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-body font-semibold text-xs text-gray-800">{project.student_name}</p>
            <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wide">{project.student_reg}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-crimson-700 transition-colors" title="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {project.project_url && (
              <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-crimson-700 transition-colors" title="Live Demo">
                <FaGlobe className="w-4 h-4" />
              </a>
            )}
            {project.linkedin_url && (
              <a href={project.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-crimson-700 transition-colors" title="LinkedIn">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
export default function StudentProjectsPage() {
  const [projects,  setProjects]  = useState<Project[]>([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [deptFilter, setDeptFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/projects')
      .then(r => setProjects(r.data.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = projects.filter(p => {
    const deptOk = deptFilter === 'All' || p.department === deptFilter
    const yearOk = yearFilter === 'All' || p.year_of_study === yearFilter
    const searchOk = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.student_name.toLowerCase().includes(search.toLowerCase()) ||
      p.tech_stack?.toLowerCase().includes(search.toLowerCase())
    return deptOk && yearOk && searchOk
  })

  return (
    <main className="min-h-screen bg-white pt-20">
      {modal && <SubmitModal onClose={() => setModal(false)} onSuccess={load} />}

      {/* Header */}
      <section className="bg-crimson-950 py-16 px-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-crimson-400 mb-3">ESA-MU · School of Engineering</p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Student Projects</h1>
            <p className="text-gray-400 mt-3 max-w-lg">A living archive of engineering projects built by MU students — from final year projects to side builds.</p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-crimson-700 text-white px-7 py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-600 transition-colors">
            + Submit Your Project
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-6">
        <div className="max-w-5xl mx-auto py-3 flex flex-wrap items-center gap-4">
          {/* Search */}
          <input
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-crimson-400 transition-colors min-w-[200px] flex-1"
            placeholder="Search projects, students, tools…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {/* Department filter */}
          <div className="flex gap-1 flex-wrap">
            {DEPT_OPTS.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border transition-all ${deptFilter === d ? 'bg-crimson-800 text-white border-crimson-800' : 'border-gray-200 text-gray-500 hover:border-crimson-300 hover:text-crimson-700'}`}>
                {d}
              </button>
            ))}
          </div>
          {/* Year filter */}
          <div className="flex gap-1">
            {YEAR_OPTS.map(y => (
              <button key={y} onClick={() => setYearFilter(y)}
                className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 border transition-all ${yearFilter === y ? 'bg-crimson-800 text-white border-crimson-800' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                {y}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-6">
          {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-2">No projects found</p>
            <button onClick={() => setModal(true)} className="font-mono text-xs text-crimson-700 hover:text-crimson-900 uppercase tracking-wider underline underline-offset-2">
              Be the first to submit one →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      {/* CTA bottom */}
      <section className="bg-crimson-50 border-t border-crimson-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight">Built something cool?</h2>
            <p className="text-gray-500 text-sm mt-1">Document it here — inspire the next generation of MU engineers.</p>
          </div>
          <button onClick={() => setModal(true)}
            className="inline-flex items-center gap-2 bg-crimson-800 text-white px-8 py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 transition-colors">
            Submit Your Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </section>
    </main>
  )
}
