/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Activity,
  Link2,
} from "lucide-react";

interface Post {
  id: string;
  type: "blog" | "linkedin";
  title: string;
  excerpt?: string;
  category_id?: string;
  category?: { id: string; label: string; slug: string };
  published_at?: string;
  image_id?: string;
  image?: { id: string; public_url: string };
  tags: string[];
  featured: boolean;
  linkedin_url?: string;
}

export default function PostsManager() {
  const { user, hasPermission } = useAuth();
  const canWrite = hasPermission("home", "write");

  // Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [mediaImages, setMediaImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");

  // Form Modal States
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImageId, setFormImageId] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch all posts, categories, and media images
  const fetchPostsAndData = async () => {
    setLoading(true);
    try {
      const [postsRes, categoriesRes, mediaRes, tagsRes] = await Promise.all([
        api.get<any>("/api/v1/admin/posts?limit=100"),
        api.get<any>("/api/v1/admin/categories?scope=post"),
        api.get<any>("/api/v1/admin/media?media_type=image&limit=100"),
        api.get<any>("/api/v1/admin/tags"),
      ]);

      if (postsRes.success && postsRes.data) {
        setPosts(postsRes.data.posts || []);
      }
      if (categoriesRes.success && categoriesRes.data) {
        const items = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : (categoriesRes.data.items || []);
        setCategories(items);
      }
      if (mediaRes.success && mediaRes.data) {
        setMediaImages(mediaRes.data.items || []);
      }
      if (tagsRes.success && tagsRes.data) {
        setAllTags(tagsRes.data.items || tagsRes.data || []);
      }
    } catch (err: any) {
      console.error("Failed to load posts data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormCategory(categories[0]?.id || "");
    setFormImageId("");
    setFormImageUrl("");
    setFormUrl("");
    setFormTags([]);
    setNewTagInput("");
    setShowNewCategoryInput(false);
    setNewCategoryLabel("");
    setFormFeatured(false);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormExcerpt(post.excerpt || "");
    setFormCategory(post.category_id || "");
    setFormImageId(post.image_id || "");
    setFormImageUrl(post.image?.public_url || "");
    setFormUrl(post.linkedin_url || "");
    setFormTags(post.tags || []);
    setNewTagInput("");
    setShowNewCategoryInput(false);
    setNewCategoryLabel("");
    setFormFeatured(post.featured);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) {
      alert("You do not have write permission.");
      return;
    }
    if (confirm("Are you sure you want to permanently delete this post?")) {
      try {
        const response = await api.delete<any>(`/api/v1/admin/posts/${id}`);
        if (response.success) {
          fetchPostsAndData();
        }
      } catch (err: any) {
        alert("Failed to delete post: " + err.message);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!canWrite) {
      setFormError("You do not have write permission.");
      return;
    }

    // Form validation
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (!formUrl.trim()) {
      setFormError("Redirect URL is required.");
      return;
    }

    if (!formUrl.startsWith("https://")) {
      setFormError("Redirect URL must start with https://");
      return;
    }

    const postPayload: any = {
      type: "linkedin", // Set to linkedin so database constraint requiring URL checks pass
      title: formTitle,
      excerpt: formExcerpt || null,
      content: "Redirect link", // Placeholder content to satisfy db constraint
      category_id: formCategory && formCategory.trim() !== "" ? formCategory : null,
      image_id: formImageId && formImageId.trim() !== "" ? formImageId : null,
      linkedin_url: formUrl.trim(),
      tags: formTags,
      featured: formFeatured,
    };

    setSaving(true);
    try {
      let response;
      if (editingPost) {
        response = await api.patch<any>(`/api/v1/admin/posts/${editingPost.id}`, postPayload);
      } else {
        response = await api.post<any>("/api/v1/admin/posts", postPayload);
      }

      if (response.success) {
        setIsFormOpen(false);
        setEditingPost(null);
        fetchPostsAndData();
      } else {
        setFormError(response.message || "Failed to save post.");
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving the post.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    const label = newCategoryLabel.trim();
    if (!label) return;
    setCreatingCategory(true);
    try {
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await api.post<any>("/api/v1/admin/categories", {
        label,
        slug,
        scope: "post",
        display_order: 0,
        active: true
      });
      if (res.success && res.data) {
        setCategories([...categories, res.data]);
        setFormCategory(res.data.id);
        setNewCategoryLabel("");
        setShowNewCategoryInput(false);
      } else {
        alert(res.message || "Failed to create category");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category?.label || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Draft";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Draft";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-2">
            <Link2 className="w-8 h-8 text-blue-450" />
            Blog & Social
          </h1>
          <p className="text-sm text-slate-400">
            Publish external redirects, articles, and link feeds
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 align-self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Blog</span>
          </button>
        )}
      </div>

      {/* Search */}
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
      </div>

      {/* Grid of Feed Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest font-black">Loading feed items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-slate-800 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                      Link Redirect
                    </span>
                    <div className="flex items-center gap-1.5">
                      {post.featured && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-bold">
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    {post.image?.public_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-slate-950">
                        <img src={post.image.public_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg font-black tracking-tight text-white line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(post.tags || []).map((tag) => (
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
                  <span className="text-slate-500">
                    Category: <span className="text-slate-300">{post.category?.label || "General"}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {post.linkedin_url && (
                      <a
                        href={post.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"
                        title="Open link"
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
      )}

      {/* CRUD Centered Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setIsFormOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-[#f8fafc] border border-blue-100 rounded-[32px] shadow-[0_24px_64px_rgba(37,99,235,0.12)] z-10 flex flex-col p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-50/50 pb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {editingPost ? "Edit Redirect Post" : "Add New Blog Link"}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Configure post routing parameters and description.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-650 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Fields Form */}
            <form onSubmit={handleSave} className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Heading / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Glyptika launches Spatial Engine V2"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Redirect URL *
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/redirect-target"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none font-mono transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Description / Excerpt
                </label>
                <textarea
                  rows={3}
                  placeholder="A short overview description of the post..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                      className="text-[9px] font-bold text-blue-500 hover:text-blue-600 underline"
                    >
                      {showNewCategoryInput ? "Cancel" : "+ New"}
                    </button>
                  </div>
                  {showNewCategoryInput ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Type new category..."
                        value={newCategoryLabel}
                        onChange={(e) => setNewCategoryLabel(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-250 rounded-xl text-xs text-slate-800 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={creatingCategory}
                        className="px-3 py-2 bg-blue-650 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {creatingCategory ? "..." : "Add"}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-255 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none font-bold"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Insights Tags
                </label>
                
                {/* Selected Tags Display */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formTags.length === 0 ? (
                    <span className="text-xs text-slate-400 italic font-mono">No tags selected</span>
                  ) : (
                    formTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md text-blue-600 bg-blue-50 border border-blue-150"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setFormTags(formTags.filter((t) => t !== tag))}
                          className="hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Popular Tags List to click and toggle */}
                {allTags.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Available Tags:</span>
                    <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto border border-slate-100 p-2 rounded-lg bg-slate-50/50">
                      {allTags.map((t) => {
                        const isSelected = formTags.includes(t.label);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormTags(formTags.filter((tag) => tag !== t.label));
                              } else {
                                setFormTags([...formTags, t.label]);
                              }
                            }}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white border border-blue-600"
                                : "bg-slate-200 text-slate-700 border border-slate-300 hover:border-slate-455"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom tag name..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-250 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const tag = newTagInput.trim();
                        if (tag && !formTags.includes(tag)) {
                          setFormTags([...formTags, tag]);
                          setNewTagInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const tag = newTagInput.trim();
                      if (tag && !formTags.includes(tag)) {
                        setFormTags([...formTags, tag]);
                        setNewTagInput("");
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Cover Image
                </label>
                <select
                  value={formImageId}
                  onChange={(e) => {
                    setFormImageId(e.target.value);
                    const imgObj = mediaImages.find((img) => img.id === e.target.value);
                    setFormImageUrl(imgObj ? imgObj.public_url : "");
                  }}
                  className="w-full px-3 py-2.5 bg-white border border-slate-255 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none font-bold"
                >
                  <option value="">No Cover Image</option>
                  {mediaImages.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.file_name}
                    </option>
                  ))}
                </select>
                {formImageUrl && (
                  <div className="mt-2 w-32 aspect-video rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                    <img src={formImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-blue-50/50 mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-350 text-blue-600 focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs font-black uppercase tracking-wider text-slate-700 select-none">
                  Pin as Featured (Ranks at Top)
                </label>
              </div>
            </form>

            {/* Footer actions */}
            <div className="border-t border-blue-50/50 pt-4 flex gap-3 justify-end bg-transparent">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-550 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              {canWrite && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-750 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Link"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
