import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const NAV_ITEMS = [
  { label: 'Home',        to: '/',          matchPrefix: '' },
  { label: 'About',       to: '/about',     matchPrefix: '' },
  { label: 'Departments', to: '/departments/mechanical-engineering', matchPrefix: '/departments' },
  { label: 'Team',        to: '/team',      matchPrefix: '' },
  { label: 'Gallery',     to: '/gallery',   matchPrefix: '' },
  { label: 'Exam Bank',   to: '/exam-bank', matchPrefix: '' },
  { label: 'Blog',        to: '/blog',      matchPrefix: '' },
  { label: 'Marketplace', to: '/marketplace', matchPrefix: '' },
  { label: 'Contact',     to: '/contact',   matchPrefix: '' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const { pathname }  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])

  const isHome = pathname === '/'
  const onDark = !scrolled && isHome

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome ? 'bg-white shadow-sm border-b border-pink-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-11 h-11 rounded-sm overflow-hidden flex-shrink-0 bg-white border border-pink-100 shadow-sm">
              <img src="/esamu-logo.jpeg" alt="ESA-MU" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className={`transition-colors duration-300 ${onDark ? 'text-white' : 'text-gray-900'}`}>
              <div className="font-display font-bold text-base leading-none">ESA-MU</div>
              <div className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${onDark ? 'text-white/60' : 'text-crimson-400'}`}>
                Engineering Students
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = item.matchPrefix
                ? pathname.startsWith(item.matchPrefix)
                : item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'}
                  className={`relative px-3 py-2 text-sm font-body font-medium rounded-sm transition-all duration-200 group ${
                    isActive
                      ? onDark ? 'text-amber-300' : 'text-crimson-700'
                      : onDark ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-crimson-700'
                  }`}>
                  {item.label}
                  <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full transition-all duration-300 bg-crimson-600 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                  }`} />
                </NavLink>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/marketplace/cart"
              className={`relative p-2 rounded-sm transition-colors ${
                onDark ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-crimson-700'
              }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crimson-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link to="/admin"
              className="hidden md:inline-flex items-center px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white active:scale-95 transition-all duration-200"
              style={{ background: '#8B1A1A' }}>
              Admin
            </Link>

            <button onClick={() => setOpen(!open)}
              className={`lg:hidden p-2 rounded-sm transition-colors ${onDark ? 'text-white' : 'text-gray-700'}`}
              aria-label="Toggle menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {open
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-pink-100 shadow-md ${
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = item.matchPrefix
              ? pathname.startsWith(item.matchPrefix)
              : pathname === item.to
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={`block px-3 py-2.5 text-sm font-body font-medium rounded-sm transition-colors ${
                  isActive
                    ? 'bg-crimson-50 text-crimson-700 border-l-2 border-crimson-600'
                    : 'text-gray-700 hover:bg-pink-50 hover:text-crimson-700'
                }`}>
                {item.label}
              </NavLink>
            )
          })}
          <Link to="/admin"
            className="block mt-2 px-3 py-2.5 text-sm font-mono uppercase tracking-wider text-white text-center"
            style={{ background: '#8B1A1A' }}>
            Admin Portal
          </Link>
        </div>
      </div>
    </header>
  )
}
