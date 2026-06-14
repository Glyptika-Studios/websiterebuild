"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  AlertCircle,
} from "lucide-react";

interface AuditLog {
  id: string;
  user_email: string;
  user_name: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  entity: string;
  entity_id: string;
  timestamp: string;
  details: string;
}

const DEFAULT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    user_email: "admin@glyptika.com",
    user_name: "Glyptika Superadmin",
    action: "LOGIN",
    entity: "admin_auth",
    entity_id: "admin-uuid-1",
    timestamp: "2026-06-12 15:10:04",
    details: "Superadmin logged in successfully from local node"
  },
  {
    id: "log-2",
    user_email: "admin@glyptika.com",
    user_name: "Glyptika Superadmin",
    action: "UPDATE",
    entity: "page_content",
    entity_id: "ims",
    timestamp: "2026-06-12 14:45:12",
    details: "Modified pricing module specifications (Premium Tier cost adjustment)"
  },
  {
    id: "log-3",
    user_email: "editor@glyptika.com",
    user_name: "Content Editor",
    action: "CREATE",
    entity: "posts",
    entity_id: "post-1",
    timestamp: "2026-06-11 11:22:45",
    details: "Created new blog post article: 'Unlocking Peak Performance in Next-Gen Cloud Compute'"
  },
  {
    id: "log-4",
    user_email: "admin@glyptika.com",
    user_name: "Glyptika Superadmin",
    action: "UPDATE",
    entity: "admin_permissions",
    entity_id: "admin-uuid-3",
    timestamp: "2026-06-10 09:12:00",
    details: "Revoked write permissions for Guest Viewer on products section"
  }
];

export default function AuditLogsManager() {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Guard view: only superadmin can see this page
  useEffect(() => {
    if (currentUser && currentUser.role !== "superadmin") {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, router]);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_audit_logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        setLogs(DEFAULT_LOGS);
      }
    } else {
      setLogs(DEFAULT_LOGS);
      localStorage.setItem("glyptika_admin_audit_logs", JSON.stringify(DEFAULT_LOGS));
    }
  }, []);

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = ["ID", "Timestamp", "User Name", "User Email", "Action", "Target Section", "Target ID", "Details"];
    const rows = logs.map((log) => [
      log.id,
      log.timestamp,
      log.user_name,
      log.user_email,
      log.action,
      log.entity,
      log.entity_id,
      log.details.replace(/"/g, '""'), // escape quotes
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((x) => `"${x}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `glyptika_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === "ALL" ? true : log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  if (currentUser?.role !== "superadmin") return null;

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            System Audit Logs
          </h1>
          <p className="text-sm text-slate-400">
            Chronological log of administrative dashboard mutations (Superadmin Only)
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/10 transition-all flex items-center gap-1.5 self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by staff name, target section, or detail string..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 bg-slate-950 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-slate-350 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 divide-y divide-white/5">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wider text-slate-500 pb-3">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Section Target</th>
                <th className="py-3 px-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{log.timestamp}</span>
                    </td>
                    <td className="py-4 px-4 min-w-[150px]">
                      <div className="flex flex-col">
                        <span className="text-white leading-tight">{log.user_name}</span>
                        <span className="text-[10px] text-slate-550 leading-none mt-1 font-mono font-medium">{log.user_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        log.action === "CREATE"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : log.action === "UPDATE"
                          ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                          : log.action === "DELETE"
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{log.entity}</td>
                    <td className="py-4 px-4 text-slate-300 font-medium leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
