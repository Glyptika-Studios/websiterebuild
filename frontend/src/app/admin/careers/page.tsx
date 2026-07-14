/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Gift,
} from "lucide-react";

interface PositionItem {
  id: string;
  kind: "responsibility" | "requirement" | "benefit";
  body: string;
  display_order: number;
}

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PositionWithItems extends Position {
  items: {
    responsibilities: PositionItem[];
    requirements: PositionItem[];
    benefits: PositionItem[];
  };
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export default function CareersManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("careers", "write");

  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionWithItems | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState("Full-time");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Position items (local during edit)
  const [formItems, setFormItems] = useState<PositionItem[]>([]);
  const [newItemBody, setNewItemBody] = useState("");
  const [newItemKind, setNewItemKind] = useState<"responsibility" | "requirement" | "benefit">("responsibility");

  // Items that need to be created/deleted on save
  const [itemsToCreate, setItemsToCreate] = useState<{ kind: string; body: string }[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);

  // ─── Fetch positions from API ──────────────────────────────
  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/api/v1/admin/positions?limit=100");
      if (res.success && res.data) {
        setPositions(res.data.items || []);
      }
    } catch (err: any) {
      console.error("Failed to load positions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ─── Open Create Form ──────────────────────────────────────
  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingPosition(null);
    setFormTitle("");
    setFormDepartment("");
    setFormLocation("");
    setFormType("Full-time");
    setFormDescription("");
    setFormActive(true);
    setFormItems([]);
    setItemsToCreate([]);
    setItemsToDelete([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  // ─── Open Edit Form ────────────────────────────────────────
  const handleOpenEdit = async (pos: Position) => {
    if (!canWrite) return;
    setFormError(null);
    setIsFormOpen(true);
    setSaving(true);

    try {
      const res = await api.get<any>(`/api/v1/admin/positions/${pos.id}`);
      if (res.success && res.data) {
        const full: PositionWithItems = res.data;
        setEditingPosition(full);
        setFormTitle(full.title);
        setFormDepartment(full.department);
        setFormLocation(full.location);
        setFormType(full.employment_type);
        setFormDescription(full.description || "");
        setFormActive(full.active);

        // Flatten items for display
        const allItems = [
          ...(full.items.responsibilities || []),
          ...(full.items.requirements || []),
          ...(full.items.benefits || []),
        ];
        setFormItems(allItems);
        setItemsToCreate([]);
        setItemsToDelete([]);
      }
    } catch (err: any) {
      setFormError("Failed to load position details: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Position ───────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!canWrite) return;
    if (!confirm("Are you sure you want to delete this position? All associated items will also be removed.")) return;

    try {
      await api.delete(`/api/v1/admin/positions/${id}`);
      await fetchPositions();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  // ─── Add item to local list ────────────────────────────────
  const handleAddItem = () => {
    if (!newItemBody.trim()) return;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const item: PositionItem = {
      id: tempId,
      kind: newItemKind,
      body: newItemBody.trim(),
      display_order: formItems.length,
    };
    setFormItems([...formItems, item]);
    setItemsToCreate([...itemsToCreate, { kind: newItemKind, body: newItemBody.trim() }]);
    setNewItemBody("");
  };

  // ─── Remove item from local list ──────────────────────────
  const handleRemoveItem = (item: PositionItem) => {
    setFormItems(formItems.filter((i) => i.id !== item.id));
    if (item.id.startsWith("temp-")) {
      // Remove from create queue
      setItemsToCreate(itemsToCreate.filter((c) => c.body !== item.body || c.kind !== item.kind));
    } else {
      // Mark real item for deletion
      setItemsToDelete([...itemsToDelete, item.id]);
    }
  };

  // ─── Save Position ─────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) { setFormError("Job title is required."); return; }
    if (!formDepartment.trim()) { setFormError("Department is required."); return; }
    if (!formLocation.trim()) { setFormError("Location is required."); return; }

    setSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        department: formDepartment.trim(),
        location: formLocation.trim(),
        employment_type: formType,
        description: formDescription.trim() || null,
        active: formActive,
      };

      let positionId: string;

      if (editingPosition) {
        // Update position
        await api.put(`/api/v1/admin/positions/${editingPosition.id}`, payload);
        positionId = editingPosition.id;

        // Delete removed items
        for (const iid of itemsToDelete) {
          await api.delete(`/api/v1/admin/positions/${positionId}/items/${iid}`);
        }
      } else {
        // Create position
        const res = await api.post<any>("/api/v1/admin/positions", payload);
        positionId = res.data.id;
      }

      // Create new items
      for (const item of itemsToCreate) {
        await api.post(`/api/v1/admin/positions/${positionId}/items`, {
          kind: item.kind,
          body: item.body,
        });
      }

      setIsFormOpen(false);
      setEditingPosition(null);
      await fetchPositions();
    } catch (err: any) {
      setFormError(err.message || "Failed to save position.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Filter ────────────────────────────────────────────────
  const filteredPositions = positions.filter((pos) =>
    pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pos.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pos.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Job Positions
          </h1>
          <p className="text-sm text-slate-400">
            Publish, edit, and archive organizational job openings
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search listings by title, department, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all"
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-3 text-sm text-slate-400">Loading positions...</span>
        </div>
      ) : (
        /* Job Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPositions.length > 0 ? (
            filteredPositions.map((pos) => (
              <div
                key={pos.id}
                className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-slate-800 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      pos.active
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-slate-500 bg-slate-500/5 border-slate-500/15"
                    }`}>
                      {pos.active ? "Active" : "Archived"}
                    </span>
                    <div className="flex gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <span>{pos.department}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white mb-2 leading-tight">
                    {pos.title}
                  </h3>
                  {pos.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">
                      {pos.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{pos.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{pos.employment_type}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="text-[10px]">
                    Created {new Date(pos.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1.5">
                    {canWrite && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(pos)}
                          className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pos.id)}
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
              No openings found.
            </div>
          )}
        </div>
      )}

      {/* ─── Centered Editor Modal (matches Services/Posts style) ─── */}
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
                  {editingPosition ? "Edit Job Listing" : "New Job Opening"}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Define position details, responsibilities, requirements, and benefits.
                </p>
              </div>
              <button
                onClick={() => { if (!saving) setIsFormOpen(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-red-600 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Fields */}
            <form onSubmit={handleSave} className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Infrastructure Engineer"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Department + Employment Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Department *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Employment Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 focus:outline-none transition-all"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote / Bangalore (Hybrid)"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="A brief summary of the role..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="careers-active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-white border border-slate-300 text-blue-500 focus:ring-blue-200"
                />
                <label htmlFor="careers-active" className="text-xs font-bold text-slate-600 select-none">
                  Active (Accepting Applications)
                </label>
              </div>

              {/* Divider */}
              <div className="border-t border-blue-50 pt-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">
                  Responsibilities, Requirements & Benefits
                </p>

                {/* Items list */}
                <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 rounded-xl bg-white border border-slate-200 space-y-2 mb-3">
                  {formItems.length > 0 ? (
                    formItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-normal"
                      >
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider shrink-0 mt-0.5 border ${
                          item.kind === "responsibility"
                            ? "text-blue-600 bg-blue-50 border-blue-200"
                            : item.kind === "requirement"
                            ? "text-purple-600 bg-purple-50 border-purple-200"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200"
                        }`}>
                          {item.kind}
                        </span>
                        <p className="flex-1 text-slate-700 leading-normal">{item.body}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md shrink-0 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-6">
                      No items added yet. Add details below.
                    </div>
                  )}
                </div>

                {/* Add item sub-form */}
                <div className="flex gap-2">
                  <select
                    value={newItemKind}
                    onChange={(e) => setNewItemKind(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-700 focus:outline-none shrink-0"
                  >
                    <option value="responsibility">Responsibility</option>
                    <option value="requirement">Requirement</option>
                    <option value="benefit">Benefit</option>
                  </select>
                  <input
                    type="text"
                    placeholder="e.g. 5+ years of Go/Rust experience..."
                    value={newItemBody}
                    onChange={(e) => setNewItemBody(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddItem(); } }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Buttons */}
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
                <span>{saving ? "Saving..." : "Save Listing"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
