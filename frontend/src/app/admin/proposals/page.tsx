/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Mail,
  Search,
  Filter,
  Trash2,
  Eye,
  X,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  DollarSign,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Proposal {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  budget_type?: "fixed" | "range" | "flexible";
  budget_min?: number;
  budget_max?: number;
  budget_label?: string;
  priority: "low" | "normal" | "high";
  source_channel?: string;
  status: "new" | "in_review" | "accepted" | "rejected" | "archived";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  services?: { id: string; title: string }[];
  products?: { id: string; title: string }[];
  projects?: { id: string; title: string }[];
}

export default function ProposalsManager() {
  const { user, hasPermission } = useAuth();
  const canWrite = hasPermission("home", "write");

  // List States
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail Modal States
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Triage Inputs
  const [statusInput, setStatusInput] = useState<any>("new");
  const [priorityInput, setPriorityInput] = useState<any>("normal");
  const [notesInput, setNotesInput] = useState("");

  const fetchProposals = async () => {
    setLoading(true);
    try {
      let queryUrl = `/api/v1/admin/proposals?page=${page}&limit=10`;
      if (statusFilter !== "all") queryUrl += `&status=${statusFilter}`;
      if (priorityFilter !== "all") queryUrl += `&priority=${priorityFilter}`;
      if (searchQuery.trim() !== "") queryUrl += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await api.get<any>(queryUrl);
      if (response.success && response.data) {
        setProposals(response.data.proposals || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotal(response.data.pagination.total || 0);
        }
      }
    } catch (err: any) {
      console.error("Failed to load proposals list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [page, statusFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProposals();
  };

  const handleViewDetails = async (id: string) => {
    setDetailLoading(true);
    setSelectedProposal(null);
    try {
      const response = await api.get<any>(`/api/v1/admin/proposals/${id}`);
      if (response.success && response.data) {
        const data = response.data;
        setSelectedProposal(data);
        setStatusInput(data.status);
        setPriorityInput(data.priority);
        setNotesInput(data.admin_notes || "");
      }
    } catch (err: any) {
      alert("Failed to retrieve proposal details: " + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !canWrite) return;
    setSaving(true);
    try {
      const response = await api.patch<any>(`/api/v1/admin/proposals/${selectedProposal.id}`, {
        status: statusInput,
        priority: priorityInput,
        admin_notes: notesInput,
      });

      if (response.success) {
        setSelectedProposal(prev =>
          prev
            ? {
                ...prev,
                status: statusInput,
                priority: priorityInput,
                admin_notes: notesInput,
              }
            : null
        );
        fetchProposals();
      }
    } catch (err: any) {
      alert("Failed to update proposal details: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProposal = async (id: string) => {
    if (!canWrite) return;
    if (!confirm("Are you sure you want to permanently delete this proposal request?")) return;
    try {
      const response = await api.delete<any>(`/api/v1/admin/proposals/${id}`);
      if (response.success) {
        if (selectedProposal?.id === id) {
          setSelectedProposal(null);
        }
        fetchProposals();
      }
    } catch (err: any) {
      alert("Failed to delete proposal: " + err.message);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "low":
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "rejected":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "in_review":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "archived":
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    }
  };

  const renderBudgetInfo = (prop: Proposal) => {
    if (prop.budget_label) return prop.budget_label;
    if (prop.budget_type === "flexible") return "Flexible";
    if (prop.budget_type === "fixed") return `$${Number(prop.budget_min).toLocaleString()}`;
    if (prop.budget_type === "range") {
      return `$${Number(prop.budget_min).toLocaleString()} - $${Number(prop.budget_max).toLocaleString()}`;
    }
    return "Not Specified";
  };

  return (
    <div className="space-y-8 font-space text-white relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            Proposals Manager
          </h1>
          <p className="text-sm text-slate-400">
            Triage, review, and organize client request submissions from your website.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-900/60 border border-white/5 rounded-2xl text-xs font-bold text-slate-300 backdrop-blur-md">
          Total Requests: <span className="text-blue-400 font-black">{total}</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by client or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <button type="submit" className="hidden" />
        </form>

        {/* Option Selects */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="bg-slate-950/60 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 font-bold focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="in_review">In Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPage(1);
              setPriorityFilter(e.target.value);
            }}
            className="bg-slate-950/60 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 font-bold focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Table List Column */}
        <div className="xl:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-xs uppercase tracking-widest font-black">Loading Proposals...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Mail className="w-12 h-12 mb-3 text-slate-600" />
                <p className="text-sm font-semibold">No proposals found</p>
                <p className="text-xs text-slate-600 mt-1">Try relaxing filters or search terms.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                    <th className="py-4 px-2">Client Details</th>
                    <th className="py-4 px-2">Budget</th>
                    <th className="py-4 px-2">Priority</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {proposals.map((prop) => (
                    <tr
                      key={prop.id}
                      className={`hover:bg-white/5 transition-colors cursor-pointer group ${
                        selectedProposal?.id === prop.id ? "bg-blue-600/10" : ""
                      }`}
                      onClick={() => handleViewDetails(prop.id)}
                    >
                      <td className="py-4 px-2">
                        <div className="font-bold text-white leading-normal">{prop.name}</div>
                        <div className="text-xs text-slate-500 font-medium truncate max-w-xs">
                          {prop.company ? `${prop.company} • ` : ""}{prop.email}
                        </div>
                      </td>
                      <td className="py-4 px-2 font-mono text-xs text-slate-300">
                        {renderBudgetInfo(prop)}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shrink-0 ${getPriorityStyle(prop.priority)}`}>
                          {prop.priority}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shrink-0 ${getStatusStyle(prop.status)}`}>
                          {prop.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(prop.id)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                            title="Inspect details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canWrite && (
                            <button
                              onClick={() => handleDeleteProposal(prop.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                              title="Delete request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
              <span className="text-xs text-slate-500 font-medium">
                Page <span className="text-white font-bold">{page}</span> of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-white/5 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-white/5 text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Inspector Column */}
        <div className="xl:col-span-1">
          {detailLoading ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col items-center justify-center py-20 text-slate-400 text-center h-full min-h-[400px]">
              <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-xs uppercase tracking-widest font-black">Retrieving database joins...</p>
            </div>
          ) : selectedProposal ? (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between h-full space-y-6">
              
              {/* Header Details */}
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{selectedProposal.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{selectedProposal.company || "Independent Client"}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-white/5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                    <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Email</p>
                    <a href={`mailto:${selectedProposal.email}`} className="text-blue-400 font-bold break-all hover:underline flex items-center gap-1">
                      {selectedProposal.email}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                    <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Phone</p>
                    <p className="text-slate-300 font-bold">{selectedProposal.phone || "None"}</p>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                    <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Submitted On</p>
                    <div className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(selectedProposal.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                    <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Budget Type</p>
                    <div className="text-slate-300 font-bold flex items-center gap-1.5 capitalize">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      {selectedProposal.budget_type || "flexible"}
                    </div>
                  </div>
                </div>

                {/* Submissions Detail (Relations) */}
                {(selectedProposal.services?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Interested Services</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProposal.services?.map((svc) => (
                        <span key={svc.id} className="text-xs px-2.5 py-1 bg-blue-500/10 border border-blue-500/15 rounded-lg text-blue-400 font-bold">
                          {svc.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedProposal.products?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Interested Products</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProposal.products?.map((prod) => (
                        <span key={prod.id} className="text-xs px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/15 rounded-lg text-indigo-400 font-bold">
                          {prod.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Project Scope & Details</label>
                  <div className="p-3.5 bg-slate-950/60 border border-white/5 rounded-xl text-slate-300 text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                    {selectedProposal.message || "No description provided."}
                  </div>
                </div>
              </div>

              {/* Triage Settings Form */}
              <form onSubmit={handleUpdateProposal} className="border-t border-white/5 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Triage Status</label>
                    <select
                      disabled={!canWrite}
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-2 px-3 text-slate-300 font-bold focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="new">New</option>
                      <option value="in_review">In Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Priority</label>
                    <select
                      disabled={!canWrite}
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-2 px-3 text-slate-300 font-bold focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Admin Review Notes</label>
                  <textarea
                    disabled={!canWrite}
                    rows={3}
                    placeholder="Add internal notes about this client..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 leading-normal focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>

                {canWrite && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 border border-blue-500/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] disabled:opacity-50"
                  >
                    {saving ? "Saving Changes..." : "Save Triage State"}
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col items-center justify-center py-20 text-slate-500 text-center h-full min-h-[400px]">
              <Eye className="w-12 h-12 mb-3 text-slate-600" />
              <p className="text-sm font-semibold">Inspect Proposal</p>
              <p className="text-xs text-slate-600 mt-1 max-w-[200px] mx-auto">
                Click on any client row in the table to display full request parameters.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
