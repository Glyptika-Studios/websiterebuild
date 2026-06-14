"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050B14] text-white flex items-center justify-center font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <AdminRouteGuard>
      <div className="flex h-screen bg-[#070D19] text-slate-100 font-sans antialiased overflow-hidden">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Scrollable Admin Workspace */}
        <main className="flex-1 overflow-y-auto flex flex-col h-full bg-gradient-to-br from-[#070D19] via-[#081021] to-[#040810]">
          <div className="p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto flex-1">
            {children}
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
