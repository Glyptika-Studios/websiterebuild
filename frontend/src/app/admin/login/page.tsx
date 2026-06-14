/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, take them to the dashboard
    if (user) {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (role: "superadmin" | "editor" | "viewer") => {
    setError(null);
    if (role === "superadmin") {
      setEmail("admin@glyptika.com");
      setPassword("admin123");
    } else if (role === "editor") {
      setEmail("editor@glyptika.com");
      setPassword("editor123");
    } else if (role === "viewer") {
      setEmail("viewer@glyptika.com");
      setPassword("viewer123");
    }
  };

  return (
    <div className="w-full max-w-md p-2 font-space">
      {/* Background glowing decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[30%] w-72 h-72 bg-blue-600/10 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-teal-500/10 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative z-10 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-white/5 shadow-2xl p-8 md:p-10 flex flex-col items-center">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-xl mb-4 group hover:border-blue-500/40 transition-colors duration-300">
            <Image src="/logo.jpg" alt="Glyptika Studios Logo" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white leading-none mb-2">
            Glyptika Admin
          </h1>
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest text-blue-400">
            Secure Authentication
          </p>
        </div>

        {/* Form error */}
        {error && (
          <div className="w-full flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 hover:border-blue-400/40 shadow-[0_4px_15px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In to Console</span>
            )}
          </button>
        </form>

        {/* Demo Autofill Section */}
        <div className="w-full mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center mb-3">
            Local Browser Test Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAutofill("superadmin")}
              type="button"
              className="py-2 rounded-xl text-[10px] font-bold text-indigo-400 hover:text-white bg-indigo-500/5 hover:bg-indigo-500/15 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300"
            >
              Superadmin
            </button>
            <button
              onClick={() => handleAutofill("editor")}
              type="button"
              className="py-2 rounded-xl text-[10px] font-bold text-teal-400 hover:text-white bg-teal-500/5 hover:bg-teal-500/15 border border-teal-500/10 hover:border-teal-500/20 transition-all duration-300"
            >
              Editor
            </button>
            <button
              onClick={() => handleAutofill("viewer")}
              type="button"
              className="py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white bg-slate-500/5 hover:bg-slate-500/15 border border-slate-500/10 hover:border-slate-500/20 transition-all duration-300"
            >
              Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
