"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "XPLOR", href: "/xplor" },
    { name: "IMS", href: "/ims" },
    { name: "Insights", href: "/insights" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" },
  ];

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-40px)] sm:w-[calc(100%-60px)] max-w-5xl xl:max-w-6xl transition-all duration-500 ${
          isScrolled ? "top-4" : "top-6"
        }`}
      >
        <div
          className={`relative rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 overflow-hidden group ${
            isScrolled
              ? "backdrop-blur-md bg-white/60 border border-[#1A73E8]/35 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_0_15px_rgba(26,115,232,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:border-[#1A73E8]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05),0_0_25px_rgba(26,115,232,0.2),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Glossy sweep animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Logo */}
          <div className="flex-shrink-0 relative z-10">
            <Link href="/" className="flex items-center gap-3 group/logo">
              <div className="relative w-9 h-9 overflow-hidden rounded-lg shadow-sm border border-[#DADCE0] group-hover/logo:border-[#1A73E8]/50 transition-colors">
                <Image src="/logo.jpg" alt="Glyptika Logo" fill className="object-cover" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-bold text-[#202124] tracking-tight leading-tight group-hover/logo:text-[#1A73E8] transition-colors">
                  Glyptika Studios
                </span>
                <span className="text-[10px] font-semibold text-[#1A73E8] uppercase tracking-widest leading-none mt-0.5">
                  A Creative Tech Startup
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center relative z-10 anchor-nav">
            <ul className="flex items-center gap-0.5 list-none p-0 m-0 anchor-nav-list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      data-active={isActive}
                      className={`anchor-link flex items-center px-4 py-2.5 rounded-full text-sm font-semibold tracking-tight transition-colors duration-300 ${
                        isActive
                          ? "text-[#1A73E8]"
                          : "text-[#5F6368] hover:text-[#202124]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 relative z-10">
            <Link
              href="/request-proposal"
              className="hidden sm:inline-block px-5 py-2 text-sm font-semibold rounded-full text-white bg-[#1A73E8] hover:bg-[#1765CC] border border-[#1A73E8]/40 hover:border-[#1A73E8]/60 shadow-[0_0_12px_rgba(26,115,232,0.15)] hover:shadow-[0_0_20px_rgba(26,115,232,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 leading-none whitespace-nowrap"
            >
              Request Proposal
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              type="button"
              className="xl:hidden p-2 rounded-full text-[#5F6368] hover:text-[#202124] hover:bg-white/20 border border-[#DADCE0] transition-all duration-300 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <div className="flex flex-col gap-[5px] w-5 h-4 justify-center">
                <span className="w-5 h-[2px] bg-current rounded-full" />
                <span className="w-5 h-[2px] bg-current rounded-full" />
                <span className="w-5 h-[2px] bg-current rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1400] transition-opacity duration-300"
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-[1500] overflow-y-auto transform transition-transform duration-400 ease-out flex flex-col justify-between ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div>
          {/* Mobile Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#DADCE0]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-[#DADCE0]">
                <Image src="/logo.jpg" alt="Glyptika Logo" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#202124] tracking-tight leading-tight">Glyptika Studios</span>
                <span className="text-[10px] font-semibold text-[#1A73E8] uppercase tracking-widest leading-none mt-0.5">A Creative Tech Startup</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 border border-[#DADCE0] flex items-center justify-center text-[#5F6368] hover:text-[#202124] hover:bg-white/40 transition-all duration-200"
              aria-label="Close mobile menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Nav */}
          <ul className="px-4 py-6 flex flex-col gap-1 list-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-[#E8F0FE] text-[#1A73E8]"
                        : "text-[#5F6368] hover:bg-white/20 hover:text-[#202124]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile CTA Footer */}
        <div className="p-5 border-t border-[#DADCE0]">
          <Link
            href="/request-proposal"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full py-3.5 rounded-xl text-center font-semibold text-white bg-[#1A73E8] hover:bg-[#1765CC] transition-all duration-200"
          >
            Request Proposal
          </Link>
        </div>
      </div>
    </>
  );
}