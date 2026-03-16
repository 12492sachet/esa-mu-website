// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'student'
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── CMS / Pages ────────────────────────────────────────────────────────────
export interface Page {
  id: number
  slug: string
  title: string
  content: string
  meta_desc: string
  is_published: boolean
  updated_at: string
}

export interface HeroSlide {
  id: number
  image_path: string
  headline: string
  subtext: string
  cta_text: string
  cta_link: string
  sort_order: number
}

export interface SiteSetting {
  id: number
  setting_key: string
  setting_value: string
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number
  author_id: string
  author_name?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image: string
  status: 'draft' | 'published'
  published_at: string
  tags?: BlogTag[]
}

export interface BlogTag {
  id: number
  name: string
  slug: string
}

// ─── Team ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: number
  name: string
  role: string
  profile_image: string
  twitter_url?: string
  linkedin_url?: string
  sort_order: number
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export interface GalleryImage {
  id: number
  category_id: number
  category_name?: string
  title: string
  image_path: string
  uploaded_at: string
}

export interface GalleryCategory {
  id: number
  name: string
  slug: string
}

// ─── Exam Bank ───────────────────────────────────────────────────────────────
export type ExamType = 'CAT' | 'Main' | 'Assignment'
export type ExamSemester = 'Sem1' | 'Sem2'
export type YearOfStudy = 'Y1' | 'Y2' | 'Y3' | 'Y4'

export interface Exam {
  id: number
  title: string
  subject: string
  type: ExamType
  semester: ExamSemester
  year_of_study: YearOfStudy
  pdf_path: string
  description: string
  uploaded_at: string
}

// ─── Marketplace ─────────────────────────────────────────────────────────────
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category_id: number
  category_name?: string
  image_path: string
  is_active: boolean
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'failed'
  phone_number: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product?: Product
  quantity: number
  unit_price: number
}

export interface MpesaPayment {
  id: number
  order_id: number
  checkout_request_id: string
  merchant_request_id: string
  mpesa_receipt?: string
  amount: number
  phone_number: string
  result_code?: number
  result_desc?: string
  created_at: string
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
