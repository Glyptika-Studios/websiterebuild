/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type AdminRole = "superadmin" | "editor" | "viewer";

export type PermissionSection =
  | "careers"
  | "blog_posts"
  | "products"
  | "projects"
  | "linkedin_posts"
  | "media"
  | "team"
  | "home"
  | "services"
  | "xplor"
  | "ims";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roll_no: string;
  role: AdminRole;
  employment_type: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (section: PermissionSection, action: "read" | "write") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    document.cookie = "glyptika_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    if (token) {
      fetch("/api/v1/admin/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).catch(() => {});
    }

    setToken(null);
    setUser(null);
    router.push("/admin/login");
  };

  useEffect(() => {
    const savedToken = getCookie("glyptika_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetch("/api/v1/admin/auth/me", {
        headers: {
          "Authorization": `Bearer ${savedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid session");
          return res.json();
        })
        .then((body: any) => {
          if (body.success && body.data?.user) {
            setUser(body.data.user);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();

      if (body.success && body.data) {
        const { user: loggedInUser, session } = body.data;

        // Set session token cookie
        document.cookie = `glyptika_admin_token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;

        setToken(session.access_token);
        setUser(loggedInUser);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: body.message || "Invalid email or password" };
      }
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Connection error" };
    }
  };

  /**
   * Role-based permission checks:
   * - Everyone can read.
   * - Editors and Superadmins can write.
   */
  const hasPermission = (section: PermissionSection, action: "read" | "write"): boolean => {
    if (!user) return false;
    if (user.role === "superadmin") return true;

    if (action === "read") {
      return true;
    }
    if (action === "write") {
      return user.role === "editor";
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
