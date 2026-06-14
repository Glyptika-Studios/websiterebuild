/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Post {
  id: string;
  type: "blog" | "linkedin";
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  date: string;
  image_url?: string;
  tags: string[];
  featured: boolean;
  url?: string;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: "post-1",
    type: "blog",
    title: "Unlocking Peak Performance in Next-Gen Cloud Compute",
    excerpt: "Discover the virtualization optimizations and memory management paradigms driving peak performance in enterprise setups.",
    content: "## The Evolution of Cloud virtualization\nModern cloud architectures require strict isolation, low-latency, and high-performance. In this article, we look at how optimized server kernels can trim execution costs by up to 30%...\n\n### Optimization checklist\n1. Kernel bypass strategies\n2. Efficient page locking\n3. Pre-allocated memory pools\n\nBy leveraging these approaches, startups can achieve enterprise grade reliability without paying hyper-scale tax.",
    category: "Infrastructure",
    date: "2026-06-10",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    tags: ["Cloud", "Performance", "Optimization"],
    featured: true,
  },
  {
    id: "post-2",
    type: "linkedin",
    title: "Proud to announce Glyptika Studios is launching our IMS portal today!",
    excerpt: "An enterprise SaaS platform built for developers, by developers. Automating deployments, telemetry grids, and security updates.",
    category: "Company",
    date: "2026-06-11",
    tags: ["ProductLaunch", "SaaS", "Telemetry"],
    featured: false,
    url: "https://linkedin.com/posts/glyptika-ims-launch",
  },
];

