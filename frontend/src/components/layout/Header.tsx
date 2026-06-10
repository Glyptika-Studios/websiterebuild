"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    {
      name: "Services",
      href: "/services",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    {
      name: "Products",
      href: "/products",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 3h6v4"></path>
          <path d="m22 7-10-4-10 4"></path>
        </svg>
      )
    },
    {
      name: "XPLOR",
      href: "/xplor",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    {
      name: "IMS",
      href: "/ims",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="7" y="7" width="3" height="9"></rect>
          <rect x="14" y="7" width="3" height="5"></rect>
        </svg>
      )
    },
    {
      name: "Insights",
      href: "/insights",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    },
    {
      name: "Team",
      href: "/team",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      name: "Careers",
      href: "/careers",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Navbar Fixed Container */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-40px)] sm:w-[calc(100%-60px)] max-w-5xl xl:max-w-6xl transition-all duration-500 ${
          isScrolled ? "top-4" : "top-8"
        }`}
      >
        <div
          className="relative backdrop-blur-xl bg-white/5 border border-white/15 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 overflow-hidden group"
        >
          {/* Glossy sweep animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Logo Section */}
          <div className="flex-shrink-0 relative z-10">
            <Link href="/" className="flex items-center gap-3 group/logo">
              {/* Blue/Teal stylized logo icon */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover/logo:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              {/* Title & Tagline */}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide group-hover/logo:text-zinc-200 transition-colors leading-tight">
                  Glyptika Studios
                </span>
                <span className="text-[9px] font-semibold text-teal-400 uppercase tracking-widest leading-none mt-0.5">
                  A Creative Tech Startup
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links with SVGs and Liquid Glass indicators */}
          <nav className="hidden xl:flex items-center gap-1 relative z-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.15)]"
                      : "text-zinc-300 hover:text-white hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-lg border border-transparent"
                  }`}
                >
                  <span className="opacity-80 shrink-0">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle Section */}
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/request-proposal"
              className="hidden sm:inline-block px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 leading-none whitespace-nowrap flex-shrink-0"
            >
              Request Proposal
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              type="button"
              className="xl:hidden p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5 transition-all duration-300 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <div className="flex flex-col gap-1 w-5 h-4 justify-center">
                <span className="w-5 h-[2px] bg-white rounded-full" />
                <span className="w-5 h-[2px] bg-white rounded-full" />
                <span className="w-5 h-[2px] bg-white rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[1400] transition-opacity duration-500"
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 z-[1500] overflow-y-auto transform transition-transform duration-500 ease-out flex flex-col justify-between ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div>
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide leading-tight">Glyptika Studios</span>
                <span className="text-[8px] font-semibold text-teal-400 uppercase tracking-widest leading-none mt-0.5">A Creative Tech Startup</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Close mobile menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation List */}
          <ul className="px-6 py-8 flex flex-col gap-3.5 list-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-white/15 text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                        : "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="opacity-80 shrink-0">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Proposal CTA Footer */}
        <div className="p-6 border-t border-white/10 bg-zinc-950/30">
          <Link
            href="/request-proposal"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full py-4 rounded-2xl text-center font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-lg shadow-blue-600/20"
          >
            Request Proposal
          </Link>
        </div>
      </div>
    </>
  );
}