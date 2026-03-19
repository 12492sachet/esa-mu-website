import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  adminService,
  examService,
  productService,
  blogService,
  teamService,
  galleryService,
  orderService,
  cmsService,
  heroService,
  partnerService,
  eventService,
  adminProjectService,
} from "../services/api";

// ─── Admin Login ──────────────────────────────────────────────────
export function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-crimson-800 flex items-center justify-center mx-auto mb-5">
            <svg
              viewBox="0 0 40 40"
              className="w-7 h-7"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="20" cy="20" r="5" />
              <line x1="20" y1="4" x2="20" y2="9" />
              <line x1="20" y1="31" x2="20" y2="36" />
              <line x1="4" y1="20" x2="9" y2="20" />
              <line x1="31" y1="20" x2="36" y2="20" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">
            ESA-MU Admin
          </h1>
          <p className="font-mono text-xs text-gray-600 mt-2 uppercase tracking-widest">
            Sign in to manage the platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 p-7 space-y-4"
        >
          {error && (
            <div className="bg-crimson-950 border border-crimson-900 p-3">
              <p className="font-mono text-[10px] text-crimson-400 uppercase tracking-wider">
                {error}
              </p>
            </div>
          )}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-crimson-600 transition-colors placeholder:text-gray-700"
              placeholder="admin@esamu.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-crimson-600 transition-colors placeholder:text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson-800 text-white py-3.5 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
      {children}
    </th>
  );
}
function Td({
  children,
  mono = false,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 text-sm text-gray-700 border-b border-gray-50 ${mono ? "font-mono text-xs" : ""}`}
    >
      {children}
    </td>
  );
}
function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700",
    published: "bg-emerald-50 text-emerald-700",
    active: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    draft: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-700",
    "out of stock": "bg-red-50 text-red-700",
    "low stock": "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 font-semibold ${map[s.toLowerCase()] ?? "bg-gray-100 text-gray-600"}`}
    >
      {s}
    </span>
  );
}
function ActBtns({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-gray-200 hover:border-gray-400 transition-colors"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}
function AddBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 bg-gray-950 text-white hover:bg-crimson-800 transition-colors"
    >
      {label}
    </button>
  );
}
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />;
}

const inp =
  "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-crimson-500 transition-colors";
const sel =
  "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-crimson-500 bg-white";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB (server-friendly default)
function fmtBytes(n: number) {
  const mb = n / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function apiErr(e: unknown, fallback: string) {
  const anyE = e as any;
  const status = anyE?.response?.status;
  const data = anyE?.response?.data;

  const msgFromData =
    (typeof data === "string" && data) ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.errors) && data.errors.join(", ")) ||
    (typeof data?.errors === "object" && data?.errors
      ? Object.values(data.errors).flat().join(", ")
      : "");

  const base = msgFromData || anyE?.message || fallback;
  return status ? `${base} (HTTP ${status})` : base;
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <p className="font-display font-black text-gray-900 tracking-tight">
            {title}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveBtn({
  saving,
  label,
}: {
  saving: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex-1 bg-crimson-800 text-white py-3 font-mono text-xs uppercase tracking-wider hover:bg-crimson-700 disabled:opacity-60 transition-colors"
    >
      {saving ? "Saving…" : `${label} →`}
    </button>
  );
}

function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 border border-gray-200 font-mono text-xs text-gray-600 hover:bg-gray-50"
    >
      Cancel
    </button>
  );
}

