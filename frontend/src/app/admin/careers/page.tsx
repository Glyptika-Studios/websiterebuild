/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  UserPlus,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  Menu,
} from "lucide-react";

interface PositionItem {
  id: string;
  kind: "responsibility" | "requirement";
  body: string;
}

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  active: boolean;
  items: PositionItem[];
}

const DEFAULT_POSITIONS: Position[] = [
  {
    id: "pos-1",
    title: "Senior Infrastructure Engineer",
    department: "Engineering",
    location: "Tech City (Hybrid)",
    employment_type: "Full-time",
    description: "We are seeking a senior systems engineer to architect our next generation virtualization cluster. You will design telemetry hooks and container runtimes.",
    active: true,
    items: [
      { id: "1", kind: "responsibility", body: "Architect low-latency virtualization clusters and bare-metal nodes" },
      { id: "2", kind: "responsibility", body: "Implement custom kernel virtualization telemetry hooks" },
      { id: "3", kind: "requirement", body: "5+ years of systems programming in Go, Rust, or C++" },
      { id: "4", kind: "requirement", body: "Deep understanding of Linux network stack and hypervisors" }
    ]
  },
  {
    id: "pos-2",
    title: "Product Manager — SaaS Portal",
    department: "Product",
    location: "Remote",
    employment_type: "Contract",
    description: "Lead the feature definition and implementation roadmap for Glyptika's portal solutions. Coordinate with telemetry engineers and interface designers.",
    active: true,
    items: [
      { id: "5", kind: "responsibility", body: "Define and execute product feature backlogs based on clients requirements" },
      { id: "6", kind: "requirement", body: "3+ years leading engineering/SaaS products in a startup environment" }
    ]
  }
];

export default function CareersManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("careers", "write");

  const [positions, setPositions] = useState<Position[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState("Full-time");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);
  
  // Position items sub-form
  const [formItems, setFormItems] = useState<PositionItem[]>([]);
  const [newItemBody, setNewItemBody] = useState("");
  const [newItemKind, setNewItemKind] = useState<"responsibility" | "requirement">("responsibility");

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_positions");
    if (saved) {
      try {
        setPositions(JSON.parse(saved));
      } catch (e) {
        setPositions(DEFAULT_POSITIONS);
      }
    } else {
      setPositions(DEFAULT_POSITIONS);
      localStorage.setItem("glyptika_admin_positions", JSON.stringify(DEFAULT_POSITIONS));
    }
  }, []);

  const saveToStorage = (newPositions: Position[]) => {
    setPositions(newPositions);
    localStorage.setItem("glyptika_admin_positions", JSON.stringify(newPositions));
  };

  const handleOpenCreate = () => {
    if (!canWrite) return;
    setEditingPosition(null);
    setFormTitle("");
    setFormDepartment("Engineering");
    setFormLocation("");
    setFormType("Full-time");
    setFormDescription("");
    setFormActive(true);
    setFormItems([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (position: Position) => {
    if (!canWrite) return;
    setEditingPosition(position);
    setFormTitle(position.title);
    setFormDepartment(position.department);
    setFormLocation(position.location);
    setFormType(position.employment_type);
    setFormDescription(position.description);
    setFormActive(position.active);
    setFormItems(position.items || []);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to delete this position listing?")) {
      const updated = positions.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  const handleAddItem = () => {
    if (!newItemBody.trim()) return;
    const item: PositionItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      kind: newItemKind,
      body: newItemBody.trim(),
    };
    setFormItems([...formItems, item]);
    setNewItemBody("");
  };

  const handleRemoveItem = (id: string) => {
    setFormItems(formItems.filter((item) => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError("Job Title is required.");
      return;
    }
    if (!formLocation.trim()) {
      setFormError("Location is required.");
      return;
    }

    const positionData: Position = {
      id: editingPosition?.id || `pos-${Date.now()}`,
      title: formTitle,
      department: formDepartment,
      location: formLocation,
      employment_type: formType,
      description: formDescription,
      active: formActive,
      items: formItems,
    };

    let updatedPositions: Position[];
    if (editingPosition) {
      updatedPositions = positions.map((p) => (p.id === editingPosition.id ? positionData : p));
    } else {
      updatedPositions = [positionData, ...positions];
    }

    saveToStorage(updatedPositions);
    setIsFormOpen(false);
    setEditingPosition(null);
  };

  const filteredPositions = positions.filter((pos) => {
    return (
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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

      {/* Search Filter */}
      <div className="relative p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search listings by title, department, or office location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all"
        />
      </div>

      {/* Job Grid */}
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
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">
                  {pos.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-650" />
                    <span>{pos.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-650" />
                    <span>{pos.employment_type}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>{pos.items.length} details items (Requirements/Tasks)</span>
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
            No openings matching query.
          </div>
        )}
      </div>

      {/* Editor Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingPosition ? "Edit Job Listing" : "Create New Job Opening"}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-blue-400">Position specs & recruitment metrics</p>
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

            {/* Fields Grid */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Metadata */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Job Position Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Telemetry Architect..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Department
                    </label>
                    <select
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-slate-350 focus:outline-none"
                    >
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>HR / Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Employment Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Tech City (Hybrid)"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Intro Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="A descriptive intro summary of the position..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="careers-active"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border border-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="careers-active" className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                    Active (Accepting Applications)
                  </label>
                </div>
              </div>

              {/* Right Column: Dynamic Requirements & Responsibilities Builder */}
              <div className="space-y-5 flex flex-col h-full">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Responsibilities & Requirements
                </span>

                {/* Items List */}
                <div className="flex-1 min-h-[220px] max-h-[320px] overflow-y-auto p-4 rounded-3xl bg-slate-950/40 border border-white/5 space-y-2.5">
                  {formItems.length > 0 ? (
                    formItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-slate-900 border border-white/5 rounded-2xl text-xs leading-normal"
                      >
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider shrink-0 mt-0.5 border ${
                          item.kind === "responsibility"
                            ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                            : "text-teal-400 bg-teal-500/10 border-teal-500/20"
                        }`}>
                          {item.kind}
                        </span>
                        <p className="flex-1 text-slate-300 leading-normal">{item.body}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-650 text-xs italic">
                      No list items added. Add details below.
                    </div>
                  )}
                </div>

                {/* Sub-form to Add Item */}
                <div className="p-4 rounded-3xl bg-slate-950/20 border border-white/5 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                    Add Specification Detail
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={newItemKind}
                      onChange={(e) => setNewItemKind(e.target.value as any)}
                      className="px-3 py-2 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-xl text-xs text-slate-350 focus:outline-none shrink-0"
                    >
                      <option value="responsibility">Responsibility</option>
                      <option value="requirement">Requirement</option>
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. Master's in Computer Science or equivalent..."
                      value={newItemBody}
                      onChange={(e) => setNewItemBody(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 hover:border-white/10 transition-all uppercase tracking-wider"
                  >
                    Add to Specifications
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Action Buttons */}
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
                <span>Save Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
