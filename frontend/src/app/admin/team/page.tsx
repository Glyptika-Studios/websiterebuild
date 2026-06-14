/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  linkedin_url?: string;
  display_order: number;
  active: boolean;
}

interface TeamLayout {
  columns_mobile: number;
  columns_tablet: number;
  columns_desktop: number;
  columns_xl: number;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Aarav Sharma",
    role: "Co-Founder & Chief Architect",
    bio: "Systems architect specializing in low-level hypervisor kernels and clustered networks. Ex-principal at Telemetry Labs.",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    linkedin_url: "https://linkedin.com/in/aarav-sharma",
    display_order: 1,
    active: true
  },
  {
    id: "member-2",
    name: "Meera Patel",
    role: "Lead Interface Designer",
    bio: "Pioneering glassmorphism design layouts and complex CSS typography. Obsessed with premium user experiences.",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    linkedin_url: "https://linkedin.com/in/meera-patel",
    display_order: 2,
    active: true
  }
];

const DEFAULT_LAYOUT: TeamLayout = {
  columns_mobile: 2,
  columns_tablet: 3,
  columns_desktop: 4,
  columns_xl: 5
};

export default function TeamManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("team", "write");

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [layout, setLayout] = useState<TeamLayout>(DEFAULT_LAYOUT);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [formLinkedinUrl, setFormLinkedinUrl] = useState("");
  const [formActive, setFormActive] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Load members
    const savedMembers = localStorage.getItem("glyptika_admin_team_members");
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {
        setMembers(DEFAULT_MEMBERS);
      }
    } else {
      setMembers(DEFAULT_MEMBERS);
      localStorage.setItem("glyptika_admin_team_members", JSON.stringify(DEFAULT_MEMBERS));
    }

    // Load layout
    const savedLayout = localStorage.getItem("glyptika_admin_team_layout");
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (e) {
        setLayout(DEFAULT_LAYOUT);
      }
    }
  }, []);

  const saveMembers = (newMembers: TeamMember[]) => {
    // Re-order by display_order
    const sorted = [...newMembers].sort((a, b) => a.display_order - b.display_order);
    setMembers(sorted);
    localStorage.setItem("glyptika_admin_team_members", JSON.stringify(sorted));
  };

  const saveLayout = (newLayout: TeamLayout) => {
    setLayout(newLayout);
    localStorage.setItem("glyptika_admin_team_layout", JSON.stringify(newLayout));
  };

  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingMember(null);
    setFormName("");
    setFormRole("");
    setFormBio("");
    setFormPhotoUrl("");
    setFormLinkedinUrl("");
    setFormActive(true);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    if (!canWrite) return;
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormBio(member.bio);
    setFormPhotoUrl(member.photo_url);
    setFormLinkedinUrl(member.linkedin_url || "");
    setFormActive(member.active);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to remove this team member?")) {
      const updated = members.filter((m) => m.id !== id);
      saveMembers(updated);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (!canWrite) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= members.length) return;

    const updated = [...members];
    // Swap display_order property values
    const tempOrder = updated[index].display_order;
    updated[index].display_order = updated[targetIdx].display_order;
    updated[targetIdx].display_order = tempOrder;

    saveMembers(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!formRole.trim()) {
      setFormError("Role Title is required.");
      return;
    }

    const memberData: TeamMember = {
      id: editingMember?.id || `member-${Date.now()}`,
      name: formName,
      role: formRole,
      bio: formBio,
      photo_url: formPhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&q=80",
      linkedin_url: formLinkedinUrl || undefined,
      display_order: editingMember?.display_order || members.length + 1,
      active: formActive,
    };

    let updatedMembers: TeamMember[];
    if (editingMember) {
      updatedMembers = members.map((m) => (m.id === editingMember.id ? memberData : m));
    } else {
      updatedMembers = [...members, memberData];
    }

    saveMembers(updatedMembers);
    setIsFormOpen(false);
    setEditingMember(null);
  };

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
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Users className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-black text-white tracking-wide">
            Grid Columns Configurator
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
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
                onChange={(e) => saveLayout({ ...layout, columns_mobile: Number(e.target.value) })}
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
                onChange={(e) => saveLayout({ ...layout, columns_tablet: Number(e.target.value) })}
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
                onChange={(e) => saveLayout({ ...layout, columns_desktop: Number(e.target.value) })}
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
                onChange={(e) => saveLayout({ ...layout, columns_xl: Number(e.target.value) })}
                className="w-16 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/30 rounded-xl text-xs text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">Columns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Sorting and CRUD List */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
          Team Roster & Display Priority
        </span>

        <div className="space-y-4">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-slate-800 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Photo thumbnail */}
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-slate-950 shrink-0">
                    <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-black text-white leading-none">{member.name}</h4>
                      {!member.active && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-950 border border-white/10 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-blue-400 font-bold leading-none mb-1">{member.role}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-md">{member.bio}</p>
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
            ))
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
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Core Engineer"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
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
                  Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
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
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
