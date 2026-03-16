import { Link } from 'react-router-dom'
import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'

const SOCIALS = [
  { icon: FaXTwitter,   href: 'https://x.com/esamu_mu',            label: 'X (Twitter)' },
  { icon: FaInstagram,  href: 'https://instagram.com/esamu_mu',     label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com/company/esamu', label: 'LinkedIn' },
]

// Logo palette: maroon #8B1A1A, gold #C8900A
export default function Footer() {
  return (
    <footer style={{ background: '#fdf2f2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-white border border-pink-200 shadow-sm">
                <img src="/esamu-logo.jpeg" alt="ESA-MU" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-none" style={{ color: '#8B1A1A' }}>ESA-MU</div>
                <div className="text-[9px] font-mono tracking-widest uppercase mt-0.5" style={{ color: '#C8900A' }}>
                  Moi University
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#9b4040' }}>
              Engineering Students' Association of Moi University — uniting future engineers through community, knowledge, and opportunity.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 group"
                  style={{ background: '#fbe8e8', border: '1px solid #e8b4b4' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#8B1A1A'; (e.currentTarget as HTMLElement).style.borderColor = '#8B1A1A' }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#fbe8e8'; (e.currentTarget as HTMLElement).style.borderColor = '#e8b4b4' }}>
                  <Icon className="w-4 h-4" style={{ color: '#8B1A1A' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide" style={{ color: '#8B1A1A' }}>Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home',        to: '/' },
                { label: 'About ESA-MU',to: '/about' },
                { label: 'Departments', to: '/departments/mechanical-engineering' },
                { label: 'Our Team',    to: '/team' },
                { label: 'Gallery',     to: '/gallery' },
                { label: 'Events',      to: '/events' },
                { label: 'Contact Us',  to: '/contact' },
              ].map(l => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm transition-colors"
                        style={{ color: '#9b4040' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#8B1A1A')}
                        onMouseOut={e => (e.currentTarget.style.color = '#9b4040')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide" style={{ color: '#8B1A1A' }}>Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Exam Bank',        to: '/exam-bank' },
                { label: 'Past Papers',      to: '/exam-bank' },
                { label: 'Assignments',      to: '/exam-bank' },
                { label: 'Blog & News',      to: '/blog' },
                { label: 'Marketplace',      to: '/marketplace' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm transition-colors"
                        style={{ color: '#9b4040' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#8B1A1A')}
                        onMouseOut={e => (e.currentTarget.style.color = '#9b4040')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide" style={{ color: '#8B1A1A' }}>Contact</h4>
            <ul className="space-y-3 text-sm" style={{ color: '#9b4040' }}>
              <li className="flex gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#C8900A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                School of Engineering, Moi University, Eldoret, Kenya
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: '#C8900A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                esamu@mu.ac.ke
              </li>
              {/* Social icons in contact */}
              <li className="flex gap-3 pt-2">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="transition-colors" style={{ color: '#C8900A' }}
                     onMouseOver={e => (e.currentTarget.style.color = '#8B1A1A')}
                     onMouseOut={e => (e.currentTarget.style.color = '#C8900A')}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid #f5c6c6' }}>
          <p className="text-xs" style={{ color: '#b06060' }}>
            © {new Date().getFullYear()} ESA-MU — Engineering Students' Association, Moi University.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: '#b06060' }}>
            <a href="#" className="hover:text-crimson-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-crimson-700 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
