/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useAuth, PermissionSection } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  section?: PermissionSection;
  action?: "read" | "write";
}

export default function AdminRouteGuard({
  children,
  section,
  action = "read",
}: AdminRouteGuardProps) {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#070D19] flex flex-col items-center justify-center z-50 text-white font-space">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-sm tracking-widest text-slate-400 uppercase font-bold animate-pulse">
          Securing session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Check section-based permission if specified
  if (section && !hasPermission(section, action)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 font-space">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
          Access Restricted
        </h1>
        <p className="text-slate-500 max-w-md mb-6 text-sm">
          Your account role (<span className="font-bold text-red-500">{user.role}</span>) does not have permission to view or manage the <span className="font-bold">{section.replace("_", " ")}</span> section.
        </p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 transition-all duration-300"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
