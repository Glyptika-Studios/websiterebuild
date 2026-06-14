/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth, AdminUser, AdminRole, PermissionSection } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield,
  Plus,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  User,
  Check,
} from "lucide-react";

const SECTIONS: { key: PermissionSection; label: string }[] = [
  { key: "home", label: "Homepage Editor" },
  { key: "services", label: "Services Page Editor" },
  { key: "xplor", label: "XPLOR CMS" },
  { key: "ims", label: "IMS CMS" },
  { key: "blog_posts", label: "Blog & LinkedIn" },
  { key: "products", label: "Products" },
  { key: "projects", label: "Projects" },
  { key: "careers", label: "Job Positions" },
  { key: "team", label: "Team roster" },
  { key: "media", label: "Media Library" },
];

export default function UsersPermissionsManager() {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Guard view: only superadmin can see this page
  useEffect(() => {
    if (currentUser && currentUser.role !== "superadmin") {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, router]);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRollNo, setFormRollNo] = useState("");
  const [formRole, setFormRole] = useState<AdminRole>("editor");
  const [formType, setFormType] = useState("Full-time");
  
  // Custom permissions map
  const [formPermissions, setFormPermissions] = useState<
    { [key in PermissionSection]?: { read: boolean; write: boolean } }
  >({});

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_users_roster");
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        setUsers(getDefaultRoster());
      }
    } else {
      const defaultRoster = getDefaultRoster();
      setUsers(defaultRoster);
      localStorage.setItem("glyptika_admin_users_roster", JSON.stringify(defaultRoster));
    }
  }, []);

  const getDefaultRoster = (): AdminUser[] => [
    {
      id: "admin-uuid-1",
      name: "Glyptika Superadmin",
      email: "admin@glyptika.com",
      roll_no: "GS001",
      role: "superadmin",
      employment_type: "Full-time",
      permissions: {}, // full bypass
    },
    {
      id: "admin-uuid-2",
      name: "Content Editor",
      email: "editor@glyptika.com",
      roll_no: "GS002",
      role: "editor",
      employment_type: "Full-time",
      permissions: {
        careers: { read: true, write: true },
        blog_posts: { read: true, write: true },
        products: { read: true, write: true },
        media: { read: true, write: true },
        team: { read: true, write: true },
        home: { read: true, write: true },
        xplor: { read: true, write: true },
        ims: { read: true, write: true },
      },
    },
    {
      id: "admin-uuid-3",
      name: "Guest Viewer",
      email: "viewer@glyptika.com",
      roll_no: "GS003",
      role: "viewer",
      employment_type: "Internship",
      permissions: {
        careers: { read: true, write: false },
        blog_posts: { read: true, write: false },
        products: { read: true, write: false },
        media: { read: true, write: false },
        team: { read: true, write: false },
      },
    },
  ];

  const saveRoster = (newUsers: AdminUser[]) => {
    setUsers(newUsers);
    localStorage.setItem("glyptika_admin_users_roster", JSON.stringify(newUsers));
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRollNo("");
    setFormRole("editor");
    setFormType("Full-time");
    
    // Initialize permissions with default read/write unchecked
    const initialPerms: typeof formPermissions = {};
    SECTIONS.forEach((s) => {
      initialPerms[s.key] = { read: true, write: false };
    });
    setFormPermissions(initialPerms);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRollNo(user.roll_no);
    setFormRole(user.role);
    setFormType(user.employment_type);
    
    const perms = { ...user.permissions };
    SECTIONS.forEach((s) => {
      if (!perms[s.key]) {
        perms[s.key] = { read: false, write: false };
      }
    });
    setFormPermissions(perms);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own administrative account.");
      return;
    }
    if (confirm("Are you sure you want to delete this administrative profile?")) {
      const updated = users.filter((u) => u.id !== id);
      saveRoster(updated);
    }
  };

  const togglePermission = (section: PermissionSection, type: "read" | "write") => {
    const current = formPermissions[section] || { read: false, write: false };
    const updated = { ...formPermissions };

    if (type === "read") {
      const newRead = !current.read;
      // If we revoke read, we must also revoke write
      updated[section] = {
        read: newRead,
        write: newRead ? current.write : false,
      };
    } else {
      const newWrite = !current.write;
      // If we grant write, we must also grant read
      updated[section] = {
        read: newWrite ? true : current.read,
        write: newWrite,
      };
    }
    setFormPermissions(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formEmail.trim() || !formRollNo.trim()) {
      setFormError("All fields are required.");
      return;
    }

    const userData: AdminUser = {
      id: editingUser?.id || `admin-${Date.now()}`,
      name: formName,
      email: formEmail,
      roll_no: formRollNo,
      role: formRole,
      employment_type: formType,
      // Superadmins don't need section keys as they bypass
      permissions: formRole === "superadmin" ? {} : formPermissions,
    };

    // Check duplicate roll number or email
    const exists = users.find(
      (u) =>
        u.id !== userData.id &&
        (u.email.toLowerCase() === formEmail.toLowerCase() ||
          u.roll_no.toLowerCase() === formRollNo.toLowerCase())
    );
    if (exists) {
      setFormError("Another admin user with this Email or Roll Number already exists.");
      return;
    }

    let updatedUsers: AdminUser[];
    if (editingUser) {
      updatedUsers = users.map((u) => (u.id === editingUser.id ? userData : u));
    } else {
      updatedUsers = [...users, userData];
    }

    saveRoster(updatedUsers);
    setIsFormOpen(false);
    setEditingUser(null);
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
            Provision console access and section security keys (Superadmin Only)
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

      {/* Roster list */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
          Admin staff roster
        </span>

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
                    Email: <span className="text-slate-400">{item.email}</span> &bull; Roll: <span className="text-slate-400">{item.roll_no}</span> &bull; Type: <span className="text-slate-400">{item.employment_type}</span>
                  </p>
                </div>
              </div>

              {/* Edit actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl border border-transparent hover:border-blue-500/30 transition-all"
                  title="Modify Permissions"
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
      </div>

      {/* Roster Editor Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-space">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl h-full bg-[#0a1122] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingUser ? "Edit User Access" : "Provision Staff Access"}
                </h3>
                <p className="text-xs text-slate-500">Configure profile fields and strict route keys</p>
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
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="GS000"
                    value={formRollNo}
                    onChange={(e) => setFormRollNo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Role Category
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as AdminRole)}
                    className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Job Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-blue-500/45 rounded-2xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              {/* Custom Permission Matrix (Only for Editor/Viewer roles) */}
              {formRole !== "superadmin" && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-450 block">
                    Access Permission Matrix
                  </span>
                  
                  <div className="border border-white/5 rounded-3xl bg-slate-950/40 divide-y divide-white/5 overflow-hidden">
                    {SECTIONS.map((section) => {
                      const perms = formPermissions[section.key] || { read: false, write: false };
                      return (
                        <div
                          key={section.key}
                          className="flex items-center justify-between p-4 text-xs font-bold text-slate-300 hover:bg-white/[0.01] transition-all"
                        >
                          <span className="text-slate-200">{section.label}</span>
                          <div className="flex items-center gap-4">
                            {/* Read switch */}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={perms.read}
                                onChange={() => togglePermission(section.key, "read")}
                                className="w-3.5 h-3.5 rounded bg-slate-900 border border-white/10 text-blue-500 focus:ring-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 uppercase font-black">Read</span>
                            </label>
                            {/* Write switch (only if editor role) */}
                            <label className={`flex items-center gap-2 select-none ${
                              formRole === "editor" ? "cursor-pointer" : "opacity-30 cursor-not-allowed"
                            }`}>
                              <input
                                type="checkbox"
                                disabled={formRole !== "editor"}
                                checked={perms.write}
                                onChange={() => togglePermission(section.key, "write")}
                                className="w-3.5 h-3.5 rounded bg-slate-900 border border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-500 uppercase font-black">Write</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>

            {/* Footer actions */}
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
                <span>Save Permissions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
