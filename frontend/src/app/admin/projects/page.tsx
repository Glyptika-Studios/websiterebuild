/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
} from "lucide-react";

interface ProjectMedia {
  url: string;
  type: "image" | "video";
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  cover_url: string;
  media: ProjectMedia[];
  tags: string[];
  featured: boolean;
  status: "ongoing" | "completed" | "archived";
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Vortex Telemetry Platform",
    description: "An ultra-low latency cluster telemetry grid designed for high throughput microservices. Resolves logs, metrics, and network streams in near real-time.",
    category: "Telemetry",
    date: "2026-04-12",
    cover_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80", type: "image" },
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80", type: "image" }
    ],
    tags: ["Go", "Next.js", "Redis"],
    featured: true,
    status: "completed"
  },
  {
    id: "proj-2",
    title: "Aperture AI Engine",
    description: "Multi-modal vision analysis module processing real-time imagery inputs from secure factory grids. Detects structural flaws down to the sub-millimeter level.",
    category: "Automation",
    date: "2026-05-18",
    cover_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80", type: "image" }
    ],
    tags: ["Python", "TensorFlow", "gRPC"],
    featured: false,
    status: "ongoing"
  }
];

export default function ProjectsManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("products", "write"); // 'products' scope is mapped to projects in migration

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("SaaS");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<"ongoing" | "completed" | "archived">("completed");
  
  // Media sub-form
  const [formMedia, setFormMedia] = useState<ProjectMedia[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem("glyptika_admin_projects", JSON.stringify(DEFAULT_PROJECTS));
    }
  }, []);

  const saveToStorage = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem("glyptika_admin_projects", JSON.stringify(newProjects));
  };

  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingProject(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("SaaS");
    setFormCoverUrl("");
    setFormTags("");
    setFormFeatured(false);
    setFormStatus("completed");
    setFormMedia([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    if (!canWrite) return;
    setEditingProject(project);
    setFormTitle(project.title);
    setFormDescription(project.description);
    setFormCategory(project.category);
    setFormCoverUrl(project.cover_url);
    setFormTags(project.tags.join(", "));
    setFormFeatured(project.featured);
    setFormStatus(project.status);
    setFormMedia(project.media || []);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    setFormMedia([...formMedia, { url: newMediaUrl.trim(), type: newMediaType }]);
    setNewMediaUrl("");
  };

  const handleRemoveMedia = (index: number) => {
    setFormMedia(formMedia.filter((_, i) => i !== index));
  };

  const handleMoveMedia = (index: number, direction: "up" | "down") => {
    const newMedia = [...formMedia];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMedia.length) return;

    // Swap elements
    const temp = newMedia[index];
    newMedia[index] = newMedia[targetIndex];
    newMedia[targetIndex] = temp;
    setFormMedia(newMedia);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError("Project Title is required.");
      return;
    }
    if (!formCoverUrl.trim()) {
      setFormError("Cover Image URL is required.");
      return;
    }

    const tagArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Project = {
      id: editingProject?.id || `proj-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      category: formCategory,
      cover_url: formCoverUrl,
      media: formMedia,
      tags: tagArray,
      featured: formFeatured,
      status: formStatus,
      date: editingProject?.date || new Date().toISOString().split("T")[0],
    };

    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = projects.map((p) => (p.id === editingProject.id ? projectData : p));
    } else {
      updatedProjects = [projectData, ...projects];
    }

    saveToStorage(updatedProjects);
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Projects & Products
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manage public portfolio works and corporate software showcases
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="relative p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects by title, category, or stack tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all"
        />
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-slate-800 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    project.status === "completed"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : project.status === "ongoing"
                      ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                      : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-bold">{project.date}</span>
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  {/* Small preview thumbnail */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-slate-950">
                    <img src={project.cover_url} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight text-white leading-tight mb-1">
                      {project.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Category: {project.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-500 text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{project.media.length} media assets</span>
                </span>
                <div className="flex gap-1.5">
                  {canWrite && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl border border-transparent hover:border-red-500/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-12 text-center text-slate-500 text-sm bg-slate-900/10 border border-dashed border-white/5 rounded-3xl">
            No projects matching query.
          </div>
        )}
      </div>

      {/* Editor Drawer Panel */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingProject ? "Edit Portfolio Work" : "New Portfolio Project"}
                </h3>
                <p className="text-xs text-slate-500">Configure visual details and dynamic media catalogs</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Metadata */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Project Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Telemetry Monitoring Grid..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="A detailed explanation of the project scope and solutions..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option>SaaS</option>
                      <option>Telemetry</option>
                      <option>Automation</option>
                      <option>Web3</option>
                      <option>AI Engine</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Tech Stack Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Tailwind, Supabase"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="proj-featured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border border-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="proj-featured" className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                    Feature on Front Page
                  </label>
                </div>
              </div>

              {/* Right Column: Ordered Media Gallery */}
              <div className="space-y-5 flex flex-col h-full">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Media Gallery Assets
                </span>
                
                {/* Media list */}
                <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto p-4 rounded-3xl bg-slate-950/40 border border-white/5 space-y-3">
                  {formMedia.length > 0 ? (
                    formMedia.map((media, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-900 border border-white/5 rounded-2xl text-xs leading-none"
                      >
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-slate-950">
                          <img src={media.url} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-slate-300 font-mono text-[10px]">{media.url}</p>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
                            Type: {media.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(idx, "down")}
                            disabled={idx === formMedia.length - 1}
                            className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-650 text-xs italic">
                      No gallery assets added yet.
                    </div>
                  )}
                </div>

                {/* Add Media Sub-Form */}
                <div className="p-4 rounded-3xl bg-slate-950/20 border border-white/5 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Add Gallery URL</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="px-3 py-2 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-xl text-xs text-slate-350 focus:outline-none shrink-0"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 hover:border-white/10 transition-all uppercase tracking-wider"
                  >
                    Append to Gallery
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-[#080d19]/60 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
