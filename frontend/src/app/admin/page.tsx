"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="fixed inset-0 bg-[#070D19] flex flex-col items-center justify-center text-white font-space z-50">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p className="text-xs tracking-widest text-slate-400 uppercase font-bold animate-pulse">
        Initializing workspace...
      </p>
    </div>
  );
}
