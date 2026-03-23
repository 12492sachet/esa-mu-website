import { useState, useEffect, useRef } from "react";
import { FaLinkedinIn, FaGithub, FaGlobe } from "react-icons/fa6";
import api from "../services/api";
import { DEPARTMENTS } from "./DepartmentsPage";

interface Project {
  id: number;
  title: string;
  description: string;
  student_name: string;
  student_reg: string;
  department: string;
  year_of_study: string;
  tech_stack: string;
  project_url?: string;
  github_url?: string;
  image_path?: string;
  linkedin_url?: string;
  status?: string;
  created_at: string;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const DEPT_OPTS = ["All", ...DEPARTMENTS.map((d: any) => d.short)];
const YEAR_OPTS = ["All", "Y1", "Y2", "Y3", "Y4", "Y5"];

function projectImageSrc(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const clean = imagePath.replace(/^\/+/, "");
  return `/uploads/${clean}`;
}

// ─── Submit Modal ──────────────────────────────────────────────────
function SubmitModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    student_name: "",
    student_reg: "",
    department: DEPARTMENTS[0].short,
    year_of_study: "Y1",
    tech_stack: "",
    project_url: "",
    github_url: "",
    linkedin_url: "",
  });

  const f =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (fileRef.current?.files?.[0])
        fd.append("image", fileRef.current.files[0]);
      await api.post("/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDone(true);
      onSuccess();
    } catch (err: any) {
      setErr(
        err?.response?.data?.message ??
          "Failed to submit. Make sure all required fields are filled.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inp =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-colors bg-white text-gray-900";

  if (done)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="bg-white rounded-lg w-full max-w-sm p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 text-xl font-bold mb-2">
            Project Submitted!
          </h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your project is under review. An admin will approve it and it will
            appear in the showcase.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 z-10 rounded-t-lg">
          <h2 className="text-gray-900 font-bold text-lg">
            Submit Your Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
              {err}
            </p>
          )}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-amber-700 text-xs font-medium">
              {" "}
              Projects are reviewed by admins before going live.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Project Title *
            </label>
            <input
              className={inp}
              value={form.title}
              onChange={f("title")}
              required
              placeholder="e.g. Solar-Powered Water Pump"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Description *
            </label>
            <textarea
              className={inp}
              rows={4}
              value={form.description}
              onChange={f("description")}
              required
              placeholder="What does your project do? What problem does it solve?"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Tech Stack / Tools Used
            </label>
            <input
              className={inp}
              value={form.tech_stack}
              onChange={f("tech_stack")}
              placeholder="e.g. Arduino, Python, SolidWorks..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Full Name *
              </label>
              <input
                className={inp}
                value={form.student_name}
                onChange={f("student_name")}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Reg. Number *
              </label>
              <input
                className={inp}
                value={form.student_reg}
                onChange={f("student_reg")}
                required
                placeholder="ENG/…"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Department *
              </label>
              <select
                className={inp}
                value={form.department}
                onChange={f("department")}
              >
                {DEPARTMENTS.map((d: any) => (
                  <option key={d.slug} value={d.short}>
                    {d.short} — {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Year of Study *
              </label>
              <select
                className={inp}
                value={form.year_of_study}
                onChange={f("year_of_study")}
              >
                {YEAR_OPTS.filter((y) => y !== "All").map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              GitHub URL
            </label>
            <input
              className={inp}
              type="url"
              value={form.github_url}
              onChange={f("github_url")}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Live / Demo URL
            </label>
            <input
              className={inp}
              type="url"
              value={form.project_url}
              onChange={f("project_url")}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              LinkedIn (optional)
            </label>
            <input
              className={inp}
              type="url"
              value={form.linkedin_url}
              onChange={f("linkedin_url")}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Cover Image (optional)
            </label>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              className="text-sm text-gray-600 w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              A photo, schematic, or screenshot of your project.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-900 hover:bg-red-800 disabled:opacity-60 text-white py-3 rounded text-sm font-semibold transition-colors"
            >
              {saving ? "Submitting…" : "Submit Project →"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Project Card ──────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const dept = DEPARTMENTS.find((d: any) => d.short === project.department);
  const tags =
    project.tech_stack
      ?.split(",")
      .map((t: string) => t.trim())
      .filter(Boolean) ?? [];
  const [imgErr, setImgErr] = useState(false);

  const deptBg = (dept as any)?.bg ?? "#fff1f2";
  const deptColor = (dept as any)?.color ?? "#7f1d1d";

  return (
    <div
      style={{ border: "1px solid #e5e7eb" }}
      className="bg-white rounded-lg overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Cover */}
      <div
        className="relative h-44 flex-shrink-0"
        style={{ background: deptBg }}
      >
        {project.image_path && !imgErr ? (
          <img
            src={projectImageSrc(project.image_path)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg
              className="w-12 h-12 opacity-20"
              style={{ color: deptColor }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
            <span
              className="text-xs font-semibold opacity-30 uppercase tracking-widest"
              style={{ color: deptColor }}
            >
              {project.department}
            </span>
          </div>
        )}
        <span className="absolute top-2 right-2 text-xs font-bold bg-white/90 text-gray-700 px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
          {project.year_of_study}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span
          className="inline-block self-start text-xs font-bold px-2 py-0.5 rounded mb-3 uppercase tracking-wide"
          style={{ background: deptBg, color: deptColor }}
        >
          {project.department}
        </span>

        <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-red-900 transition-colors line-clamp-2">
          {project.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3 flex-1">
          {project.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-gray-400 self-center">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div
          className="pt-3 mt-auto flex items-center justify-between"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {project.student_name}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wide truncate">
              {project.student_reg}
            </p>
          </div>
          <div className="flex items-center gap-2.5 ml-3 flex-shrink-0">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-800 transition-colors"
                title="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-800 transition-colors"
                title="Live Demo"
              >
                <FaGlobe className="w-4 h-4" />
              </a>
            )}
            {project.linkedin_url && (
              <a
                href={project.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-800 transition-colors"
                title="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Debug panel (dev only) ────────────────────────────────────────
function DebugPanel({ projects }: { projects: Project[] }) {
  const [show, setShow] = useState(false);
  if (import.meta.env.PROD) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShow((s) => !s)}
        className="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg font-mono"
      >
        🐛 Debug ({projects.length})
      </button>
      {show && (
        <div className="absolute bottom-10 right-0 w-96 max-h-80 overflow-auto bg-gray-900 text-green-400 text-xs p-3 rounded shadow-2xl font-mono">
          <pre>{JSON.stringify(projects.slice(0, 3), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api
      .get("/projects")
      .then((r) => {
        const raw = r.data;
        let list: Project[] = [];
        if (Array.isArray(raw)) list = raw;
        else if (Array.isArray(raw?.data)) list = raw.data;
        else if (Array.isArray(raw?.projects)) list = raw.projects;
        // Guard: only show approved; if no status field, assume approved
        setProjects(list.filter((p) => !p.status || p.status === "approved"));
      })
      .catch((err) => {
        console.error("Projects load error:", err);
        setError(
          `Could not load projects${err?.response?.status ? ` (${err.response.status})` : ""}. Please try again.`,
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = projects.filter((p) => {
    const deptOk = deptFilter === "All" || p.department === deptFilter;
    const yearOk = yearFilter === "All" || p.year_of_study === yearFilter;
    const q = search.toLowerCase();
    const searchOk =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.student_name.toLowerCase().includes(q) ||
      (p.tech_stack ?? "").toLowerCase().includes(q);
    return deptOk && yearOk && searchOk;
  });

  const hasFilters = !!(search || deptFilter !== "All" || yearFilter !== "All");

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {modal && (
        <SubmitModal onClose={() => setModal(false)} onSuccess={load} />
      )}

      {/* Header */}
      <section className="bg-red-950 py-16 px-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
              ESA-MU · School of Engineering
            </p>
            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
              Student Projects
            </h1>
            <p className="text-gray-400 mt-3 max-w-lg text-sm leading-relaxed">
              A living archive of engineering projects by MU students — from
              final year projects to side builds.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex-shrink-0 bg-red-700 hover:bg-red-600 text-white px-7 py-4 text-sm font-semibold rounded transition-colors"
          >
            + Submit Your Project
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <input
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 min-w-[200px] flex-1 bg-white text-gray-900"
            placeholder="Search projects, students, tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1 flex-wrap">
            {DEPT_OPTS.map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition-all ${
                  deptFilter === d
                    ? "bg-red-900 text-white border-red-900"
                    : "border-gray-300 text-gray-600 hover:border-red-800 hover:text-red-800 bg-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {YEAR_OPTS.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-all ${
                  yearFilter === y
                    ? "bg-red-900 text-white border-red-900"
                    : "border-gray-300 text-gray-600 hover:border-gray-500 bg-white"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            {loading
              ? "Loading…"
              : `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {!loading && hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setDeptFilter("All");
                setYearFilter("All");
              }}
              className="text-xs text-red-800 hover:text-red-900 font-semibold underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="text-center py-16 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
            <button
              onClick={load}
              className="text-red-800 text-sm font-semibold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200"
                >
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex gap-1.5 pt-1">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-lg border border-gray-200">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
              />
            </svg>
            {projects.length === 0 ? (
              <>
                <p className="text-gray-400 text-sm font-semibold mb-3">
                  No projects yet
                </p>
                <button
                  onClick={() => setModal(true)}
                  className="text-red-800 text-sm font-semibold underline underline-offset-2 hover:text-red-900"
                >
                  Be the first to submit one →
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm font-semibold mb-3">
                  No projects match your filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setDeptFilter("All");
                    setYearFilter("All");
                  }}
                  className="text-red-800 text-sm font-semibold underline underline-offset-2 hover:text-red-900"
                >
                  Clear filters →
                </button>
              </>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-red-50 border-t border-red-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-gray-900 text-2xl font-black tracking-tight">
              Built something cool?
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Document it here — inspire the next generation of MU engineers.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="inline-flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-8 py-4 text-sm font-semibold rounded transition-colors"
          >
            Submit Your Project
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
          </button>
        </div>
      </section>

      <DebugPanel projects={projects} />
    </main>
  );
}
