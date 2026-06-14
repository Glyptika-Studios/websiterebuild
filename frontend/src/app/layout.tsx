import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glyptica",
  description: "Enterprise AI Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased relative min-h-screen bg-white text-slate-800`}>
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-circle w-32 h-32 bg-gradient-to-tr from-blue-600/10 to-teal-500/5 top-[20%] left-[10%] [animation-delay:0s]" />
          <div className="floating-circle w-48 h-48 bg-gradient-to-tr from-indigo-600/10 to-blue-500/5 top-[60%] right-[15%] [animation-delay:2s]" />
          <div className="floating-circle w-24 h-24 bg-gradient-to-tr from-teal-500/10 to-cyan-400/5 bottom-[20%] left-[20%] [animation-delay:4s]" />
        </div>

        <AuthProvider>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}