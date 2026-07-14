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
    <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-5"
      >
        <BadgeIcon className="w-3.5 h-3.5" />
        {badgeText}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] mb-5 tracking-tight leading-tight"
      >
        {title} {gradientTitle && <span className="text-[#2563EB] pb-0.5 inline-block">{gradientTitle}</span>}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[#6B7280] text-xl md:text-2xl font-normal leading-relaxed max-w-3xl"
      >
        {description}
      </motion.p>
    </div>
  );
}
