import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// ESA-MU logo colors: maroon #8B1A1A, gold #C8900A, light pink bg
export interface Department {
  slug: string
  short: string
  name: string
  color: string
  bg: string
  icon: React.ReactNode
  imagePath?: string
  hod: string
  hodTitle: string
  description: string
  focusAreas: string[]
  programmes: string[]
}

export const DEPARTMENTS: Department[] = [
  {
    slug: 'mechanical-engineering',
    short: 'MPE',
    name: 'Mechanical and Production Engineering',
    color: '#8B1A1A',
    bg: '#fdf2f2',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    hod: 'Dr. Stephen Talai', hodTitle: 'Head of Department',
    description: 'The Mechanical Engineering department trains engineers in design, analysis, manufacturing, and maintenance of mechanical systems.',
    focusAreas: ['Thermodynamics', 'Machine Design', 'Manufacturing', 'Fluid Mechanics', 'CAD/CAM'],
    programmes: ['BEng. Mechanical Engineering'],
  },
  {
    slug: 'electrical-electronic-engineering',
    short: 'EC',
    name: 'Electrical & Electronics Engineering',
    color: '#C8900A',
    bg: '#fffbeb',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    hod: 'Dr. Steven Obura', hodTitle: 'Head of Department',
    description: 'Covers power systems, electronics, control systems, and communications engineering with strong practical components.',
    focusAreas: ['Power Systems', 'Electronics', 'Control Systems', 'Telecommunications', 'Renewable Energy'],
    programmes: ['BEng. Electrical & Electronic Engineering', 'BSc Power Engineering'],
  },
  {
    slug: 'civil-structural-engineering',
    short: 'CSE',
    name: 'Civil & Structural Engineering',
    color: '#5B6B00',
    bg: '#f7fae6',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10l8-7 8 7v10M9 20v-5h6v5" />
      </svg>
    ),
    hod: 'Eng. Patrick Jangaya', hodTitle: 'Head of Department',
    description: 'Focuses on design and construction of infrastructure including buildings, bridges, roads, and water systems.',
    focusAreas: ['Structural Analysis', 'Geotechnics', 'Hydraulics', 'Transport Engineering', 'Construction Management'],
    programmes: ['BEng. Civil Engineering', 'BSc Structural Engineering'],
  },
  {
    slug: 'chemical-processing-engineering',
    short: 'CPE',
    name: 'Chemical & Processing Engineering',
    color: '#1A5C8B',
    bg: '#f0f7ff',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M9 3h6M9 3v6l-4 9h14l-4-9V3" />
      </svg>
    ),
    hod: 'Dr. Anthony Muliwa', hodTitle: 'Head of Department',
    description: 'Trains engineers in chemical processes, materials science, and industrial processing for the manufacturing and energy sectors.',
    focusAreas: ['Process Engineering', 'Materials Science', 'Environmental Engineering', 'Petrochemicals', 'Food Technology'],
    programmes: ['BEng. Chemical Engineering', 'BSc Processing Engineering'],
  },
  {
    slug: 'electrical-telecommunication-engineering',
    short: 'TLE',
    name: 'Electrical & Telecommunication Engineering',
    color: '#5B1A8B',
    bg: '#f7f0ff',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856a9 9 0 0113.788 0M1.924 8.674a13.5 13.5 0 0120.152 0M12 20.25h.008v.008H12v-.008z" />
      </svg>
    ),
    hod: 'Dr. Steven Obura', hodTitle: 'Head of Department',
    description: 'Combines electrical engineering fundamentals with telecommunications technology, networks, and signal processing.',
    focusAreas: ['Networking', 'Signal Processing', 'Wireless Communications', 'Fibre Optics', 'IoT Systems'],
    programmes: ['BEng. Electrical & Telecom Engineering', 'BSc Communications Engineering'],
  },
  {
    slug: 'manufacturing-industrial-engineering',
    short: 'MIT',
    name: 'Manufacturing & Industrial Engineering',
    color: '#1A6B4A',
    bg: '#f0fff8',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    hod: 'Dr. Caroline Mwangi', hodTitle: 'Head of Department',
    description: 'Focuses on optimizing production systems, quality management, and industrial processes for efficiency and sustainability.',
    focusAreas: ['Production Planning', 'Quality Control', 'Ergonomics', 'Supply Chain', 'Automation'],
    programmes: ['BEng. Manufacturing Engineering', 'BSc Industrial Engineering', 'BSc Textile Engineering'],
  },
]