// ─── Dashboard Panel ──────────────────────────────────────────────
function DashboardPanel() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getStats(), orderService.adminGetAll(1)])
      .then(([s, o]) => {
        setStats(s.data.data);
        setOrders(o.data.data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", key: "total_users", color: "border-l-crimson-600" },
    { label: "Products", key: "total_products", color: "border-l-amber-500" },
    { label: "Exams Uploaded", key: "total_exams", color: "border-l-blue-600" },
    { label: "Blog Posts", key: "total_posts", color: "border-l-emerald-600" },
    { label: "Visitors (Total)", key: "total_visits", color: "border-l-fuchsia-600" },
    { label: "Visitors (Today)", key: "visits_today", color: "border-l-sky-600" },
  ];

  return (
    <div>
      <p className="font-display text-xl font-black text-gray-900 tracking-tight mb-5">
        Dashboard
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`bg-white border border-gray-100 border-l-4 ${c.color} p-4`}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
              {c.label}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="font-display text-3xl font-black text-gray-900">
                {stats[c.key] ?? 0}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
          Recent Orders
        </p>
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Receipt</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (orders as Record<string, string>[]).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <Td mono>#{o.id}</Td>
                  <Td>{o.customer_name || "Guest"}</Td>
                  <Td mono>KES {Number(o.total_amount).toLocaleString()}</Td>
                  <Td>
                    <StatusBadge s={o.status} />
                  </Td>
                  <Td mono>{o.mpesa_receipt || "—"}</Td>
                </tr>
              ))}
        </tbody>
      </table>
      {stats.revenue !== undefined && (
        <div className="mt-4 p-4 bg-emerald-950 border border-emerald-900">
          <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 mb-1">
            Total Revenue (Paid Orders)
          </p>
          <p className="font-display text-2xl font-black text-white">
            KES {Number(stats.revenue ?? 0).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Exams Panel ──────────────────────────────────────────────────
function ExamsPanel() {
  const [exams, setExams] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    type: "CAT",
    subject: "",
    year_of_study: "Y1",
    semester: "S1",
  });
  const load = () => {
    examService
      .getAll()
      .then((r) => setExams(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (!f) {
        setErr("Please choose a PDF file.");
        return;
      }
      fd.append("pdf", f);
      // Some backends validate the upload under a generic key like `file`
      // (safe to send both; server will read the expected one).
      fd.append("file", f);
      await examService.create(fd);
      setModal(false);
      setForm({
        title: "",
        type: "CAT",
        subject: "",
        year_of_study: "Y1",
        semester: "S1",
      });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to upload exam PDF."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this exam?")) return;
    await examService.delete(id);
    load();
  };

  const TC: Record<string, string> = {
    CAT: "bg-amber-50 text-amber-800",
    Main: "bg-red-50 text-red-800",
    Assignment: "bg-green-50 text-green-800",
  };

  return (
    <div>
      {modal && (
        <Modal title="Upload Exam PDF" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Title *">
              <input
                className={inp}
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                placeholder="e.g. Thermodynamics CAT 1"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type *">
                <select
                  className={sel}
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  {["CAT", "Main", "Assignment"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Semester *">
                <select
                  className={sel}
                  value={form.semester}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, semester: e.target.value }))
                  }
                >
                  {["S1", "S2", "S3"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subject / Unit *">
                <input
                  className={inp}
                  value={form.subject}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject: e.target.value }))
                  }
                  required
                  placeholder="e.g. ENG 310"
                />
              </Field>
              <Field label="Year of Study *">
                <select
                  className={sel}
                  value={form.year_of_study}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, year_of_study: e.target.value }))
                  }
                >
                  {["Y1", "Y2", "Y3", "Y4", "Y5"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="PDF File *">
              <input
                type="file"
                ref={fileRef}
                accept="application/pdf"
                className="text-sm text-gray-600"
                required
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Upload" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Exam Bank
        </p>
        <AddBtn label="+ Upload PDF" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Type</Th>
            <Th>Subject</Th>
            <Th>Year</Th>
            <Th>Sem</Th>
            <Th>Downloads</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (exams as Record<string, string | number>[]).map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <Td>
                    <span className="font-medium">{e.title as string}</span>
                  </Td>
                  <Td>
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-1 uppercase tracking-wider ${TC[e.type as string] ?? ""}`}
                    >
                      {e.type as string}
                    </span>
                  </Td>
                  <Td>{e.subject as string}</Td>
                  <Td mono>{e.year_of_study as string}</Td>
                  <Td mono>{e.semester as string}</Td>
                  <Td mono>{e.download_count as number}</Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(e.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Products Panel ───────────────────────────────────────────────
function ProductsPanel() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "0",
    description: "",
  });

  const load = () => {
    productService
      .getAll()
      .then((r) => setProducts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    productService
      .getCategories()
      .then((r) => setCats(r.data.data ?? []))
      .catch(() => setCats([]));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (f && f.size > MAX_UPLOAD_BYTES) {
        setErr(
          `Image is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
        );
        return;
      }
      if (f) fd.append("image", f);
      await productService.create(fd);
      setModal(false);
      setForm({
        name: "",
        category_id: "",
        price: "",
        stock: "0",
        description: "",
      });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to add product."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await productService.delete(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="Add Product" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Product Name *">
              <input
                className={inp}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category *">
                <select
                  className={sel}
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category_id: e.target.value }))
                  }
                  required
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {cats.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price (KES) *">
                <input
                  className={inp}
                  type="number"
                  min={0}
                  step="1"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock *">
                <input
                  className={inp}
                  type="number"
                  min={0}
                  step="1"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: e.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Image (optional)">
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  className="text-sm text-gray-600"
                />
              </Field>
            </div>
            <Field label="Description (optional)">
              <textarea
                className={inp}
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short product description…"
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Add Product" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Products
        </p>
        <AddBtn label="+ Add Product" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (products as Record<string, string | number>[]).map((p) => {
                const stock = Number(p.stock);
                const statusLabel =
                  stock === 0
                    ? "out of stock"
                    : stock <= 5
                      ? "low stock"
                      : "active";
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <Td>
                      <span className="font-medium">{p.name as string}</span>
                    </Td>
                    <Td>{p.category_name as string}</Td>
                    <Td mono>KES {Number(p.price).toLocaleString()}</Td>
                    <Td mono>{stock}</Td>
                    <Td>
                      <StatusBadge s={statusLabel} />
                    </Td>
                    <Td>
                      <ActBtns onDelete={() => del(Number(p.id))} />
                    </Td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────
function BlogPanel() {
  const [posts, setPosts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    author_name: "",
    status: "draft",
    content: "",
  });

  const load = () => {
    blogService
      .getAll()
      .then((r) => setPosts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (f) fd.append("image", f);
      await blogService.create(fd);
      setModal(false);
      setForm({ title: "", author_name: "", status: "draft", content: "" });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to create blog post."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await blogService.delete(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="New Blog Post" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Title *">
              <input
                className={inp}
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Author *">
                <input
                  className={inp}
                  value={form.author_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author_name: e.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Status *">
                <select
                  className={sel}
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  {["draft", "published"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Content *">
              <textarea
                className={inp}
                rows={8}
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                required
                placeholder="Write your post…"
              />
            </Field>
            <Field label="Cover Image (optional)">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Create Post" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Blog Posts
        </p>
        <AddBtn label="+ New Post" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Status</Th>
            <Th>Published</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (posts as Record<string, string>[]).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <Td>
                    <span className="font-medium">{p.title}</span>
                  </Td>
                  <Td>{p.author_name}</Td>
                  <Td>
                    <StatusBadge s={p.status} />
                  </Td>
                  <Td mono>
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString("en-KE")
                      : "—"}
                  </Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(p.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Team Panel ───────────────────────────────────────────────────
function TeamPanel() {
  const [members, setMembers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
  });

  const load = () => {
    teamService
      .getAll()
      .then((r) => setMembers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "string" && v.trim() === "") return;
        fd.append(k, v);
      });
      const f = fileRef.current?.files?.[0];
      if (!f) {
        setErr("Please upload a member photo.");
        return;
      }
      if (f.size > MAX_UPLOAD_BYTES) {
        setErr(
          `Image is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
        );
        return;
      }
      // Align with public TeamPage fields (`profile_image`).
      fd.append("profile_image", f);
      // Backwards/alternate key support (some backends expect `image`).
      fd.append("image", f);
      await teamService.create(fd);
      setModal(false);
      setForm({
        name: "",
        role: "",
        linkedin_url: "",
        twitter_url: "",
        instagram_url: "",
      });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to add team member."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this team member?")) return;
    await teamService.delete(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="Add Team Member" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Name *">
              <input
                className={inp}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Role *">
              <input
                className={inp}
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
                required
                placeholder="e.g. Chairperson"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="LinkedIn (optional)">
                <input
                  className={inp}
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, linkedin_url: e.target.value }))
                  }
                  placeholder="https://linkedin.com/in/…"
                />
              </Field>
              <Field label="X / Twitter (optional)">
                <input
                  className={inp}
                  type="url"
                  value={form.twitter_url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, twitter_url: e.target.value }))
                  }
                  placeholder="https://x.com/…"
                />
              </Field>
              <Field label="Instagram (optional)">
                <input
                  className={inp}
                  type="url"
                  value={form.instagram_url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, instagram_url: e.target.value }))
                  }
                  placeholder="https://instagram.com/…"
                />
              </Field>
            </div>
            <Field label="Photo *">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
                required
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Add Member" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Team Members
        </p>
        <AddBtn label="+ Add Member" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Member</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (members as Record<string, string>[]).map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <Td>
                    <div className="flex items-center gap-3">
                      {m.profile_image ? (
                        <img
                          src={`/api/storage/uploads/${m.profile_image}`}
                          alt={m.name}
                          className="w-7 h-7 object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 bg-crimson-100 flex items-center justify-center font-display text-xs font-bold text-crimson-800">
                          {(m.name as string)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </Td>
                  <Td>{m.role}</Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(m.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Orders Panel ─────────────────────────────────────────────────
function OrdersPanel() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .adminGetAll(1)
      .then((r) => setOrders(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="font-display text-xl font-black text-gray-900 tracking-tight mb-5">
        Orders & M-Pesa
      </p>

      {/* Flow */}
      <div className="flex items-center gap-0 flex-wrap mb-6 p-4 bg-emerald-950 border border-emerald-900">
        {[
          "Add to cart",
          "Enter phone",
          "STK Push sent",
          "Approve PIN",
          "Confirmed",
        ].map((s, i) => (
          <div key={s} className="flex items-center">
            <span
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 ${i === 4 ? "bg-emerald-600 text-white" : "bg-emerald-950 border border-emerald-800 text-emerald-600"}`}
            >
              {s}
            </span>
            {i < 4 && (
              <span className="font-mono text-[10px] text-emerald-800 px-1">
                ›
              </span>
            )}
          </div>
        ))}
      </div>

      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Phone</Th>
            <Th>Amount</Th>
            <Th>Receipt</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (orders as Record<string, string>[]).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <Td mono>#{o.id}</Td>
                  <Td>{o.customer_name || "Guest"}</Td>
                  <Td mono>{o.phone_number}</Td>
                  <Td mono>KES {Number(o.total_amount).toLocaleString()}</Td>
                  <Td mono>{o.mpesa_receipt || "—"}</Td>
                  <Td>
                    <StatusBadge s={o.status} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Gallery Panel ────────────────────────────────────────────────
function GalleryPanel() {
  const [images, setImages] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "", category: "" });

  const load = () => {
    galleryService
      .getAll()
      .then((r) => setImages(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    galleryService
      .getCategories()
      .then((r) => setCats(r.data.data ?? []))
      .catch(() => setCats([]));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const f = fileRef.current?.files?.[0];
      if (!f) {
        setErr("Please choose an image to upload.");
        return;
      }
      if (f.size > MAX_UPLOAD_BYTES) {
        setErr(
          `Image is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
        );
        return;
      }
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", f);
      await galleryService.upload(fd);
      setModal(false);
      setForm({ title: "", category: "" });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to upload image."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await galleryService.delete(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="Upload Images" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Title (optional)">
              <input
                className={inp}
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Innovation Week 2026"
              />
            </Field>
            <Field label="Category (optional)">
              <select
                className={sel}
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                <option value="">Uncategorized</option>
                {cats.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Image File *">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
                required
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Upload" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Gallery
        </p>
        <AddBtn label="+ Upload Images" onClick={() => setModal(true)} />
      </div>
      {loading ? (
        <div className="grid grid-cols-6 gap-2">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-none" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2">
          {(images as Record<string, string>[]).map((img) => (
            <div
              key={img.id}
              className="aspect-square relative group overflow-hidden bg-gray-100"
            >
              {img.image_path ? (
                <img
                  src={`/api/storage/uploads/${img.image_path}`}
                  alt={img.title || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-crimson-900/60 transition-all flex items-center justify-center">
                <button
                  onClick={() => del(Number(img.id))}
                  className="opacity-0 group-hover:opacity-100 font-mono text-[9px] text-white bg-crimson-800 px-2 py-1 uppercase tracking-wider transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pages Panel ──────────────────────────────────────────────────
function PagesPanel() {
  const [pages, setPages] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    is_published: false,
  });

  const load = () => {
    cmsService
      .getPages()
      .then((r) => setPages(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await cmsService.createPage({
        ...form,
        is_published: Boolean(form.is_published),
      });
      setModal(false);
      setForm({ title: "", slug: "", content: "", is_published: false });
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to create page."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this page?")) return;
    await cmsService.deletePage(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="New Page (CMS)" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Title *">
              <input
                className={inp}
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Slug *">
              <input
                className={inp}
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.target.value }))
                }
                required
                placeholder="e.g. about"
              />
              <p className="font-mono text-[9px] text-gray-400 mt-1">
                This becomes the URL path: /your-slug
              </p>
            </Field>
            <Field label="Content *">
              <textarea
                className={inp}
                rows={10}
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                required
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_published: e.target.checked }))
                }
              />
              Publish immediately
            </label>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Create Page" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Page Manager (CMS)
        </p>
        <AddBtn label="+ New Page" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Page</Th>
            <Th>Slug</Th>
            <Th>Status</Th>
            <Th>Updated</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (pages as Record<string, string | number>[]).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <Td>
                    <span className="font-medium">{p.title as string}</span>
                  </Td>
                  <Td mono>/{p.slug as string}</Td>
                  <Td>
                    <StatusBadge s={p.is_published ? "published" : "draft"} />
                  </Td>
                  <Td mono>
                    {new Date(p.updated_at as string).toLocaleDateString(
                      "en-KE",
                    )}
                  </Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(p.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Hero Panel ───────────────────────────────────────────────────
function HeroPanel() {
  const [slides, setSlides] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    headline: "",
    cta_text: "",
    cta_link: "",
    sort_order: "1",
  });

  const load = () => {
    heroService
      .getAll()
      .then((r) => setSlides(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const f = fileRef.current?.files?.[0];
      if (!f) {
        setErr("Please choose a slide image.");
        return;
      }
      if (f.size > MAX_UPLOAD_BYTES) {
        setErr(
          `Image is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
        );
        return;
      }
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", f);
      await heroService.create(fd);
      setModal(false);
      setForm({ headline: "", cta_text: "", cta_link: "", sort_order: "1" });
      if (fileRef.current) fileRef.current.value = "";
      setLoading(true);
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to upload hero slide."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    await heroService.delete(id);
    load();
  };

  return (
    <div>
      {modal && (
        <Modal title="Upload Hero Slide" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Headline *">
              <input
                className={inp}
                value={form.headline}
                onChange={(e) =>
                  setForm((p) => ({ ...p, headline: e.target.value }))
                }
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Text (optional)">
                <input
                  className={inp}
                  value={form.cta_text}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cta_text: e.target.value }))
                  }
                  placeholder="e.g. Join Now"
                />
              </Field>
              <Field label="CTA Link (optional)">
                <input
                  className={inp}
                  value={form.cta_link}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cta_link: e.target.value }))
                  }
                  placeholder="/about"
                />
              </Field>
            </div>
            <Field label="Sort Order *">
              <input
                className={inp}
                type="number"
                min={1}
                step="1"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sort_order: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Slide Image *">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
                required
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Upload Slide" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Hero Slides
        </p>
        <AddBtn label="+ Upload Slide" onClick={() => setModal(true)} />
      </div>
      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Preview</Th>
            <Th>Headline</Th>
            <Th>CTA</Th>
            <Th>Order</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(2)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (slides as Record<string, string | number>[]).map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <Td>
                    <div className="w-16 h-10 bg-gray-950 flex items-center justify-center">
                      {s.image_path ? (
                        <img
                          src={`/api/storage/uploads/${s.image_path as string}`}
                          alt=""
                          className="w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-crimson-950" />
                      )}
                    </div>
                  </Td>
                  <Td>
                    <span className="font-medium text-xs">
                      {s.headline as string}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[10px] text-crimson-700">
                      {s.cta_text as string}
                    </span>
                  </Td>
                  <Td mono>{s.sort_order as number}</Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(s.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Events Panel ─────────────────────────────────────────────────
function EventsPanel() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    location: "",
    event_date: "",
    event_time: "",
  });

  const load = () => {
    setLoading(true);
    eventService
      .getAll()
      .then((r) => setEvents(r.data.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      // For PHP validators it's usually better to always send all keys,
      // even if optional fields are empty strings.
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (f) {
        if (f.size > MAX_UPLOAD_BYTES) {
          setErr(
            `Image is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
          );
          return;
        }
        // Send under common keys to match backend validation expectations.
        fd.append("image", f);
        fd.append("cover_image", f);
      }
      await eventService.create(fd);
      setModal(false);
      setForm({
        title: "",
        description: "",
        category: "Other",
        location: "",
        event_date: "",
        event_time: "",
      });
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e2: unknown) {
      setErr(apiErr(e2, "Failed to create event."));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await eventService.delete(id).catch(() => {});
    load();
  };

  const CATS = ["Academic", "Social", "Sports", "Career", "Workshop", "Other"];

  return (
    <div>
      {modal && (
        <Modal title="Create Event" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Title *">
              <input
                className={inp}
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                placeholder="e.g. Innovation Week — Day 1"
              />
            </Field>
            <Field label="Description *">
              <textarea
                className={inp}
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                required
                placeholder="Short event overview…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category *">
                <select
                  className={sel}
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Location *">
                <input
                  className={inp}
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  required
                  placeholder="e.g. Main Hall"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date *">
                <input
                  className={inp}
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, event_date: e.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Time (optional)">
                <input
                  className={inp}
                  value={form.event_time}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, event_time: e.target.value }))
                  }
                  placeholder="e.g. 2:00 PM"
                />
              </Field>
            </div>
            <Field label="Cover Image (optional)">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Create Event" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}

      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Events
        </p>
        <AddBtn label="+ Create Event" onClick={() => setModal(true)} />
      </div>

      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Location</Th>
            <Th>Likes</Th>
            <Th>Comments</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (events as Record<string, any>[]).map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <Td>
                    <span className="font-medium">{ev.title}</span>
                  </Td>
                  <Td mono>
                    {ev.event_date
                      ? new Date(ev.event_date).toLocaleDateString("en-KE")
                      : "—"}
                  </Td>
                  <Td>
                    <StatusBadge s={String(ev.category ?? "Other")} />
                  </Td>
                  <Td>{ev.location ?? "—"}</Td>
                  <Td mono>{ev.likes_count ?? 0}</Td>
                  <Td mono>{ev.comments_count ?? 0}</Td>
                  <Td>
                    <ActBtns onDelete={() => del(Number(ev.id))} />
                  </Td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Student Projects (Admin Review) ───────────────────────────────
function ProjectsPanel() {
  const [projects, setProjects] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actingId, setActingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setErr("");
    adminProjectService
      .getAll()
      .then((r) => setProjects(r.data.data ?? []))
      .catch((e: unknown) => setErr(apiErr(e, "Failed to load projects.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const patchLocal = (id: number, patch: Record<string, any>) => {
    setProjects((prev) =>
      (prev as Record<string, any>[]).map((p) => (Number(p.id) === id ? { ...p, ...patch } : p)),
    );
  };

  const approve = async (id: number) => {
    setActingId(id);
    setErr("");
    // optimistic UI: mark approved immediately
    patchLocal(id, { status: "approved" });
    try {
      await adminProjectService.approve(id);
    } catch (e: unknown) {
      // revert on failure
      patchLocal(id, { status: "pending" });
      setErr(apiErr(e, "Failed to approve project."));
    } finally {
      setActingId(null);
    }
  };

  const reject = async (id: number) => {
    setActingId(id);
    setErr("");
    patchLocal(id, { status: "rejected" });
    try {
      await adminProjectService.reject(id);
    } catch (e: unknown) {
      patchLocal(id, { status: "pending" });
      setErr(apiErr(e, "Failed to reject project."));
    } finally {
      setActingId(null);
    }
  };
  const del = async (id: number) => {
    if (!confirm("Delete this project submission?")) return;
    await adminProjectService.delete(id).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Student Projects (Review)
        </p>
        <AddBtn label="Refresh" onClick={load} />
      </div>

      {err && (
        <div className="mb-4 bg-red-50 border border-red-100 p-3">
          <p className="text-red-600 text-xs font-mono">{err}</p>
          <p className="text-gray-500 text-xs font-mono mt-1">
            If your backend doesn’t have `/admin/projects`, I can adjust this
            panel to match your exact endpoints.
          </p>
        </div>
      )}

      <table className="w-full bg-white border border-gray-100">
        <thead>
          <tr>
            <Th>Project</Th>
            <Th>Student</Th>
            <Th>Dept</Th>
            <Th>Year</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
            : (projects as Record<string, any>[]).map((p) => {
                const s = String(p.status ?? "pending").toLowerCase();
                const rowCls =
                  s === "approved" || s === "published"
                    ? "bg-emerald-50 hover:bg-emerald-100"
                    : s === "rejected"
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50";
                return (
                <tr key={p.id} className={rowCls}>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.title}</span>
                      <span className="text-xs text-gray-400 line-clamp-1">
                        {p.tech_stack || "—"}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="text-sm">{p.student_name}</span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {p.student_reg}
                      </span>
                    </div>
                  </Td>
                  <Td mono>{p.department ?? "—"}</Td>
                  <Td mono>{p.year_of_study ?? "—"}</Td>
                  <Td>
                    <StatusBadge s={String(p.status ?? "pending")} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      {(s === "pending" || s === "draft") && (
                        <>
                          <button
                            onClick={() => approve(Number(p.id))}
                            disabled={actingId === Number(p.id)}
                            className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 transition-colors"
                          >
                            {actingId === Number(p.id) ? "Working…" : "Approve"}
                          </button>
                          <button
                            onClick={() => reject(Number(p.id))}
                            disabled={actingId === Number(p.id)}
                            className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-60 transition-colors"
                          >
                            {actingId === Number(p.id) ? "Working…" : "Reject"}
                          </button>
                        </>
                      )}
                      {(s === "approved" || s === "published") && (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50">
                          Approved
                        </span>
                      )}
                      {s === "rejected" && (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-red-200 text-red-700 bg-red-50">
                          Rejected
                        </span>
                      )}
                      <button
                        onClick={() => del(Number(p.id))}
                        className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </Td>
                </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────
// ─── Partners Panel ──────────────────────────────────────────────
function PartnersPanel() {
  const [partners, setPartners] = useState<
    { id: number; name: string; full: string; logo_path: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", full: "" });
  const [modal, setModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    partnerService
      .getAll()
      .then((r) => setPartners(r.data.data ?? []))
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const del = async (id: number) => {
    if (!confirm("Remove this partner?")) return;
    await partnerService.delete(id).catch(() => {});
    load();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("full", form.full);
      const f = fileRef.current?.files?.[0];
      if (f) {
        if (f.size > MAX_UPLOAD_BYTES) {
          setErr(
            `Logo is too large (${fmtBytes(f.size)}). Please upload an image under ${fmtBytes(MAX_UPLOAD_BYTES)}.`,
          );
          return;
        }
        fd.append("logo", f);
      }
      await partnerService.create(fd);
      setModal(false);
      setForm({ name: "", full: "" });
      load();
    } catch (e: unknown) {
      setErr(apiErr(e, "Failed to add partner."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {modal && (
        <Modal title="Add Partner" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            {err && (
              <p className="text-red-500 text-xs font-mono bg-red-50 p-2">
                {err}
              </p>
            )}
            <Field label="Partner Name *">
              <input
                className={inp}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                placeholder="e.g. IEEE"
              />
            </Field>
            <Field label="Full Name / Description *">
              <input
                className={inp}
                value={form.full}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full: e.target.value }))
                }
                required
                placeholder="e.g. Institute of Electrical & Electronics Engineers"
              />
            </Field>
            <Field label="Logo Image *">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="text-sm text-gray-600"
                required
              />
              <p className="font-mono text-[9px] text-gray-400 mt-1">
                PNG or JPG, ideally with transparent or white background.
              </p>
            </Field>
            <div className="flex gap-2 pt-1">
              <SaveBtn saving={saving} label="Add Partner" />
              <CancelBtn onClick={() => setModal(false)} />
            </div>
          </form>
        </Modal>
      )}

      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-xl font-black text-gray-900 tracking-tight">
          Partners & Affiliates
        </p>
        <AddBtn label="+ Add Partner" onClick={() => setModal(true)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 p-4 space-y-2"
              >
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))
        ) : partners.length === 0 ? (
          <div className="col-span-4 py-12 text-center text-gray-400 font-mono text-xs">
            No partners yet.
          </div>
        ) : (
          partners.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-100 p-4 flex flex-col items-center gap-3 group relative"
            >
              <div className="h-16 w-full flex items-center justify-center">
                <img
                  src={`/api/storage/uploads/${p.logo_path}`}
                  alt={p.name}
                  className="max-h-14 max-w-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-sm text-gray-900">
                  {p.name}
                </p>
                <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">
                  {p.full}
                </p>
              </div>
              <button
                onClick={() => del(p.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] uppercase px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50 bg-white"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-pink-50 border border-pink-100">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
          Tip: Partner logos appear in the scrolling marquee on the homepage.
          Use PNG with white or transparent background for best results.
        </p>
      </div>
    </div>
  );
}

type Panel =
  | "dashboard"
  | "events"
  | "projects"
  | "exams"
  | "products"
  | "blog"
  | "team"
  | "gallery"
  | "orders"
  | "pages"
  | "hero"
  | "partners";

const PANELS: Record<Panel, React.ReactNode> = {
  dashboard: <DashboardPanel />,
  events: <EventsPanel />,
  projects: <ProjectsPanel />,
  exams: <ExamsPanel />,
  products: <ProductsPanel />,
  blog: <BlogPanel />,
  team: <TeamPanel />,
  gallery: <GalleryPanel />,
  orders: <OrdersPanel />,
  pages: <PagesPanel />,
  hero: <HeroPanel />,
  partners: <PartnersPanel />,
};

const NAV_ITEMS = [
  {
    id: "dashboard" as Panel,
    label: "Dashboard",
    group: "Overview",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    id: "pages" as Panel,
    label: "Page Manager",
    group: "Content",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      </>
    ),
  },
  {
    id: "hero" as Panel,
    label: "Hero Slides",
    group: "Content",
    icon: (
      <>
        <rect x="1" y="5" width="22" height="14" rx="2" />
        <circle cx="6" cy="10" r="2" />
      </>
    ),
  },
  {
    id: "events" as Panel,
    label: "Events",
    group: "Community",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="8" y1="2.5" x2="8" y2="6" />
        <line x1="16" y1="2.5" x2="16" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    id: "projects" as Panel,
    label: "Student Projects",
    group: "Community",
    icon: (
      <>
        <path d="M3 7h18" />
        <path d="M7 7v14" />
        <path d="M3 7l2-4h14l2 4" />
        <rect x="7" y="11" width="14" height="10" rx="2" />
      </>
    ),
  },
  {
    id: "blog" as Panel,
    label: "Blog Posts",
    group: "Content",
    icon: (
      <>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
  },
  {
    id: "partners" as Panel,
    label: "Partners",
    group: "Content",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </>
    ),
  },
  {
    id: "team" as Panel,
    label: "Team",
    group: "Community",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  {
    id: "gallery" as Panel,
    label: "Gallery",
    group: "Community",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
  },
  {
    id: "exams" as Panel,
    label: "Exam Bank",
    group: "Academic",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    id: "products" as Panel,
    label: "Products",
    group: "Shop",
    icon: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
      </>
    ),
  },
  {
    id: "orders" as Panel,
    label: "Orders",
    group: "Shop",
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
  },
];

export function AdminDashboardPage() {
  const [active, setActive] = useState<Panel>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, user, logout, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const groups = [...new Set(NAV_ITEMS.map((n) => n.group))];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-crimson-800 h-14 flex items-center justify-between px-5 flex-shrink-0 border-b border-crimson-900">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="w-7 h-7 bg-white/15 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="3.5" />
              <line x1="12" y1="2" x2="12" y2="5.5" />
              <line x1="12" y1="18.5" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5.5" y2="12" />
              <line x1="18.5" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="font-display font-black text-white text-base tracking-tight">
            ESA-MU Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/15 flex items-center justify-center font-display font-bold text-white text-xs">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <span className="text-white/70 text-xs font-mono hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={logout}
            className="font-mono text-[10px] text-white/50 hover:text-white uppercase tracking-wider transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-52 bg-gray-900 flex flex-col transition-transform duration-200 pt-14 md:pt-0`}
        >
          <nav className="flex-1 overflow-y-auto py-3">
            {groups.map((group) => (
              <div key={group} className="mb-1">
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-600 px-4 py-2">
                  {group}
                </p>
                {NAV_ITEMS.filter((n) => n.group === group).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActive(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-body transition-all border-l-2 ${
                      active === item.id
                        ? "bg-gray-800 text-white border-l-crimson-600"
                        : "text-gray-500 border-l-transparent hover:bg-gray-800/50 hover:text-gray-300"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    >
                      {item.icon}
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {PANELS[active]}
        </main>
      </div>
    </div>
  );
}
