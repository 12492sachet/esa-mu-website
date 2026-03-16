import { useState, useEffect, useCallback } from 'react'
import { examService, downloadBlob } from '../services/api'
import { Exam } from '../types'

type Filter = { type: string; year: string; sem: string; q: string }

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />
}

const TYPE_CLS: Record<string, string> = {
  CAT:        'bg-amber-50 text-amber-800 border border-amber-200',
  Main:       'bg-crimson-50 text-crimson-800 border border-crimson-200',
  Assignment: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
}

export default function ExamBankPage() {
  const [exams,    setExams]    = useState<Exam[]>([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [dlId,     setDlId]     = useState<number | null>(null)
  const [filters,  setFilters]  = useState<Filter>({ type: '', year: '', sem: '', q: '' })
  const [draft,    setDraft]    = useState('')

  const load = useCallback((f: Filter, p: number) => {
    setLoading(true)
    const params: Record<string, string> = { page: String(p) }
    if (f.type) params.type = f.type
    if (f.year) params.year = f.year
    if (f.sem)  params.sem  = f.sem
    if (f.q)    params.q    = f.q
    examService.getAll(params)
      .then(res => {
        setExams(res.data.data)
        setTotal(res.data.meta.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(filters, page) }, [filters, page, load])

  const setFilter = (key: keyof Filter, val: string) => {
    const next = { ...filters, [key]: filters[key] === val ? '' : val }
    setFilters(next)
    setPage(1)
  }

  const search = () => { setFilters(f => ({ ...f, q: draft })); setPage(1) }

  const handleDownload = async (exam: Exam) => {
    setDlId(exam.id)
    try {
      const res = await examService.download(exam.id)
      downloadBlob(res.data, `${exam.title}.pdf`)
    } catch { /* silent */ } finally { setDlId(null) }
  }

  const lastPage = Math.ceil(total / 12)

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">Academic Resources</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight mb-3">Exam Bank</h1>
          <p className="text-gray-500 text-sm max-w-lg">Browse and download past papers, CATs, and assignments across all years and semesters — free.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[220px]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Search</div>
            <div className="flex gap-0">
              <input
                className="flex-1 border border-gray-200 px-4 py-2.5 text-sm font-body focus:outline-none focus:border-crimson-400 transition-colors"
                placeholder="Title or subject..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
              />
              <button onClick={search}
                className="px-4 bg-gray-950 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-crimson-800 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Type */}
          {[
            { key: 'type' as const, label: 'Type',     opts: ['CAT','Main','Assignment'] },
            { key: 'year' as const, label: 'Year',     opts: ['Y1','Y2','Y3','Y4'] },
            { key: 'sem'  as const, label: 'Semester', opts: ['Sem1','Sem2'] },
          ].map(({ key, label, opts }) => (
            <div key={key}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">{label}</div>
              <div className="flex gap-1">
                {opts.map(o => (
                  <button key={o} onClick={() => setFilter(key, o)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${
                      filters[key] === o
                        ? 'bg-gray-950 text-white border-gray-950'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results count */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-6">
          {loading ? 'Loading...' : `${total} paper${total !== 1 ? 's' : ''} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-6 space-y-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-10 h-10 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">No papers match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-[9px] font-bold px-2 py-1 uppercase tracking-wider ${TYPE_CLS[exam.type]}`}>
                    {exam.type}
                  </span>
                  <span className="font-mono text-[9px] text-gray-400 uppercase">
                    {exam.year_of_study} · {exam.semester}
                  </span>
                </div>
                <h3 className="font-body font-semibold text-sm text-gray-900 leading-snug mb-1">{exam.title}</h3>
                <p className="font-mono text-[10px] text-crimson-700 uppercase tracking-wider mb-2">{exam.subject}</p>
                {exam.description && (
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{exam.description}</p>
                )}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDownload(exam)}
                    disabled={dlId === exam.id}
                    className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      dlId === exam.id ? 'text-gray-400 cursor-wait' : 'text-crimson-700 hover:text-crimson-900'
                    }`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {dlId === exam.id ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center gap-2 mt-10 justify-center">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-gray-200 disabled:opacity-30 hover:border-gray-400 transition-colors">
              ← Prev
            </button>
            <span className="font-mono text-[10px] text-gray-500 px-4">
              Page {page} of {lastPage}
            </span>
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
