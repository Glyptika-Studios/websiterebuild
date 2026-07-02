import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Home", href: "/" },
      { name: "Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Products", href: "/products" },
    ],
    solutions: [
      { name: "Services", href: "/services" },
      { name: "XPLOR", href: "/xplor" },
      { name: "IMS Portal", href: "/ims" },
      { name: "Insights Feed", href: "/insights" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const contactInfo = {
    email1: "hello@glyptika.com",
    email2: "proposals@glyptika.com",
    phone1: "+1 (555) 019-2834",
    phone2: "+1 (555) 019-5678",
    address: "100 Innovation Way, Suite 400, Tech City, TC 90210",
  };

  return (
    <footer className="relative z-20 border-t border-[#DADCE0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden border border-[#DADCE0]">
                <Image src="/logo.jpg" alt="Glyptika Studios Logo" width={36} height={36} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#202124] tracking-tight leading-tight">
                  Glyptika Studios
                </span>
                <span className="text-[9px] font-semibold text-[#1A73E8] uppercase tracking-widest leading-none mt-0.5">
                  A Creative Tech Startup
                </span>
              </div>
            </Link>
            <p className="text-[#5F6368] text-sm max-w-sm mb-6 leading-relaxed">
              We design and construct bleeding-edge digital ecosystems, next-gen SaaS portals, and state-of-the-art interactive platforms. Accelerating your growth through robust software architecture.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8]/40 flex items-center justify-center text-[#5F6368] hover:text-[#1A73E8] transition-all duration-200 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8]/40 flex items-center justify-center text-[#5F6368] hover:text-[#1A73E8] transition-all duration-200 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8]/40 flex items-center justify-center text-[#5F6368] hover:text-[#1A73E8] transition-all duration-200 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[#202124] text-sm font-semibold uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#5F6368] hover:text-[#1A73E8] transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-[#202124] text-sm font-semibold uppercase tracking-wider mb-5">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#5F6368] hover:text-[#1A73E8] transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#202124] text-sm font-semibold uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[#5F6368] leading-relaxed">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1A73E8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col text-[#5F6368]">
                  <a href={`mailto:${contactInfo.email1}`} className="hover:text-[#1A73E8] transition-colors duration-200">
                    {contactInfo.email1}
                  </a>
                  <a href={`mailto:${contactInfo.email2}`} className="text-xs text-[#80868B] hover:text-[#1A73E8] transition-colors duration-200 mt-0.5">
                    {contactInfo.email2}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1A73E8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex flex-col text-[#5F6368]">
                  <a href={`tel:${contactInfo.phone1}`} className="hover:text-[#1A73E8] transition-colors duration-200">
                    {contactInfo.phone1}
                  </a>
                  <span className="text-xs text-[#80868B]">{contactInfo.phone2}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#DADCE0] mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#80868B]">
          <p>&copy; {currentYear} Glyptika Studios. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-[#5F6368] transition-colors duration-200">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}