"use client";

import { motion } from "framer-motion";
import { Sparkles, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  badgeText: string;
  badgeIcon?: LucideIcon;
  title: string;
  gradientTitle?: string;
  description: string;
}

export default function PageHeader({ badgeText, badgeIcon: BadgeIcon = Sparkles, title, gradientTitle, description }: PageHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6"
      >
        <BadgeIcon className="w-3.5 h-3.5" />
        {badgeText}
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
      >
        {title} {gradientTitle && <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{gradientTitle}</span>}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
      >
        {description}
      </motion.p>
    </div>
  );
}
