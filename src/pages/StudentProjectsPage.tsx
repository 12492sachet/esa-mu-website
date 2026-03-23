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
  created_at: string;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />;
}

const DEPT_OPTS = ["All", ...DEPARTMENTS.map((d: any) => d.short)];
const YEAR_OPTS = ["All", "Y1", "Y2", "Y3", "Y4", "Y5"];

function projectImageSrc(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `/uploads/${imagePath.replace(/^\/+/, "")}`;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Project Detail Panel ──────────────────────────────────────────
function ProjectDetailPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dept = DEPARTMENTS.find((d: any) => d.short === project.department);
  const tags =
    project.tech_stack
      ?.split(",")
      .map((t: string) => t.trim())
      .filter(Boolean) ?? [];
  const [imgErr, setImgErr] = useState(false);
  const [visible, setVisible] = useState(false);
  const deptBg = (dept as any)?.bg ?? "#fdf2f2";
  const deptColor = (dept as any)?.color ?? "#8B1A1A";

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{
        background: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        transition: "background 0.3s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="relative bg-white w-full max-w-2xl h-full overflow-y-auto flex flex-col shadow-2xl"
        style={{
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Hero */}
        <div
          className="relative flex-shrink-0"
          style={{ height: 320, background: deptBg }}
        >
          {project.image_path && !imgErr ? (
            <img
              src={projectImageSrc(project.image_path)}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <svg
                className="w-16 h-16 opacity-10"
                style={{ color: deptColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={0.8}
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              <span
                className="font-mono text-xs opacity-20 uppercase tracking-widest"
                style={{ color: deptColor }}
              >
                {project.department}
              </span>
            </div>
          )}
          {/* Gradient overlay when image present */}
          {project.image_path && !imgErr && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
              }}
            />
          )}
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow transition-colors"
            title="Close (Esc)"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Year */}
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest bg-white/90 text-gray-700 px-3 py-1">
            {project.year_of_study}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-8 space-y-7">
          {/* Dept label + Title */}
          <div>
            <span
              className="inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-1 mb-4"
              style={{ background: deptBg, color: deptColor }}
            >
              {project.department}
            </span>
            <h2
              className="text-gray-900 text-2xl font-black leading-tight tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {project.title}
            </h2>
          </div>

          {/* Author row */}
          <div
            className="flex items-center gap-4 py-4"
            style={{
              borderTop: "1px solid #f3f4f6",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center text-sm font-black flex-shrink-0 text-white"
              style={{ background: deptColor }}
            >
              {project.student_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {project.student_name}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">
                {project.student_reg} &middot; {project.department} &middot;
                Year {project.year_of_study?.replace("Y", "")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {project.linkedin_url && (
                <a
                  href={project.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
                >
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors"
                >
                  <FaGithub className="w-3.5 h-3.5" />
                </a>
              )}
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-800 hover:border-red-300 transition-colors"
                >
                  <FaGlobe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
              About this project
            </p>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Tech stack */}
          {tags.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
                Tech Stack & Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 border border-gray-200 text-gray-600 bg-gray-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.github_url || project.project_url) && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
                Links
              </p>
              <div className="flex flex-col gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 text-gray-600 hover:text-white transition-all group/link"
                  >
                    <FaGithub className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm flex-1 truncate">
                      {project.github_url}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 opacity-30 group-hover/link:opacity-100 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-red-200 hover:border-red-900 hover:bg-red-900 text-red-800 hover:text-white transition-all group/link"
                  >
                    <FaGlobe className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm flex-1 truncate">
                      {project.project_url}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 opacity-30 group-hover/link:opacity-100 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2" style={{ borderTop: "1px solid #f3f4f6" }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
              Submitted {formatDate(project.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Modal ─────────────────────────────────────────────────
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
    "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-colors bg-white text-gray-900";
  const sel =
    "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-800 bg-white text-gray-900";

  if (done)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="bg-white w-full max-w-sm p-8 text-center shadow-2xl">
          <div className="w-12 h-12 bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
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
          <h3
            className="text-gray-900 text-lg font-black mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Project Submitted
          </h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your project is under review. Once approved it will appear in the
            showcase.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-red-900 hover:bg-red-800 text-white py-3 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <p
            className="font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Submit Your Project
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 p-3">
              {err}
            </p>
          )}
          <div className="p-3 bg-amber-50 border-l-2 border-amber-400">
            <p className="font-mono text-[9px] uppercase tracking-widest text-amber-700">
              Projects are reviewed by admins before going live.
            </p>
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
              Tech Stack / Tools Used
            </label>
            <input
              className={inp}
              value={form.tech_stack}
              onChange={f("tech_stack")}
              placeholder="e.g. Arduino, Python, SolidWorks, AutoCAD..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
                Reg. Number *
              </label>
              <input
                className={inp}
                value={form.student_reg}
                onChange={f("student_reg")}
                required
                placeholder="ENG/..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
                Department *
              </label>
              <select
                className={sel}
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
              <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
                Year of Study *
              </label>
              <select
                className={sel}
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
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
            <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">
              Cover Image (optional)
            </label>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              className="text-sm text-gray-600 w-full"
            />
            <p className="font-mono text-[9px] text-gray-400 mt-1">
              A photo, schematic, or screenshot of your project.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-900 hover:bg-red-800 disabled:opacity-60 text-white py-3 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              {saving ? "Submitting..." : "Submit Project"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 border border-gray-200 font-mono text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const dept = DEPARTMENTS.find((d: any) => d.short === project.department);
  const tags =
    project.tech_stack
      ?.split(",")
      .map((t: string) => t.trim())
      .filter(Boolean) ?? [];
  const [imgErr, setImgErr] = useState(false);
  const deptBg = (dept as any)?.bg ?? "#fdf2f2";
  const deptColor = (dept as any)?.color ?? "#8B1A1A";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="bg-white flex flex-col group cursor-pointer focus:outline-none"
      style={{ border: "1px solid #d1d5db" }}
    >
      {/* Cover — full bleed, sharp, no radius */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: 220, background: deptBg }}
      >
        {project.image_path && !imgErr ? (
          <img
            src={projectImageSrc(project.image_path)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <svg
              className="w-14 h-14 opacity-15"
              style={{ color: deptColor }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.8}
            >
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
            <span
              className="font-mono text-[9px] uppercase tracking-widest opacity-25"
              style={{ color: deptColor }}
            >
              {project.department}
            </span>
          </div>
        )}
        {/* Subtle hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end pb-4 px-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/90">
            View Details
          </span>
        </div>
        {/* Year badge */}
        <span
          className="absolute top-0 right-0 font-mono text-[9px] uppercase tracking-widest bg-white text-gray-600 px-3 py-1"
          style={{
            borderLeft: "1px solid #d1d5db",
            borderBottom: "1px solid #d1d5db",
          }}
        >
          {project.year_of_study}
        </span>
      </div>

      {/* Body */}
      <div
        className="p-5 flex flex-col flex-1"
        style={{ borderTop: "3px solid #d1d5db" }}
      >
        {/* Dept label */}
        <span
          className="self-start font-mono text-[9px] uppercase tracking-widest mb-3"
          style={{ color: deptColor }}
        >
          {project.department}
        </span>

        {/* Title — serif, bold */}
        <h3
          className="text-gray-900 font-bold text-base leading-snug mb-3 line-clamp-2 group-hover:text-red-900 transition-colors"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="font-mono text-[9px] text-gray-400 self-center">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer — author left, date right — like the blog cards */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #e5e7eb" }}
        >
          <div className="min-w-0 mr-3">
            <p className="text-xs text-gray-500 truncate">
              {project.student_name}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wide text-gray-400">
              {project.student_reg}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {project.github_url && (
              <FaGithub className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
            )}
            {project.project_url && (
              <FaGlobe className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
            )}
            {project.linkedin_url && (
              <FaLinkedinIn className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
            )}
            <p className="font-mono text-[9px] text-gray-400">
              {formatDate(project.created_at)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
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
        setProjects(
          list.filter((p: any) => !p.status || p.status === "approved"),
        );
      })
      .catch(() => setError("Could not load projects. Please try again."))
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
    <main className="min-h-screen bg-white pt-20">
      {modal && (
        <SubmitModal onClose={() => setModal(false)} onSuccess={load} />
      )}
      {selected && (
        <ProjectDetailPanel
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Hero header */}
      <section className="bg-crimson-950 py-16 px-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-crimson-400 mb-3">
              ESA-MU · School of Engineering
            </p>
            <h1
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Student Projects
            </h1>
            <p className="text-gray-400 mt-3 max-w-lg text-sm leading-relaxed">
              A living archive of engineering projects built by MU students —
              from final year projects to side builds.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex-shrink-0 bg-white hover:bg-gray-100 text-red-900 px-7 py-3 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Submit Your Project
          </button>
        </div>
      </section>

      {/* Sticky filters */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <input
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-800 min-w-[200px] flex-1 bg-white text-gray-900"
            placeholder="Search projects, students, tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1 flex-wrap">
            {DEPT_OPTS.map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
                  deptFilter === d
                    ? "bg-red-900 text-white border-red-900"
                    : "border-gray-200 text-gray-500 hover:border-red-800 hover:text-red-800 bg-white"
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
                className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 border transition-all ${
                  yearFilter === y
                    ? "bg-red-900 text-white border-red-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400 bg-white"
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
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            {loading
              ? "Loading..."
              : `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {!loading && hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setDeptFilter("All");
                setYearFilter("All");
              }}
              className="font-mono text-[9px] uppercase tracking-widest text-red-800 hover:text-red-900 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="py-12 text-center border border-red-200 bg-red-50">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={load}
              className="font-mono text-xs uppercase tracking-wider text-red-800 underline"
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
                <div key={i} className="bg-white border border-gray-200">
                  <Skeleton className="h-[220px] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 border border-gray-200 bg-white">
            <svg
              className="w-10 h-10 mx-auto mb-4 text-gray-200"
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
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  No projects yet
                </p>
                <button
                  onClick={() => setModal(true)}
                  className="font-mono text-xs uppercase tracking-widest text-red-800 underline underline-offset-2 hover:text-red-900"
                >
                  Be the first to submit one
                </button>
              </>
            ) : (
              <>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
                  No projects match your filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setDeptFilter("All");
                    setYearFilter("All");
                  }}
                  className="font-mono text-xs uppercase tracking-widest text-red-800 underline underline-offset-2 hover:text-red-900"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2
              className="text-2xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Built something cool?
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Document it here — inspire the next generation of MU engineers.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="inline-flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-8 py-3 font-mono text-xs uppercase tracking-wider transition-colors"
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
    </main>
  );
}
