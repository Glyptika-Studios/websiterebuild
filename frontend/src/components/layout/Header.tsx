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
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "XPLOR", href: "/xplor" },
    { name: "IMS", href: "/ims" },
    { name: "Insights", href: "/insights" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" }
  ];

  return (
    <>
      {/* Navbar Fixed Container */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-40px)] sm:w-[calc(100%-60px)] max-w-5xl xl:max-w-6xl font-space transition-all duration-500 ${
          isScrolled ? "top-4" : "top-8"
        }`}
      >
        <div
          className={`relative rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 overflow-hidden group ${
            isScrolled
              ? "backdrop-blur-md bg-white/[0.003] border border-blue-500/45 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_0_15px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.02)] hover:-translate-y-0.5 hover:border-blue-400/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2),0_0_25px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.03)]"
              : "bg-transparent border border-transparent shadow-none"
          }`}
        >
          {/* Glossy sweep animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Logo Section */}
          <div className="flex-shrink-0 relative z-10">
            <Link href="/" className="flex items-center group/logo">
              {/* Title & Tagline */}
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black text-white tracking-wide group-hover/logo:text-zinc-200 transition-colors leading-tight">
                  Glyptika Studios
                </span>
                <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-widest leading-none mt-1">
                  A Creative Tech Startup
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links with Liquid Glass indicators */}
          <nav className="hidden xl:flex items-center relative z-10 anchor-nav">
            <ul className="flex items-center gap-1 list-none p-0 m-0 anchor-nav-list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      data-active={isActive}
                      className={`anchor-link flex items-center px-4 py-2.5 rounded-full text-base font-black tracking-wide transition-all duration-300 ${
                        isActive ? "text-white" : "text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA & Mobile Toggle Section */}
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/request-proposal"
              className="hidden sm:inline-block px-5 py-2.5 text-sm font-black uppercase tracking-wider rounded-full text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/40 hover:border-blue-400/60 shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 leading-none whitespace-nowrap flex-shrink-0"
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
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black text-white tracking-wide leading-tight">Glyptika Studios</span>
                <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-widest leading-none mt-1">A Creative Tech Startup</span>
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
                    className={`flex items-center px-5 py-4 rounded-2xl text-lg font-extrabold transition-all duration-300 ${
                      isActive
                        ? "bg-white/15 text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                        : "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
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
            className="block w-full py-4 rounded-2xl text-center font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-300"
          >
            Request Proposal
          </Link>
        </div>
      </div>
    </>
  );
}