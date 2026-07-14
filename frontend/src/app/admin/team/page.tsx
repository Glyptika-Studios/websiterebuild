/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Maximize,
  Loader2,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  bio?: string;
  linkedin_url?: string;
  display_order: number;
  active: boolean;
  position_id?: string | null;
  position?: {
    id: string;
    title: string;
    department: string;
  } | null;
  photo_id?: string | null;
  photo?: {
    id: string;
    public_url: string;
    file_name: string;
  } | null;
}

interface TeamLayout {
  columns_mobile: number;
  columns_tablet: number;
  columns_desktop: number;
  columns_xl: number;
}

const DEFAULT_LAYOUT: TeamLayout = {
  columns_mobile: 2,
  columns_tablet: 3,
  columns_desktop: 4,
  columns_xl: 5
};

export default function TeamManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("team", "write");

  // Data States
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [layout, setLayout] = useState<TeamLayout>(DEFAULT_LAYOUT);

  // UX States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formPositionId, setFormPositionId] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formPhotoId, setFormPhotoId] = useState("");
  const [formLinkedinUrl, setFormLinkedinUrl] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Page Content settings state
  const [pageHeadline, setPageHeadline] = useState("");
  const [pageSubheadline, setPageSubheadline] = useState("");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch team members
      const teamRes = await api.get<any>("/api/v1/admin/team?limit=100");
      if (teamRes.success && teamRes.data) {
        const list = teamRes.data.items || [];
        // Ensure sorted by display_order initially
        const sorted = [...list].sort((a, b) => a.display_order - b.display_order);
        setMembers(sorted);
      }

      // 2. Fetch page content (headline, subheadline, layout)
      try {
        const pageRes = await api.get<any>("/api/v1/admin/pages/team");
        if (pageRes.success && pageRes.data) {
          const dbContent = pageRes.data.content || {};
          setPageHeadline(dbContent.headline || "Meet the Innovators");
          setPageSubheadline(dbContent.subheadline || "The engineers, artists, and strategists behind our bleeding-edge digital ecosystems.");
          if (dbContent.layout) {
            setLayout(dbContent.layout);
          }
        }
      } catch (err) {
        console.error("Failed to load page config, using defaults:", err);
        setPageHeadline("Meet the Innovators");
        setPageSubheadline("The engineers, artists, and strategists behind our bleeding-edge digital ecosystems.");
      }

      // 3. Fetch positions
      const posRes = await api.get<any>("/api/v1/admin/positions?limit=100");
      if (posRes.success && posRes.data) {
        setPositions(posRes.data.items || []);
      }

      // 4. Fetch image media files for photo picker
      const mediaRes = await api.get<any>("/api/v1/admin/media?media_type=image&limit=100");
      if (mediaRes.success && mediaRes.data) {
        setMediaFiles(mediaRes.data.items || []);
      }
    } catch (err: any) {
      console.error("Failed to load admin team page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    setSavingSettings(true);
    setSettingsError(null);
    setSettingsSuccess(false);

    try {
      const payload = {
        content: {
          headline: pageHeadline,
          subheadline: pageSubheadline,
          layout: layout
        }
      };
      const res = await api.put<any>("/api/v1/admin/pages/team", payload);
      if (res.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        setSettingsError("Failed to save team settings.");
      }
    } catch (err: any) {
      setSettingsError(err.message || "An error occurred while saving team settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingMember(null);
    setFormName("");
    setFormPositionId("");
    setFormBio("");
    setFormPhotoId("");
    setFormLinkedinUrl("");
    setFormActive(true);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    if (!canWrite) return;
    setEditingMember(member);
    setFormName(member.name);
    setFormPositionId(member.position?.id || member.position_id || "");
    setFormBio(member.bio || "");
    setFormPhotoId(member.photo?.id || member.photo_id || "");
    setFormLinkedinUrl(member.linkedin_url || "");
    setFormActive(member.active);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to remove this team member?")) {
      try {
        const res = await api.delete<any>(`/api/v1/admin/team/${id}`);
        if (res.success) {
          setMembers(members.filter((m) => m.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete team member: " + err.message);
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!canWrite) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= members.length) return;

    const updated = [...members];
    // Swap display_order property values
    const tempOrder = updated[index].display_order;
    updated[index].display_order = updated[targetIdx].display_order;
    updated[targetIdx].display_order = tempOrder;

    // Sort updated list by display_order
    const sorted = [...updated].sort((a, b) => a.display_order - b.display_order);

    try {
      const orderPayload = sorted.map((m, idx) => ({
        id: m.id,
        display_order: idx + 1
      }));

      const res = await api.patch<any>("/api/v1/admin/team/reorder", { order: orderPayload });
      if (res.success) {
        setMembers(sorted.map((m, idx) => ({ ...m, display_order: idx + 1 })));
      }
    } catch (err: any) {
      alert("Failed to reorder team members: " + err.message);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: formName.trim(),
        position_id: formPositionId ? formPositionId : null,
        bio: formBio.trim() ? formBio.trim() : null,
        photo_id: formPhotoId ? formPhotoId : null,
        linkedin_url: formLinkedinUrl.trim() ? formLinkedinUrl.trim() : null,
        active: formActive,
      };

      if (editingMember) {
        // Update API
        const res = await api.put<any>(`/api/v1/admin/team/${editingMember.id}`, payload);
        if (res.success && res.data) {
          setMembers(members.map((m) => (m.id === editingMember.id ? res.data : m)));
          setIsFormOpen(false);
          setEditingMember(null);
        }
      } else {
        // Create API
        const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.display_order)) : 0;
        payload.display_order = maxOrder + 1;
        const res = await api.post<any>("/api/v1/admin/team", payload);
        if (res.success && res.data) {
          setMembers([...members, res.data]);
          setIsFormOpen(false);
          setEditingMember(null);
        }
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving the profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-bold uppercase tracking-wider">Loading team data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Team Profiles
          </h1>
          <p className="text-sm text-slate-400">
            Configure member bios and responsive public team grid layouts
          </p>
        </div>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Grid Layout Configuration Panel */}
      <form onSubmit={handleSavePageSettings} className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white tracking-wide">
              Team Page Settings & Layout
            </h3>
          </div>
          {canWrite && (
            <button
              type="submit"
              disabled={savingSettings}
              className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5"
            >
              {savingSettings && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{savingSettings ? "Saving..." : "Save Settings"}</span>
            </button>
          )}
        </div>

        {settingsSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex gap-2 items-center">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {settingsError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex gap-2 items-center">
            <AlertCircle className="w-4 h-4" />
            <span>{settingsError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Page Headline
            </label>
            <input
              type="text"
              value={pageHeadline}
              disabled={!canWrite}
              onChange={(e) => setPageHeadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              placeholder="e.g. Meet the Innovators"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Page Subheadline
            </label>
            <input
              type="text"
              value={pageSubheadline}
              disabled={!canWrite}
              onChange={(e) => setPageSubheadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              placeholder="e.g. The engineers behind our bleeding-edge digital ecosystems."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
          {/* Mobile */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-650" />
              <span>Mobile Layout</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={3}
                disabled={!canWrite}
                value={layout.columns_mobile}
                onChange={(e) => setLayout({ ...layout, columns_mobile: Number(e.target.value) })}
                className="w-16 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">Columns</span>
            </div>
          </div>

          {/* Tablet */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tablet className="w-3.5 h-3.5 text-slate-650" />
              <span>Tablet Layout</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={2}
                max={4}
                disabled={!canWrite}
                value={layout.columns_tablet}
                onChange={(e) => setLayout({ ...layout, columns_tablet: Number(e.target.value) })}
                className="w-16 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">Columns</span>
            </div>
          </div>

          {/* Desktop */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-650" />
              <span>Desktop Layout</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={3}
                max={5}
                disabled={!canWrite}
                value={layout.columns_desktop}
                onChange={(e) => setLayout({ ...layout, columns_desktop: Number(e.target.value) })}
                className="w-16 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">Columns</span>
            </div>
          </div>

          {/* Extra Large */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5 text-slate-650" />
              <span>XL Layout</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={4}
                max={6}
                disabled={!canWrite}
                value={layout.columns_xl}
                onChange={(e) => setLayout({ ...layout, columns_xl: Number(e.target.value) })}
                className="w-16 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">Columns</span>
            </div>
          </div>
        </div>
      </form>

      {/* Members Sorting and CRUD List */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
          Team Roster & Display Priority
        </span>

        <div className="space-y-4">
          {members.length > 0 ? (
            members.map((member, index) => {
              const photoUrl = member.photo?.public_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name) + "&background=1A73E8&color=ffffff&size=200";
              const positionTitle = member.position?.title || "No Linked Position";

              return (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Photo thumbnail */}
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-slate-950 shrink-0">
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-black text-white leading-none">{member.name}</h4>
                        {!member.active && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-950 border border-white/10 text-slate-505">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-blue-400 font-bold leading-none mb-1">{positionTitle}</p>
                      {member.bio && <p className="text-[10px] text-slate-500 truncate max-w-md">{member.bio}</p>}
                    </div>
                  </div>

                  {/* Priority Shifter & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center gap-1.5 bg-slate-950/40 border border-white/5 rounded-2xl p-1">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || !canWrite}
                        className="p-1.5 text-slate-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-slate-400 font-black px-1">
                        {member.display_order}
                      </span>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === members.length - 1 || !canWrite}
                        className="p-1.5 text-slate-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-1">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-500 hover:text-[#0077b5] transition-colors"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {canWrite && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl border border-transparent hover:border-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-white/5 rounded-3xl">
              No team members registered.
            </div>
          )}
        </div>
      </div>

      {/* Editor Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingMember ? "Edit Team Member" : "Add Team Profile"}
                </h3>
                <p className="text-xs text-slate-500">Configure profile, bio and social networks</p>
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
            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Mehta"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Role Position *
                </label>
                <select
                  value={formPositionId}
                  onChange={(e) => setFormPositionId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none font-bold [&>option]:bg-[#0a1122]"
                >
                  <option value="">No Linked Position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.title} ({pos.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about their background and expertise..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Profile Photo
                </label>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Upload images in{" "}
                  <a href="/admin/media" target="_blank" className="text-blue-400 hover:underline">Media Library</a>
                  {" "}— they appear here automatically.
                </p>
                <div className="flex gap-3 items-center">
                  {/* Live thumbnail */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                    <img
                      src={
                        mediaFiles.find((img: any) => img.id === formPhotoId)?.public_url ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(formName || "?") + "&background=1A73E8&color=ffffff&size=200"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <select
                    value={formPhotoId}
                    onChange={(e) => setFormPhotoId(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-950/40 border border-white/10 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none font-bold [&>option]:bg-[#0a1122]"
                  >
                    <option value="">No Photo (Default Avatar)</option>
                    {mediaFiles.map((img: any) => (
                      <option key={img.id} value={img.id}>
                        {img.file_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={formLinkedinUrl}
                  onChange={(e) => setFormLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="member-active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border border-white/10 text-blue-500 focus:ring-0"
                />
                <label htmlFor="member-active" className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                  Display profile on live site
                </label>
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
                onClick={handleSaveMember}
                disabled={saving}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