// ─── Department Cards for HomePage ───────────────────────────────
export function DepartmentCards() {
  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-crimson-400" />
          <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">School of Engineering</span>
        </div>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className="font-display text-3xl font-black text-gray-900 tracking-tight">
            Our Departments
          </h2>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Six engineering departments, one community. Find your department and access resources, events, and academic support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map(dept => (
            <Link key={dept.slug} to={`/departments/${dept.slug}`}
              className="bg-white border border-pink-100 hover:border-pink-300 p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              {/* Accent bar on bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                style={{ background: dept.color }} />

              <div className="flex items-start gap-4">
                {dept.imagePath ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-pink-100 transition-all duration-300 group-hover:scale-105 bg-pink-50">
                    <img
                      src={dept.imagePath}
                      alt={dept.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                    style={{ background: dept.bg, color: dept.color }}
                  >
                    {dept.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: dept.color }}>
                    {dept.short}
                  </div>
                  <h3 className="font-display font-bold text-base text-gray-900 group-hover:text-crimson-700 leading-tight transition-colors">
                    {dept.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mt-4 line-clamp-2">
                {dept.description}
              </p>

              <div className="flex items-center gap-1.5 mt-4 font-mono text-[10px] uppercase tracking-wider transition-colors"
                style={{ color: dept.color }}>
                Learn more
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Individual Department Page ───────────────────────────────────
export default function DepartmentPage() {
  const { slug } = useParams<{ slug: string }>()
  const dept = DEPARTMENTS.find(d => d.slug === slug)

  if (!dept) return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Department not found</p>
        <Link to="/" className="font-mono text-xs text-crimson-600 hover:text-crimson-800 uppercase tracking-wider">← Back home</Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-16 px-6" style={{ background: dept.bg }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {dept.imagePath ? (
              <div className="w-full md:w-64 h-40 md:h-48 rounded-xl overflow-hidden flex-shrink-0 border border-white/60 shadow-sm">
                <img
                  src={dept.imagePath}
                  alt={dept.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'white', color: dept.color, boxShadow: `0 4px 24px ${dept.color}22` }}
              >
                <div className="scale-150">{dept.icon}</div>
              </div>
            )}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: dept.color }}>
                {dept.short} · Moi University
              </span>
              <h1 className="font-display text-4xl font-black text-gray-900 tracking-tight mt-1">{dept.name}</h1>
              <p className="text-gray-500 text-sm mt-2">{dept.hod} — {dept.hodTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-xl font-black text-gray-900 tracking-tight mb-3">About the Department</h2>
            <p className="text-gray-600 leading-relaxed">{dept.description}</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-black text-gray-900 tracking-tight mb-4">Focus Areas</h2>
            <div className="flex flex-wrap gap-2">
              {dept.focusAreas.map(area => (
                <span key={area} className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border"
                  style={{ background: dept.bg, color: dept.color, borderColor: dept.color + '33' }}>
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-black text-gray-900 tracking-tight mb-4">Programmes Offered</h2>
            <ul className="space-y-2">
              {dept.programmes.map(p => (
                <li key={p} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dept.color }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Other departments */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">Other Departments</h3>
          <div className="space-y-2">
            {DEPARTMENTS.filter(d => d.slug !== slug).map(d => (
              <Link key={d.slug} to={`/departments/${d.slug}`}
                className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors group">
                <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: d.bg, color: d.color }}>
                  <div className="scale-75">{d.icon}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold" style={{ color: d.color }}>{d.short}</div>
                  <div className="font-body text-xs text-gray-700 group-hover:text-crimson-700 transition-colors leading-tight">{d.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
