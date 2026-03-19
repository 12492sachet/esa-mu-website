import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  heroService,
  examService,
  blogService,
  productService,
  partnerService,
} from "../services/api";
import { DepartmentCards } from "./DepartmentsPage";
import { HeroSlide, Exam, BlogPost, Product } from "../types";
import { useCart } from "../context/CartContext";

// ─── Loader skeleton ─────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-pink-100 rounded-sm ${className}`} />
  );
}

// ─── Hero Slider ─────────────────────────────────────────────────
function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    heroService
      .getAll()
      .then((res) => {
        const data = res.data.data as HeroSlide[];
        setSlides(
          data.length
            ? data
            : [
                {
                  id: 1,
                  image_path: "",
                  sort_order: 1,
                  is_active: 1,
                  headline: "Built for Engineers. By Engineers.",
                  subtext:
                    "Exam papers, engineering tools, and a student marketplace — all in one platform.",
                  cta_text: "Explore Exam Bank",
                  cta_link: "/exam-bank",
                } as unknown as HeroSlide,
              ],
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startInterval = () => {
    intervalRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % (slides.length || 1)),
      5500,
    );
  };

  useEffect(() => {
    if (!slides.length) return;
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  const slide = slides[current];

  const GRADIENTS = [
    "from-gray-950 via-crimson-950 to-gray-900",
    "from-crimson-950 via-gray-950 to-gray-900",
    "from-gray-900 via-crimson-900 to-gray-950",
  ];

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* ── Static background image ── */}
      <img
        src="/IMG_6351.JPG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: "heroImageFade 1.2s ease both" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* ── Slide image overlay (when admin uploads per-slide images) ── */}
      {slide?.image_path && (
        <img
          key={slide.image_path}
          src={`/api/storage/uploads/${slide.image_path}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "heroImageFade 1s ease both" }}
        />
      )}

      {/* Bottom gradient only — image stays clean */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        }}
      />

      {/* ── Content — bottom left, frosted strip ── */}
      <div className="relative w-full z-10 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div
              className="max-w-md space-y-3 p-7"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div className="h-2 w-36 bg-white/25 rounded animate-pulse" />
              <div className="h-10 w-full bg-white/25 rounded animate-pulse" />
              <div className="h-10 w-2/3 bg-white/25 rounded animate-pulse" />
            </div>
          ) : slide ? (
            <div
              key={current}
              className="max-w-lg"
              style={{
                animation:
                  "heroContentIn 0.8s cubic-bezier(.22,.68,0,1.2) both",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(4px)",
                  borderLeft: "3px solid rgba(255,255,255,0.55)",
                  padding: "26px 28px 22px",
                }}
              >
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/65 mb-3 block">
                  Moi University · School of Engineering
                </span>
                <h1
                  className="font-display text-4xl md:text-5xl font-black text-white leading-[1.05] mb-3 tracking-tight"
                  style={{
                    whiteSpace: "pre-line",
                    textShadow: "0 2px 14px rgba(0,0,0,0.25)",
                  }}
                >
                  {slide.headline}
                </h1>
                <p
                  className="text-sm text-white/85 mb-6 leading-relaxed max-w-sm"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
                >
                  {slide.subtext}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={slide.cta_link || "/exam-bank"}
                    className="inline-flex items-center gap-2 bg-crimson-700 text-white px-6 py-3 font-mono text-[11px] uppercase tracking-wider hover:bg-crimson-600 active:scale-95 transition-all duration-200 shadow-md"
                  >
                    {slide.cta_text || "Explore Exam Bank"}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 border border-white/38 text-white px-6 py-3 font-mono text-[11px] uppercase tracking-wider hover:bg-white/15 active:scale-95 transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                  >
                    Marketplace
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Vertical dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 right-5 flex flex-col gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: 6,
                borderRadius: 9999,
                height: i === current ? 28 : 8,
                background: i === current ? "white" : "rgba(255,255,255,0.38)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Arrow navigation ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/25 hover:border-white/60 active:scale-90 transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.18)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/25 hover:border-white/60 active:scale-90 transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.18)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ background: "rgba(0,0,0,0.32)", backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-4 divide-x divide-white/10">
          {[
            ["130+", "Past Papers"],
            ["280+", "Students"],
            ["47", "Products"],
            ["Y1–Y5", "Years"],
          ].map(([v, l]) => (
            <div key={l} className="text-center px-2">
              <div className="font-display font-black text-lg text-white leading-none">
                {v}
              </div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-white/50 mt-0.5">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Exam Preview ─────────────────────────────────────────────────
function ExamPreview() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService
      .getAll({ page: "1" })
      .then((res) => setExams((res.data.data as Exam[]).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const TYPE_CLS: Record<string, string> = {
    CAT: "bg-amber-900/40 text-amber-400 border border-amber-900/50",
    Main: "bg-crimson-900/40 text-crimson-400 border border-crimson-900/40",
    Assignment:
      "bg-emerald-900/40 text-emerald-400 border border-emerald-900/40",
  };

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-crimson-600" />
              <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">
                Exam Bank
              </span>
            </div>
            <h2 className="font-display text-3xl font-black text-white tracking-tight">
              Latest uploads
            </h2>
          </div>
          <Link
            to="/exam-bank"
            className="font-mono text-xs text-crimson-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
          >
            View all
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-pink-100">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-pink-50 p-5 space-y-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
            : exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-pink-50 p-5 hover:bg-pink-100 transition-colors cursor-pointer group border-b-2 border-transparent hover:border-crimson-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-1 uppercase tracking-wider ${TYPE_CLS[exam.type]}`}
                    >
                      {exam.type}
                    </span>
                    <span className="font-mono text-[9px] text-gray-600 uppercase">
                      {exam.year_of_study} · {exam.semester}
                    </span>
                  </div>
                  <div className="w-8 h-10 bg-pink-100 border border-gray-700 flex items-center justify-center mb-4 group-hover:border-crimson-900 transition-colors">
                    <svg
                      className="w-4 h-5 text-gray-600 group-hover:text-crimson-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-300 leading-snug mb-1">
                    {exam.title}
                  </p>
                  <p className="font-mono text-[10px] text-gray-600 uppercase tracking-wider">
                    {exam.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800 font-mono text-[10px] text-crimson-600 uppercase tracking-wider">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog Preview ─────────────────────────────────────────────────
function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService
      .getAll({ page: "1" })
      .then((res) => setPosts((res.data.data as BlogPost[]).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const shown = posts;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-crimson-600" />
              <span className="font-mono text-xs text-crimson-600 uppercase tracking-widest">
                Blog & News
              </span>
            </div>
            <h2 className="font-display text-3xl font-black text-gray-900 tracking-tight">
              From the community
            </h2>
          </div>
          <Link
            to="/blog"
            className="font-mono text-xs text-crimson-700 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
          >
            All posts
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white p-0">
                    <Skeleton className="h-44 w-full bg-gray-100 rounded-none" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-3 w-20 bg-gray-100" />
                      <Skeleton className="h-5 w-full bg-gray-100" />
                      <Skeleton className="h-4 w-3/4 bg-gray-100" />
                    </div>
                  </div>
                ))
            : shown.map((post, i) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-white group hover:-translate-y-1 transition-transform duration-200 block"
                >
                  <div className="h-44 bg-pink-50 flex items-center justify-center relative overflow-hidden border-b-2 border-crimson-700">
                    {post.featured_image ? (
                      <img
                        src={`/api/storage/uploads/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : (
                      <span className="font-mono text-4xl font-black text-gray-800 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {post.tags.slice(0, 2).map((t) => (
                          <span
                            key={t.id}
                            className="font-mono text-[9px] text-crimson-700 border border-crimson-200 px-2 py-0.5 uppercase tracking-wider"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-display font-bold text-base text-gray-900 leading-snug mb-2 group-hover:text-crimson-800 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center font-mono text-[10px] text-gray-400 pt-3 border-t border-gray-100">
                      <span>{post.author_name}</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString(
                          "en-KE",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Products Preview ─────────────────────────────────────────────
function ProductsPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    productService
      .getAll({ page: "1" })
      .then((res) =>
        setProducts(
          (res.data.data as Product[]).filter((p) => p.stock > 0).slice(0, 4),
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-crimson-600" />
              <span className="font-mono text-xs text-crimson-600 uppercase tracking-widest">
                Marketplace
              </span>
            </div>
            <h2 className="font-display text-3xl font-black text-gray-900 tracking-tight">
              Featured products
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="font-mono text-xs text-crimson-700 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
          >
            All products
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white p-5 space-y-3">
                    <Skeleton className="h-32 w-full bg-gray-100 rounded-none" />
                    <Skeleton className="h-4 w-full bg-gray-100" />
                    <Skeleton className="h-3 w-3/4 bg-gray-100" />
                  </div>
                ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white group hover:bg-gray-50 transition-colors"
                >
                  <div className="h-36 bg-pink-50 flex items-center justify-center relative">
                    {product.image_path ? (
                      <img
                        src={`/api/storage/uploads/${product.image_path}`}
                        alt={product.name}
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <svg
                        className="w-10 h-10 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                        strokeLinecap="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
                      </svg>
                    )}
                    <span className="absolute top-2 left-2 font-mono text-[9px] bg-black/60 text-gray-400 px-2 py-0.5 uppercase tracking-wider">
                      {product.category_name}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 right-2 font-mono text-[9px] bg-amber-900/80 text-amber-400 px-2 py-0.5 uppercase">
                        {product.stock} left
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-3 group-hover:text-crimson-800 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-lg text-gray-900">
                        KES {Number(product.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border transition-all ${
                          addedId === product.id
                            ? "bg-emerald-700 border-emerald-700 text-white"
                            : "bg-pink-50 border-gray-950 text-white hover:bg-crimson-800 hover:border-crimson-800"
                        }`}
                      >
                        {addedId === product.id ? "Added" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features section ─────────────────────────────────────────────
function Features() {
  const feats = [
    {
      to: "/exam-bank",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        />
      ),
      title: "Exam Bank",
      desc: "130+ CATs, main exams, and assignments across all years and semesters. Free to download, always updated.",
    },
    {
      to: "/marketplace",
      icon: (
        <>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
        </>
      ),
      title: "Marketplace",
      desc: "Buy and sell engineering instruments, textbooks, and safety gear. M-Pesa STK Push checkout.",
    },
    {
      to: "/blog",
      icon: (
        <>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </>
      ),
      title: "Community",
      desc: "Career fairs, hackathons, and announcements. Stay connected with what's happening in ESA-MU.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-600 uppercase tracking-widest">
              Platform
            </span>
          </div>
          <h2 className="font-display text-3xl font-black text-gray-900 tracking-tight">
            Everything you need in one place
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
          {feats.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="bg-white p-8 group hover:bg-pink-50 transition-colors duration-200 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-crimson-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="w-11 h-11 bg-pink-50 group-hover:bg-crimson-800 flex items-center justify-center mb-6 transition-colors">
                <svg
                  className="w-5 h-5 text-crimson-600 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors">
                {f.desc}
              </p>
              <div className="flex items-center gap-2 mt-6 font-mono text-xs text-crimson-600 group-hover:text-crimson-400 uppercase tracking-wider transition-colors">
                Explore
                <svg
                  className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partners — auto-scroll marquee with real logos ──────────────
// Static/fallback partners (shown when API is empty)
const DEFAULT_PARTNERS = [
  {
    id: 1,
    name: "SEC",
    full: "School of Engineering Council",
    image: "/partners/sec.jpg",
  },
  {
    id: 2,
    name: "ESA",
    full: "Engineering Students Association",
    image: "/partners/esa.png",
  },
  {
    id: 3,
    name: "IEK",
    full: "Institution of Engineers of Kenya",
    image: "/partners/iek.jpg",
  },
  {
    id: 4,
    name: "WAAW",
    full: "Working to Advance African Women in STEM",
    image: "/partners/waaw.jpg",
  },
  {
    id: 5,
    name: "IEEE",
    full: "Institute of Electrical & Electronics Eng.",
    image: "/partners/ieee.jpg",
  },
];

interface Partner {
  id: number;
  name: string;
  full: string;
  image: string;
  logo_path?: string;
}

function Partners() {
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    partnerService
      .getAll()
      .then((r) => {
        const data = r.data.data as Partner[];
        if (data?.length) setPartners(data);
      })
      .catch(() => {}); // keep defaults on error
  }, []);

  // Duplicate for seamless loop
  const items = [...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-crimson-400" />
          <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">
            Partners & Affiliates
          </span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-black text-gray-900 tracking-tight">
              Our partners
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-lg leading-relaxed">
              ESA-MU is affiliated with leading engineering bodies, tech
              communities, and professional organisations.
            </p>
          </div>
        </div>
      </div>

      {/* ── Auto-scroll marquee track ── */}
      <div
        className="relative overflow-hidden border-t border-b border-pink-200 bg-white"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex animate-marquee-slow hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}
        >
          {items.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="flex flex-col items-center justify-center gap-3 py-7 px-10 border-r border-pink-100 min-w-[180px] group cursor-default transition-all duration-300 hover:bg-pink-50"
            >
              {/* Logo image */}
              <div className="w-20 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src={
                    p.logo_path
                      ? `/api/storage/uploads/${p.logo_path}`
                      : p.image
                  }
                  alt={p.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-400"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const fb = el.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                {/* Fallback initials if image fails */}
                <div className="hidden w-12 h-12 bg-pink-100 items-center justify-center font-display font-black text-crimson-600 text-sm">
                  {p.name.slice(0, 3)}
                </div>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-sm text-gray-800 group-hover:text-crimson-700 transition-colors leading-tight">
                  {p.name}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400 mt-0.5 leading-tight max-w-[140px]">
                  {p.full}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="p-5 bg-white border-l-2 border-pink-300 flex items-center justify-between flex-wrap gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            Interested in partnering with ESA-MU?
          </p>
          <Link
            to="/contact"
            className="font-mono text-[10px] uppercase tracking-widest text-crimson-600 hover:text-crimson-800 flex items-center gap-2 transition-colors"
          >
            Get in touch
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 bg-crimson-800 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-crimson-600" />
            <span className="font-mono text-xs text-crimson-500 uppercase tracking-widest">
              Join ESA-MU
            </span>
          </div>
          <h2 className="font-display text-4xl font-black text-white tracking-tight mb-4 leading-none">
            Be part of something
            <br />
            bigger than your GPA.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-md">
            Access exam papers, connect with peers, and build the skills that
            actually matter in the engineering industry.
          </p>
        </div>
        <div className="md:col-span-2 flex flex-col gap-3 md:items-end">
          <Link
            to="/exam-bank"
            className="inline-flex items-center gap-2 bg-crimson-800 text-white px-8 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-crimson-700 transition-colors"
          >
            Get Started
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className="ticker-strip bg-crimson-800 h-9 flex items-center overflow-hidden">
        <div className="flex gap-0 whitespace-nowrap animate-[ticker_20s_linear_infinite]">
          {Array(2)
            .fill([
              "Exam Bank",
              "Marketplace",
              "M-Pesa Payments",
              "Past Papers",
              "Community",
              "CATs · Mains · Assignments",
              "Y1 – Y4 · Sem 1 & 2",
            ])
            .flat()
            .map((t, i) => (
              <span
                key={i}
                className="font-mono text-[10px] text-white/80 uppercase tracking-widest px-8"
              >
                {i % 7 === 0 && i > 0 ? (
                  <span className="text-white/30 mr-8">◆</span>
                ) : null}
                {t}
              </span>
            ))}
        </div>
      </div>
      <DepartmentCards />
      <Features />
      <ExamPreview />
      <BlogPreview />
      <ProductsPreview />
      <Partners />
      <CTA />
    </>
  );
}
