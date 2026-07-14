/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
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
  Loader2,
  Link2,
} from "lucide-react";

interface MediaFile {
  id: string;
  public_url: string;
  file_name: string;
}

interface Category {
  id: string;
  label: string;
  slug: string;
}

interface EntityMedia {
  id: string;
  display_order: number;
  media: {
    id: string;
    public_url: string;
  };
}

interface Product {
  id: string;
  title: string;
  overview: string | null;
  description: string | null;
  category_id: string | null;
  cover_id: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
  published_at: string;
  created_at: string;
  category: Category | null;
  cover: MediaFile | null;
  entity_media: EntityMedia[];
  tags?: string[];
}

export default function ProjectsManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("products", "write");

  // Data lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaImages, setMediaImages] = useState<MediaFile[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal open
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState("");
  const [formOverview, setFormOverview] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formCoverId, setFormCoverId] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<"draft" | "published" | "archived">("draft");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Media gallery local changes
  const [formMedia, setFormMedia] = useState<EntityMedia[]>([]);
  const [selectedGalleryImageId, setSelectedGalleryImageId] = useState("");
  const [mediaToCreate, setMediaToCreate] = useState<string[]>([]);
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, mediaRes, tagsRes] = await Promise.all([
        api.get<any>("/api/v1/admin/products?limit=100"),
        api.get<any>("/api/v1/admin/categories?scope=product"),
        api.get<any>("/api/v1/admin/media?media_type=image&limit=100"),
        api.get<any>("/api/v1/admin/tags"),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.items || []);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.items || categoriesRes.data || []);
      }
      if (mediaRes.success && mediaRes.data) {
        setMediaImages(mediaRes.data.items || []);
      }
      if (tagsRes.success && tagsRes.data) {
        setAllTags(tagsRes.data.items || tagsRes.data || []);
      }
    } catch (err: any) {
      console.error("Failed to load products page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingProduct(null);
    setFormTitle("");
    setFormOverview("");
    setFormDescription("");
    setFormCategory(categories[0]?.id || "");
    setFormCoverId("");
    setFormFeatured(false);
    setFormStatus("draft");
    setFormPublishedAt(new Date().toISOString().split("T")[0]);
    setFormMedia([]);
    setMediaToCreate([]);
    setMediaToDelete([]);
    setSelectedGalleryImageId("");
    setFormTags([]);
    setNewTagInput("");
    setShowNewCategoryInput(false);
    setNewCategoryLabel("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    if (!canWrite) return;
    setEditingProduct(prod);
    setFormTitle(prod.title);
    setFormOverview(prod.overview || "");
    setFormDescription(prod.description || "");
    setFormCategory(prod.category_id || "");
    setFormCoverId(prod.cover_id || "");
    setFormFeatured(prod.featured);
    setFormStatus(prod.status);
    setFormPublishedAt(prod.published_at ? prod.published_at.split("T")[0] : new Date().toISOString().split("T")[0]);
    setFormMedia(prod.entity_media || []);
    setMediaToCreate([]);
    setMediaToDelete([]);
    setSelectedGalleryImageId("");
    setFormTags(prod.tags || []);
    setNewTagInput("");
    setShowNewCategoryInput(false);
    setNewCategoryLabel("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) return;
    if (!confirm("Are you sure you want to delete this product? All pricing and modules will also be deleted.")) return;

    try {
      await api.delete(`/api/v1/admin/products/${id}`);
      await fetchData();
    } catch (err: any) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const handleAddMedia = () => {
    if (!selectedGalleryImageId) return;

    const img = mediaImages.find((m) => m.id === selectedGalleryImageId);
    if (!img) return;

    // Check duplicate
    if (formMedia.some((m) => m.media.id === img.id)) return;

    const tempId = `temp-${Date.now()}`;
    const newMedia: EntityMedia = {
      id: tempId,
      display_order: formMedia.length,
      media: {
        id: img.id,
        public_url: img.public_url,
      },
    };

    setFormMedia([...formMedia, newMedia]);
    setMediaToCreate([...mediaToCreate, img.id]);
    setSelectedGalleryImageId("");
  };

  const handleRemoveMedia = (m: EntityMedia) => {
    setFormMedia(formMedia.filter((item) => item.id !== m.id));
    if (m.id.startsWith("temp-")) {
      setMediaToCreate(mediaToCreate.filter((id) => id !== m.media.id));
    } else {
      setMediaToDelete([...mediaToDelete, m.id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError("Product Title is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        overview: formOverview.trim() || null,
        description: formDescription.trim() || null,
        category_id: formCategory || null,
        cover_id: formCoverId || null,
        featured: formFeatured,
        status: formStatus,
        published_at: formPublishedAt || new Date().toISOString().split("T")[0],
        tags: formTags,
      };

      let productId = "";

      if (editingProduct) {
        // Update product
        const res = await api.put<any>(`/api/v1/admin/products/${editingProduct.id}`, payload);
        productId = editingProduct.id;

        // Perform deletions
        for (const emid of mediaToDelete) {
          await api.delete(`/api/v1/admin/products/${productId}/media/${emid}`);
        }
      } else {
        // Create product
        const res = await api.post<any>("/api/v1/admin/products", payload);
        productId = res.data.id;
      }

      // Perform additions
      for (let i = 0; i < mediaToCreate.length; i++) {
        const fileId = mediaToCreate[i];
        await api.post(`/api/v1/admin/products/${productId}/media`, {
          media_file_id: fileId,
          display_order: i + 10,
        });
      }

      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchData();
    } catch (err: any) {
      setFormError(err.message || "Failed to save product configurations.");
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
        scope: "product",
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

  const filteredProducts = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.overview && p.overview.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Products
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manage public platform products and software showcases
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search products by title, overview, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-3 text-sm text-slate-400">Loading portfolio products...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-slate-800 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      prod.status === "published"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : prod.status === "draft"
                        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                    }`}>
                      {prod.status}
                    </span>
                    <div className="flex items-center gap-2">
                      {prod.featured && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-bold">
                        {prod.published_at ? new Date(prod.published_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-slate-950 flex items-center justify-center">
                      {prod.cover ? (
                        <img src={prod.cover.public_url} alt="" className="object-cover w-full h-full" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-slate-650" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight text-white leading-tight mb-1">
                        {prod.title}
                      </h3>
                      {prod.category && (
                        <div className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">
                          Category: {prod.category.label}
                        </div>
                      )}
                      {prod.tags && prod.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {prod.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {prod.overview && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {prod.overview}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{(prod.entity_media || []).length} media gallery items</span>
                  </span>
                  <div className="flex gap-1.5">
                    {canWrite && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
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
              No products found matching query.
            </div>
          )}
        </div>
      )}

      {/* CRUD Centered Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => { if (!saving) setIsFormOpen(false); }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-[#f8fafc] border border-blue-100 rounded-[32px] shadow-[0_24px_64px_rgba(37,99,235,0.12)] z-10 flex flex-col p-8 space-y-6 max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-50/50 pb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {editingProduct ? "Edit Product specs" : "New Product Configuration"}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Configure visual details, category links, featured status, and media gallery assets.
                </p>
              </div>
              <button
                onClick={() => { if (!saving) setIsFormOpen(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-650 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form inputs */}
            <form onSubmit={handleSave} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Glyptika Headless CMS"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Category *
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
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {creatingCategory ? "..." : "Add"}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-700 focus:outline-none transition-all font-bold"
                    >
                      <option value="">No Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Publish Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-700 focus:outline-none transition-all"
                  >
                    <option value="draft">Draft (Internal)</option>
                    <option value="published">Published (Site)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Select Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Cover Image (Media Library)
                </label>
                <select
                  value={formCoverId}
                  onChange={(e) => setFormCoverId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-750 focus:outline-none transition-all"
                >
                  <option value="">No Cover Image</option>
                  {mediaImages.map((img) => (
                    <option key={img.id} value={img.id}>{img.file_name} ({img.public_url.substring(0, 45)}...)</option>
                  ))}
                </select>
              </div>

              {/* Tags Section */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Product Tags
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
                                : "bg-slate-200 text-slate-700 border border-slate-300 hover:border-slate-450"
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

              {/* Tagline Overview */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Overview (Short tagline)
                </label>
                <textarea
                  rows={2}
                  placeholder="A short descriptive tagline shown on portfolio cards..."
                  value={formOverview}
                  onChange={(e) => setFormOverview(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  placeholder="The detailed description of this product, capabilities, and solutions..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Publish Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={formPublishedAt}
                  onChange={(e) => setFormPublishedAt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="prod-featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-white border border-slate-300 text-blue-500 focus:ring-blue-200"
                />
                <label htmlFor="prod-featured" className="text-xs font-bold text-slate-600 select-none">
                  Featured Product (Shown at top)
                </label>
              </div>

              {/* Media Gallery divider */}
              <div className="border-t border-blue-50 pt-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">
                  Media Gallery Assets (Media Library)
                </p>

                {/* Gallery images display list */}
                <div className="min-h-[90px] max-h-[160px] overflow-y-auto p-3 rounded-xl bg-white border border-slate-200 space-y-2 mb-3">
                  {formMedia.length > 0 ? (
                    formMedia.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-none"
                      >
                        <div className="relative w-8 h-8 rounded overflow-hidden border border-slate-200 shrink-0 bg-slate-200">
                          <img src={m.media.public_url} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-slate-600 font-mono text-[9px]">{m.media.public_url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(m)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md shrink-0 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-4">
                      No gallery assets linked yet. Add below.
                    </div>
                  )}
                </div>

                {/* Add to gallery layout */}
                <div className="flex gap-2">
                  <select
                    value={selectedGalleryImageId}
                    onChange={(e) => setSelectedGalleryImageId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="">Select Image to Add</option>
                    {mediaImages
                      .filter((img) => !formMedia.some((m) => m.media.id === img.id))
                      .map((img) => (
                        <option key={img.id} value={img.id}>{img.file_name}</option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={!selectedGalleryImageId}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Link Asset
                  </button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-blue-50 pt-4">
              <button
                type="button"
                onClick={() => { if (!saving) setIsFormOpen(false); }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Configuration"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
