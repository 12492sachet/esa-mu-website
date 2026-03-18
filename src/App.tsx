import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExamBankPage from './pages/ExamBankPage'
import MarketplacePage from './pages/MarketplacePage'
import { CartPage, CheckoutPage } from './pages/CartCheckoutPage'
import { BlogPage, BlogPostPage } from './pages/BlogPage'
import { AboutPage, TeamPage, GalleryPage, ContactPage } from './pages/StaticPages'
import { AdminLoginPage, AdminDashboardPage } from './pages/AdminPages'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import StudentProjectsPage from './pages/StudentProjectsPage'
import DepartmentPage from './pages/DepartmentsPage'
import { analyticsService } from './services/api'

function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    analyticsService.trackVisit(location.pathname).catch(() => {
      // ignore analytics errors
    })
  }, [location.pathname])

  return null
}

// Layout wrapper for public pages (with Navbar + Footer)
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            {/* Public pages */}
            <Route element={<PublicLayout />}>
              <Route path="/"                      element={<HomePage />} />
              <Route path="/about"                 element={<AboutPage />} />
              <Route path="/team"                  element={<TeamPage />} />
              <Route path="/gallery"               element={<GalleryPage />} />
              <Route path="/blog"                  element={<BlogPage />} />
              <Route path="/blog/:id"              element={<BlogPostPage />} />
              <Route path="/exam-bank"             element={<ExamBankPage />} />
              <Route path="/events"                element={<EventsPage />} />
              <Route path="/events/:id"            element={<EventDetailPage />} />
              <Route path="/projects"              element={<StudentProjectsPage />} />
              <Route path="/marketplace"           element={<MarketplacePage />} />
              <Route path="/marketplace/cart"      element={<CartPage />} />
              <Route path="/marketplace/checkout"  element={<CheckoutPage />} />
              <Route path="/contact"               element={<ContactPage />} />
              <Route path="/departments/:slug"     element={<DepartmentPage />} />
            </Route>

            {/* Admin pages (no public navbar/footer) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin"       element={<AdminDashboardPage />} />
            <Route path="/admin/*"     element={<AdminDashboardPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
