/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth, AdminUser, AdminRole } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Shield,
  Plus,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Edit,
  User,
  Loader2,
  Mail,
  KeyRound,
} from "lucide-react";

interface DbUser {
  id: string;
  name: string;
  email: string;
  roll_no: string;
  role: AdminRole;
  employment_type: string;
  created_at: string;
}

export default function UsersPermissionsManager() {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Guard: only superadmin can see this page
  useEffect(() => {
    if (currentUser && currentUser.role !== "superadmin") {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, router]);

  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUser | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [drawerSuccess, setDrawerSuccess] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRollNo, setFormRollNo] = useState("");
  const [formRole, setFormRole] = useState<AdminRole>("editor");
  const [formType, setFormType] = useState("Full-time");

  // Password reset state
  const [resetTarget, setResetTarget] = useState<DbUser | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [actionLink, setActionLink] = useState<string | null>(null);

  // Load users from DB
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/api/v1/admin/users?limit=100");
      if (res.success && res.data) {
        setUsers(res.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open create drawer
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRollNo("");
    setFormRole("editor");
    setFormType("Full-time");
    setDrawerError(null);
    setDrawerSuccess(null);
    setActionLink(null);
    setIsFormOpen(true);
  };

  // Open edit drawer
  const handleOpenEdit = (dbUser: DbUser) => {
    setEditingUser(dbUser);
    setFormName(dbUser.name);
    setFormEmail(dbUser.email);
    setFormRollNo(dbUser.roll_no);
    setFormRole(dbUser.role);
    setFormType(dbUser.employment_type);
    setDrawerError(null);
    setDrawerSuccess(null);
    setActionLink(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own administrative account.");
      return;
    }
    if (!confirm("Permanently revoke this user's admin access? This cannot be undone.")) return;
    try {
      await api.delete(`/api/v1/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  // Handle invite (create) or update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerError(null);
    setDrawerSuccess(null);
    setActionLink(null);

    if (!formName.trim() || !formEmail.trim() || !formRollNo.trim()) {
      setDrawerError("All fields are required.");
      return;
    }

    setDrawerLoading(true);

    try {
      if (editingUser) {
        // UPDATE existing user's profile
        await api.put(`/api/v1/admin/users/${editingUser.id}`, {
          name: formName,
          role: formRole,
          employment_type: formType,
        });

        setDrawerSuccess("User profile updated successfully.");
        await fetchUsers();
      } else {
        // INVITE new user (Logic maps role cleanly)
        const res = await api.post<any>("/api/v1/admin/users/invite", {
          email: formEmail,
          name: formName,
          roll_no: formRollNo,
          role: formRole,
          employment_type: formType,
        });

        if (res.success && res.data?.action_link) {
          setActionLink(res.data.action_link);
          setDrawerSuccess("User invited successfully. Copy the link below to set their password.");
        } else {
          setDrawerSuccess("User invited successfully.");
        }
        await fetchUsers();
      }
    } catch (err: any) {
      setDrawerError(err.message || "Failed to save user.");
    } finally {
      setDrawerLoading(false);
    }
  };

  // Trigger password reset email via Supabase
  const handleResetPassword = async (target: DbUser) => {
    setResetTarget(target);
    setResetting(true);
    setResetMsg(null);
    setActionLink(null);
    try {
      const res = await api.post<any>(`/api/v1/admin/users/${target.id}/reset-password`, null);
      if (res.success && res.data?.action_link) {
        setActionLink(res.data.action_link);
        setResetMsg(`Password reset link generated for ${target.email}.`);
      } else {
        setResetMsg(res.message || `Password reset email sent to ${target.email}.`);
      }
    } catch (err: any) {
      setResetMsg("Error: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  if (currentUser?.role !== "superadmin") return null;

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Access Permissions
          </h1>
          <p className="text-sm text-slate-400">
            Provision console access and manage staff roles (Superadmin Only)
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Provision User</span>
        </button>
      </div>

      {/* Copyable Action Link Widget */}
      {actionLink && (
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-400">
              Generated Access / Recovery Link
            </span>
            <button
              onClick={() => setActionLink(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Use this link directly to set/update the user&apos;s password. This bypasses email link expirations.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={actionLink}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-2xl text-xs font-mono text-slate-300 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(actionLink);
                alert("Link copied to clipboard!");
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-bold transition-colors"
            >
              Copy Link
            </button>
            <a
              href={actionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl text-xs font-bold transition-colors flex items-center"
            >
              Open Link
            </a>
          </div>
        </div>
      )}

      {/* Password reset toast */}
      {resetMsg && !actionLink && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold flex gap-3 items-center">
          <Mail className="w-4 h-4 shrink-0" />
          <span>{resetMsg}</span>
          <button onClick={() => { setResetMsg(null); setResetTarget(null); }} className="ml-auto text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Roster list */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
          Admin Staff Roster
        </span>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading roster...</span>
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-8 text-center">No admin users provisioned yet.</p>
        ) : (
          <div className="space-y-4">
            {users.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-slate-800 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-850 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h4 className="text-sm font-black text-white leading-none">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                        item.role === "superadmin"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                          : item.role === "editor"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                      }`}>
                        {item.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-none">
                      {item.email} &bull; Roll: <span className="text-slate-400">{item.roll_no}</span> &bull; <span className="text-slate-400">{item.employment_type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  {/* Send password reset email */}
                  <button
                    onClick={() => handleResetPassword(item)}
                    disabled={resetting && resetTarget?.id === item.id}
                    title="Send password reset email"
                    className="p-2 text-yellow-400 hover:text-white hover:bg-yellow-500/20 rounded-xl border border-transparent hover:border-yellow-500/30 disabled:opacity-40 transition-all"
                  >
                    {resetting && resetTarget?.id === item.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <KeyRound className="w-4 h-4" />
                    }
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                    title="Edit User Role & Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={item.id === currentUser.id}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl border border-transparent hover:border-red-500/30 disabled:opacity-20 disabled:pointer-events-none transition-all"
                    title="Revoke User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roster Editor Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingUser ? "Edit User Access" : "Provision Staff Access"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingUser
                    ? "Update profile and role information"
                    : "Invite a new admin — they will receive an email to set their password"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alerts */}
            <div className="px-6 pt-4 space-y-2 shrink-0">
              {drawerError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex gap-2 items-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{drawerError}</span>
                </div>
              )}
              {drawerSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{drawerSuccess}</span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerLoading && !drawerSuccess ? (
                <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        placeholder="jane@glyptika.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        disabled={!!editingUser}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none disabled:opacity-50"
                      />
                      {editingUser && <p className="text-[10px] text-slate-600">Email cannot be changed after invite.</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Roll Number</label>
                      <input
                        type="text"
                        placeholder="GS000"
                        value={formRollNo}
                        onChange={(e) => setFormRollNo(e.target.value)}
                        disabled={!!editingUser}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Role</label>
                      <select
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value as AdminRole)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-slate-300 focus:outline-none [&>option]:bg-[#0a1122]"
                      >
                        <option value="superadmin">Superadmin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Job Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-slate-300 focus:outline-none [&>option]:bg-[#0a1122]"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex gap-2 items-center">
                      <Shield className="w-4 h-4 shrink-0" />
                      <span>
                        Role mappings:
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium text-slate-300">
                          <li><strong>Superadmin:</strong> Complete configuration & access management control.</li>
                          <li><strong>Editor:</strong> Complete write/modify rights for all site content sections.</li>
                          <li><strong>Viewer:</strong> Granular read-only visibility for validation across all sections.</li>
                        </ul>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#080d19]/60 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={drawerLoading}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 border border-blue-500/30 transition-all flex items-center gap-1.5"
              >
                {drawerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>{editingUser ? "Save Changes" : "Send Invite"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
