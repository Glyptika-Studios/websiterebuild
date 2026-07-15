/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Layers,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  ExternalLink,
  Activity,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string;
  url?: string;
  url_type?: "internal" | "external";
  active: boolean;
  publish: boolean;
  display_order: number;
  bg_image_id?: string;
  icon_image_id?: string;
  created_at: string;
  updated_at: string;
}

export default function ServicesManager() {
  const { user, hasPermission } = useAuth();
  const canWrite = hasPermission("home", "write");

  // State Lists
  const [services, setServices] = useState<Service[]>([]);
  const [mediaImages, setMediaImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");

  // Form Drawer Modal States
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formUrlType, setFormUrlType] = useState<"internal" | "external">("internal");
  const [formActive, setFormActive] = useState(true);
  const [formPublish, setFormPublish] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formBgImageId, setFormBgImageId] = useState("");
  const [formIconImageId, setFormIconImageId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchServicesAndMedia = async () => {
    setLoading(true);
    try {
      const [servicesRes, mediaRes] = await Promise.all([
        api.get<any>("/api/v1/admin/services"),
        api.get<any>("/api/v1/admin/media?media_type=image&limit=100"),
      ]);

      if (servicesRes.success && servicesRes.data) {
        const items = Array.isArray(servicesRes.data) 
          ? servicesRes.data 
          : (servicesRes.data.items || []);
        setServices(items);
      }
      if (mediaRes.success && mediaRes.data) {
        setMediaImages(mediaRes.data.items || []);
      }
    } catch (err: any) {
      console.error("Failed to load services data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndMedia();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormTitle("");
    setFormDescription("");
    setFormUrl("");
    setFormUrlType("internal");
    setFormActive(true);
    setFormPublish(false);
    setFormDisplayOrder(services.length);
    setFormBgImageId("");
    setFormIconImageId("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setFormTitle(svc.title);
    setFormDescription(svc.description || "");
    setFormUrl(svc.url || "");
    setFormUrlType(svc.url_type || "external");
    setFormActive(svc.active);
    setFormPublish(svc.publish);
    setFormDisplayOrder(svc.display_order);
    setFormBgImageId(svc.bg_image_id || "");
    setFormIconImageId(svc.icon_image_id || "");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) {
      alert("You do not have write permission.");
      return;
    }
    if (confirm("Are you sure you want to permanently delete this service?")) {
      try {
        const response = await api.delete<any>(`/api/v1/admin/services/${id}`);
        if (response.success) {
          fetchServicesAndMedia();
        }
      } catch (err: any) {
        alert("Failed to delete service: " + err.message);
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

    // Validations
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (formUrl && !formUrl.startsWith("https://")) {
      setFormError("Custom URL must start with https://");
      return;
    }

    const payload: any = {
      title: formTitle,
      description: formDescription.trim() || null,
      url: formUrl || null,
      url_type: formUrlType,
      active: formActive,
      publish: formPublish,
      display_order: Number(formDisplayOrder),
      bg_image_id: formBgImageId || null,
      icon_image_id: formIconImageId || null,
    };

    setSaving(true);
    try {
      let response;
      if (editingService) {
        // Services API updates via PUT
        response = await api.put<any>(`/api/v1/admin/services/${editingService.id}`, payload);
      } else {
        response = await api.post<any>("/api/v1/admin/services", payload);
      }

      if (response.success) {
        setIsFormOpen(false);
        setEditingService(null);
        fetchServicesAndMedia();
      } else {
        setFormError(response.message || "Failed to save service.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  // Reorder using PATCH /api/v1/admin/services/reorder
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (!canWrite) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const list = [...services];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Map new display order
    const payloadItems = list.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    try {
      const response = await api.patch<any>("/api/v1/admin/services/reorder", {
        items: payloadItems,
      });
      if (response.success) {
        fetchServicesAndMedia();
      }
    } catch (err: any) {
      alert("Failed to update reorder hierarchy: " + err.message);
    }
  };

  const filteredServices = services.filter((svc) => {
    return svc.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-2">
            <Layers className="w-8 h-8 text-blue-450" />
            Services Config
          </h1>
          <p className="text-sm text-slate-400">
            Configure seeded service routing, descriptions, icons, and visibility priority
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 align-self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search services by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      {/* Table Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest font-black">Loading services database...</p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="py-4 px-2">Order</th>
                <th className="py-4 px-2">Service Module</th>
                <th className="py-4 px-2">Custom Route URL</th>
                <th className="py-4 px-2">Active (Form)</th>
                <th className="py-4 px-2">Published (Site)</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredServices.map((svc, index) => (
                <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span>#{svc.display_order}</span>
                      {canWrite && (
                        <div className="flex flex-col text-[8px] leading-none text-slate-600">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, "up")}
                            className="hover:text-blue-400 disabled:opacity-20"
                          >
                            ▲
                          </button>
                          <button
                            disabled={index === filteredServices.length - 1}
                            onClick={() => handleMoveOrder(index, "down")}
                            className="hover:text-blue-400 disabled:opacity-20"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-bold text-white leading-normal">{svc.title}</div>
                    {svc.description && (
                      <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{svc.description}</div>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    {svc.url ? (
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        {svc.url_type} link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-650 italic">Default proposal router</span>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      svc.active
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                    }`}>
                      {svc.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      svc.publish
                        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                    }`}>
                      {svc.publish ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      {canWrite && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(svc)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                            title="Edit Service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(svc.id)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  {editingService ? "Edit Service Module" : "New Service Configuration"}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Configure custom routing path redirects, details description, and icon layouts.
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
                  Service Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom 3D Asset Creation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
              </div>



              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain what this service offers..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Routing Type
                  </label>
                  <select
                    value={formUrlType}
                    onChange={(e: any) => setFormUrlType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-255 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none font-bold"
                  >
                    <option value="external">External Link</option>
                    <option value="internal">Internal Route</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Custom Routing URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Background Banner
                  </label>
                  <select
                    value={formBgImageId}
                    onChange={(e) => setFormBgImageId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-255 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none font-bold"
                  >
                    <option value="">No Background</option>
                    {mediaImages.map((img) => (
                      <option key={img.id} value={img.id}>
                        {img.file_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Vector Icon
                  </label>
                  <select
                    value={formIconImageId}
                    onChange={(e) => setFormIconImageId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-255 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none font-bold"
                  >
                    <option value="">No Icon</option>
                    {mediaImages.map((img) => (
                      <option key={img.id} value={img.id}>
                        {img.file_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-50/50 mt-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-350 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="active" className="text-xs font-black uppercase tracking-wider text-slate-700 select-none">
                    Active (Allows selection)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={formPublish}
                    onChange={(e) => setFormPublish(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-350 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="publish" className="text-xs font-black uppercase tracking-wider text-slate-700 select-none">
                    Publish (Render Card)
                  </label>
                </div>
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
                  {saving ? "Saving Changes..." : "Save Configuration"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
