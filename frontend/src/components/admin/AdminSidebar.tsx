/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, PermissionSection } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  UserPlus,
  Users,
  Settings,
  Image as ImageIcon,
  Music,
  Shield,
  History,
  LogOut,
  User,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: PermissionSection;
  superadminOnly?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Blog & Social", href: "/admin/posts", icon: FileText, permission: "blog_posts" },
  { name: "Projects", href: "/admin/projects", icon: Briefcase, permission: "products" },
  { name: "Careers", href: "/admin/careers", icon: UserPlus, permission: "careers" },
  { name: "Team Profiles", href: "/admin/team", icon: Users, permission: "team" },
  { name: "CMS Editors", href: "/admin/cms", icon: Settings, permission: "home" },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon, permission: "media" },
  { name: "Background Music", href: "/admin/music", icon: Music, permission: "media" },
  { name: "Permissions", href: "/admin/users", icon: Shield, superadminOnly: true },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History, superadminOnly: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const filteredItems = SIDEBAR_ITEMS.filter((item) => {
    if (!user) return false;
    if (item.superadminOnly && user.role !== "superadmin") return false;
    if (item.permission && !hasPermission(item.permission, "read")) return false;
    return true;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30";
      case "editor":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
    }
  };

  return (
    <aside className="w-64 bg-[#0a1122]/90 border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-md z-30 font-space shrink-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Logo and Title */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-white/10 shadow-lg">
            <Image src="/logo.jpg" alt="Glyptika Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-wide leading-tight">
              Glyptika Admin
            </span>
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest leading-none mt-0.5">
              Control Panel
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-white/5 bg-[#080d19]/40 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-white truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 truncate mb-1">{user.email}</p>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white bg-red-500/5 hover:bg-red-600/20 border border-red-500/10 hover:border-red-500/30 transition-all duration-300"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
