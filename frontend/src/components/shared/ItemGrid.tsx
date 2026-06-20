"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Layers, LayoutGrid, FileText, X } from "lucide-react";

export interface GridItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  href?: string;
  date?: string;
}

interface ItemGridProps {
  items: GridItem[];
  type?: "services" | "products" | "posts";
}

export default function ItemGrid({ items, type = "services" }: ItemGridProps) {
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);

  const getIcon = () => {
    switch (type) {
      case "products": return LayoutGrid;
      case "posts": return FileText;
      default: return Layers;
    }
  };
  
  const Icon = getIcon();

  const handleCardClick = (e: React.MouseEvent, item: GridItem) => {
    if (type === "products" || type === "services") {
      e.preventDefault();
      setSelectedItem(item);
    }
  };

  // For 4 items use 2×2 grid; for 3 or 5+ use 3 columns with centered last row
  const lgWidth = items.length === 4 || items.length <= 2
    ? "lg:w-[calc(50%-12px)]"
    : "lg:w-[calc(33.333%-16px)]";

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={(e) => handleCardClick(e, item)}
            className={`w-full md:w-[calc(50%-12px)] ${lgWidth} group relative bg-[#0a1128]/60 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-300 flex flex-col hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden ${
              type !== "posts" ? "cursor-pointer" : ""
            }`}
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                {item.category && (
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {item.category}
                  </span>
                )}
                <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors ml-auto" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors leading-tight">
                {item.title}
              </h3>
              
              {item.date && (
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-widest">{item.date}</p>
              )}

              {item.description && (
                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>

            {item.href && (
              <div className="relative z-10 mt-auto pt-4 border-t border-white/5">
                {type === "posts" ? (
                  <Link 
                    href={item.href} 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors"
                  >
                    Read Article
                    <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal Details Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-[#070d1e]/95 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10 flex flex-col space-y-6"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-1"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                {selectedItem.category && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 w-fit block mb-3">
                    {selectedItem.category}
                  </span>
                )}
                <h4 className="text-2xl font-black text-white leading-tight font-space">
                  {selectedItem.title}
                </h4>
              </div>

              <div className="text-slate-350 text-sm leading-relaxed border-t border-white/5 pt-5 font-light">
                {selectedItem.description || "Bespoke custom-engineered solution designed to optimize security, time efficiency, and operational accuracy."}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                <Link 
                  href="/request-proposal"
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 text-center flex-1 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  Enquire / Get Details
                </Link>
                
                {(selectedItem.href === "/xplor" || selectedItem.href === "/ims") && (
                  <Link 
                    href={selectedItem.href}
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 hover:border-white/10 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 text-center flex-1"
                  >
                    View Product Page
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
