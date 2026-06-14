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
  permissions: { [key in PermissionSection]?: { read: boolean; write: boolean } };
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (section: PermissionSection, action: "read" | "write") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default preconfigured superadmin
const MOCK_SUPERADMIN: AdminUser = {
  id: "admin-uuid-1",
  name: "Glyptika Superadmin",
  email: "admin@glyptika.com",
  roll_no: "GS001",
  role: "superadmin",
  employment_type: "Full-time",
  permissions: {
    careers: { read: true, write: true },
    blog_posts: { read: true, write: true },
    products: { read: true, write: true },
    projects: { read: true, write: true },
    linkedin_posts: { read: true, write: true },
    media: { read: true, write: true },
    team: { read: true, write: true },
    home: { read: true, write: true },
    services: { read: true, write: true },
    xplor: { read: true, write: true },
    ims: { read: true, write: true },
  },
};

// Default preconfigured editor
const MOCK_EDITOR: AdminUser = {
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
    projects: { read: true, write: true },
    linkedin_posts: { read: true, write: true },
    media: { read: true, write: true },
    team: { read: true, write: true },
    home: { read: true, write: true },
    services: { read: true, write: true },
    xplor: { read: true, write: true },
    ims: { read: true, write: true },
  },
};

// Default preconfigured viewer
const MOCK_VIEWER: AdminUser = {
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
    projects: { read: true, write: false },
    linkedin_posts: { read: true, write: false },
    media: { read: true, write: false },
    team: { read: true, write: false },
    home: { read: true, write: false },
    services: { read: true, write: false },
    xplor: { read: true, write: false },
    ims: { read: true, write: false },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for active session
    const storedUser = localStorage.getItem("glyptika_admin_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("glyptika_admin_session");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mimic API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let matchedUser: AdminUser | null = null;

    if (email === "admin@glyptika.com" && password === "admin123") {
      matchedUser = MOCK_SUPERADMIN;
    } else if (email === "editor@glyptika.com" && password === "editor123") {
      matchedUser = MOCK_EDITOR;
    } else if (email === "viewer@glyptika.com" && password === "viewer123") {
      matchedUser = MOCK_VIEWER;
    }

    if (matchedUser) {
      localStorage.setItem("glyptika_admin_session", JSON.stringify(matchedUser));
      setUser(matchedUser);
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    localStorage.removeItem("glyptika_admin_session");
    setUser(null);
    router.push("/admin/login");
  };

  const hasPermission = (section: PermissionSection, action: "read" | "write"): boolean => {
    if (!user) return false;
    if (user.role === "superadmin") return true;

    const sectionPerms = user.permissions[section];
    if (!sectionPerms) return false;

    if (action === "read") {
      return !!sectionPerms.read;
    }
    if (action === "write") {
      return !!sectionPerms.write && user.role === "editor";
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
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
