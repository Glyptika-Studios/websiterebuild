/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Briefcase,
  UserPlus,
  Users,
  Database,
  Mail,
  Cloud,
  ArrowRight,
  TrendingUp,
  History,
  Activity,
  CheckCircle,
} from "lucide-react";

interface DashboardStat {
  name: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  href: string;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for dashboard metrics and logs
    const loadDashboardData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats([
        {
          name: "Total Posts",
          value: "32",
          change: "+4 this month",
          icon: FileText,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          href: "/admin/posts",
        },
        {
          name: "Portfolio Projects",
          value: "14",
          change: "+1 this month",
          icon: Briefcase,
          color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          href: "/admin/projects",
        },
        {
          name: "Open Careers",
          value: "5",
          change: "3 active listings",
          icon: UserPlus,
          color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
          href: "/admin/careers",
        },
        {
          name: "Team Members",
          value: "12",
          change: "Grid layout: 4 columns",
          icon: Users,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          href: "/admin/team",
        },
      ]);

      setRecentLogs([
        {
          id: "1",
          user_name: "Glyptika Superadmin",
          action: "UPDATE",
          entity: "page_content",
          entity_id: "ims",
          timestamp: "5 minutes ago",
          details: "Updated IMS pricing structure (Premium Tier)",
        },
        {
          id: "2",
          user_name: "Content Editor",
          action: "CREATE",
          entity: "posts",
          entity_id: "insights-blog-ai",
          timestamp: "2 hours ago",
          details: "Published new blog post: 'Future of Cloud Infrastructure'",
        },
        {
          id: "3",
          user_name: "Glyptika Superadmin",
          action: "CREATE",
          entity: "admin_users",
          entity_id: "viewer-guest",
          timestamp: "1 day ago",
          details: "Provisioned viewer access for Guest Account",
        },
        {
          id: "4",
          user_name: "System",
          action: "LOGIN",
          entity: "admin_auth",
          entity_id: "admin-id",
          timestamp: "Just now",
          details: "Superadmin logged in from local environment",
        },
      ]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-space text-slate-400">
        <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-black animate-pulse">
          Fetching console state...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-space text-white">
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Console Overview
          </h1>
          <p className="text-sm text-slate-400">
            Welcome back, <span className="text-blue-400 font-bold">{user?.name}</span>. Here is the active system status.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-white/5 rounded-2xl text-xs font-bold text-slate-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Local Development Node: Online</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group block p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-blue-500/20 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                {stat.name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>{stat.change}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity & Logs */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-wide">Recent Activity</h3>
                <p className="text-[10px] text-slate-500">Live feed of panel operations</p>
              </div>
            </div>
            {user?.role === "superadmin" && (
              <Link
                href="/admin/audit-logs"
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>View All Logs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="space-y-5 flex-1">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start text-sm">
                <div className={`p-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider shrink-0 mt-0.5 ${
                  log.action === "CREATE"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : log.action === "UPDATE"
                    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                }`}>
                  {log.action}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs font-bold leading-normal">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-bold">
                    <span className="text-slate-400">{log.user_name}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Statuses */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="p-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-wide">System Integration</h3>
                <p className="text-[10px] text-slate-500">Service API nodes status</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Database */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="text-xs font-black text-white">PostgreSQL Database</h4>
                    <p className="text-[9px] text-slate-500">Supabase Engine</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/15">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Linked</span>
                </div>
              </div>

              {/* Email Client */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="text-xs font-black text-white">Resend SMTP API</h4>
                    <p className="text-[9px] text-slate-500">Proposal submissions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/15">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              </div>

              {/* CDN Node */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cloud className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="text-xs font-black text-white">Vercel Serverless Edge</h4>
                    <p className="text-[9px] text-slate-500">Hosting and routing</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/15">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Healthy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-slate-500 font-bold flex items-center justify-between">
            <span>NextJS Framework v15.5.19</span>
            <span>Uptime: 99.99%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