export default function PostsManager() {
  const { user, hasPermission } = useAuth();
  const canWrite = hasPermission("blog_posts", "write");

  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "blog" | "linkedin">("all");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");
  
  // Form Fields
  const [formType, setFormType] = useState<"blog" | "linkedin">("blog");
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Technology");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load from LocalStorage or default
  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_posts");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        setPosts(DEFAULT_POSTS);
      }
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem("glyptika_admin_posts", JSON.stringify(DEFAULT_POSTS));
    }
  }, []);

  const saveToStorage = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem("glyptika_admin_posts", JSON.stringify(newPosts));
  };

  const handleOpenCreate = (type: "blog" | "linkedin") => {
    if (!canWrite) return;
    setEditingPost(null);
    setFormType(type);
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormCategory(type === "blog" ? "Technology" : "Social");
    setFormImageUrl("");
    setFormUrl("");
    setFormTags("");
    setFormFeatured(false);
    setFormError(null);
    setIsFormOpen(true);
    setEditorMode("edit");
  };

  const handleOpenEdit = (post: Post) => {
    if (!canWrite) return;
    setEditingPost(post);
    setFormType(post.type);
    setFormTitle(post.title);
    setFormExcerpt(post.excerpt || "");
    setFormContent(post.content || "");
    setFormCategory(post.category);
    setFormImageUrl(post.image_url || "");
    setFormUrl(post.url || "");
    setFormTags(post.tags.join(", "));
    setFormFeatured(post.featured);
    setFormError(null);
    setIsFormOpen(true);
    setEditorMode("edit");
  };

  const handleDelete = (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to delete this post?")) {
      const updated = posts.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Simple Zod-like validations
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (formType === "blog" && !formContent.trim()) {
      setFormError("Content is required for blog posts.");
      return;
    }
    if (formType === "linkedin" && !formUrl.trim()) {
      setFormError("Post URL is required for LinkedIn embeds.");
      return;
    }

    const tagArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postData: Post = {
      id: editingPost?.id || `post-${Date.now()}`,
      type: formType,
      title: formTitle,
      excerpt: formExcerpt || undefined,
      content: formType === "blog" ? formContent : undefined,
      category: formCategory,
      image_url: formImageUrl || undefined,
      url: formType === "linkedin" ? formUrl : undefined,
      date: editingPost?.date || new Date().toISOString().split("T")[0],
      tags: tagArray,
      featured: formFeatured,
    };

    let updatedPosts: Post[];
    if (editingPost) {
      updatedPosts = posts.map((p) => (p.id === editingPost.id ? postData : p));
    } else {
      updatedPosts = [postData, ...posts];
    }

    saveToStorage(updatedPosts);
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" ? true : post.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            Blog & Social
          </h1>
          <p className="text-sm text-slate-400">
            Publish articles and integrate LinkedIn feeds
          </p>
        </div>
        {canWrite && (
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenCreate("blog")}
              className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Blog Article</span>
            </button>
            <button
              onClick={() => handleOpenCreate("linkedin")}
              className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>LinkedIn Embed</span>
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, tag, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filterType === "all"
                ? "bg-white/10 text-white border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            All Feed
          </button>
          <button
            onClick={() => setFilterType("blog")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filterType === "blog"
                ? "bg-white/10 text-white border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Blog Articles
          </button>
          <button
            onClick={() => setFilterType("linkedin")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filterType === "linkedin"
                ? "bg-white/10 text-white border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            LinkedIn
          </button>
        </div>
      </div>

      {/* Grid of Feed Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-slate-800 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    post.type === "blog"
                      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                      : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  }`}>
                    {post.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {post.featured && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-bold">{post.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black tracking-tight text-white line-clamp-2 mb-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-500 text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Category: <span className="text-slate-300">{post.category}</span></span>
                <div className="flex items-center gap-2">
                  {post.type === "linkedin" && post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {canWrite && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
            No posts matching query.
          </div>
        )}
      </div>

      {/* CRUD Side Drawer Form (Modal) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div
            onClick={() => setIsFormOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-4xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingPost ? "Edit Content Post" : `New ${formType === "blog" ? "Blog Article" : "LinkedIn Embed"}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingPost ? `Modifying ID: ${editingPost.id}` : "Configure posting properties and tags"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formType === "blog" ? (
                /* Blog Layout with tabbed Markdown preview */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                  {/* Fields Panel */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Article Title
                      </label>
                      <input
                        type="text"
                        placeholder="Peak CPU virtualisation optimization..."
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        placeholder="A short overview snippet..."
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
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
                          <option>Technology</option>
                          <option>Infrastructure</option>
                          <option>Company</option>
                          <option>Engineering</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Cloud, SaaS, AI"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Cover Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border border-white/10 text-blue-500 focus:ring-0"
                      />
                      <label htmlFor="featured" className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                        Pin as Featured Post
                      </label>
                    </div>
                  </div>

                  {/* Markdown Content Editor and Side-by-side Live Preview */}
                  <div className="flex flex-col border border-white/5 rounded-3xl bg-slate-950/40 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-slate-950">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Markdown Editor</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditorMode("edit")}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            editorMode === "edit" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode("preview")}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            editorMode === "preview" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-4 h-full min-h-[300px]">
                      {editorMode === "edit" ? (
                        <textarea
                          placeholder="Write article markdown content here..."
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                          className="w-full h-full bg-transparent border-none focus:outline-none text-xs leading-relaxed text-slate-300 placeholder-slate-650 resize-none font-mono"
                        />
                      ) : (
                        <div className="prose prose-invert prose-xs max-w-none overflow-y-auto h-full text-slate-300 font-sans leading-relaxed">
                          {formContent ? (
                            formContent.split("\n").map((para, i) => {
                              if (para.startsWith("##")) {
                                return <h2 key={i} className="text-base font-black text-white mt-4 mb-2">{para.replace("##", "")}</h2>;
                              }
                              if (para.startsWith("###")) {
                                return <h3 key={i} className="text-sm font-black text-white mt-3 mb-1.5">{para.replace("###", "")}</h3>;
                              }
                              if (para.trim() === "") return <div key={i} className="h-2" />;
                              return <p key={i} className="mb-2 text-xs text-slate-400">{para}</p>;
                            })
                          ) : (
                            <span className="text-slate-600 text-xs italic">Nothing to preview yet.</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* LinkedIn Post Embed Form */
                <div className="space-y-5 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      LinkedIn Post Heading
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Announcement of new IMS portal..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-sm text-white placeholder-slate-650 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Post Excerpt (Social Text)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Copy the key content from the LinkedIn post..."
                      value={formExcerpt}
                      onChange={(e) => setFormExcerpt(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-650 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      LinkedIn Post URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/posts/..."
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-650 focus:outline-none"
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
                        <option>Social</option>
                        <option>Company</option>
                        <option>Media</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="ProductLaunch, SaaS"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white placeholder-slate-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="featured-li"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border border-white/10 text-indigo-500 focus:ring-0"
                    />
                    <label htmlFor="featured-li" className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                      Show first in Feed
                    </label>
                  </div>
                </div>
              )}
            </form>

            {/* Footer action buttons */}
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
                <span>Save Post</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
