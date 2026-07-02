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

  const lgWidth = items.length === 4 || items.length <= 2
    ? "lg:w-[calc(50%-12px)]"
    : "lg:w-[calc(33.333%-16px)]";

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={(e) => handleCardClick(e, item)}
            className={`w-full md:w-[calc(50%-12px)] ${lgWidth} group relative bg-white border border-[#DADCE0] hover:border-[#BDC1C6] rounded-2xl p-7 transition-all duration-200 flex flex-col shadow-sm hover:shadow-md ${
              type !== "posts" ? "cursor-pointer" : ""
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                {item.category && (
                  <span className="text-xs font-medium uppercase tracking-wider text-[#1A73E8] bg-[#E8F0FE] px-3 py-1 rounded-full border border-[#D2E3FC]">
                    {item.category}
                  </span>
                )}
                <Icon className="w-5 h-5 text-[#BDC1C6] group-hover:text-[#1A73E8] transition-colors ml-auto" />
              </div>

              <h3 className="text-xl font-semibold text-[#202124] mb-2 group-hover:text-[#1A73E8] transition-colors leading-tight">
                {item.title}
              </h3>

              {item.date && (
                <p className="text-xs text-[#80868B] mb-2 font-medium uppercase tracking-widest">{item.date}</p>
              )}

              {item.description && (
                <p className="text-[#5F6368] text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>

            {item.href && (
              <div className="relative z-10 mt-auto pt-4 border-t border-[#DADCE0]">
                {type === "posts" ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#5F6368] group-hover:text-[#1A73E8] transition-colors"
                  >
                    Read Article
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <span
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#5F6368] group-hover:text-[#1A73E8] transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-white border border-[#DADCE0] rounded-2xl p-7 shadow-xl z-10 flex flex-col space-y-5"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 text-[#80868B] hover:text-[#202124] transition-colors p-1"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                {selectedItem.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-1 rounded-full border border-[#D2E3FC] w-fit block mb-3">
                    {selectedItem.category}
                  </span>
                )}
                <h4 className="text-xl font-bold text-[#202124] leading-tight">
                  {selectedItem.title}
                </h4>
              </div>

              <div className="text-[#5F6368] text-sm leading-relaxed border-t border-[#DADCE0] pt-4">
                {selectedItem.description || "Bespoke custom-engineered solution designed to optimize security, time efficiency, and operational accuracy."}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#DADCE0]">
                <Link
                  href="/request-proposal"
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1765CC] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 text-center flex-1"
                >
                  Enquire / Get Details
                </Link>

                {(selectedItem.href === "/xplor" || selectedItem.href === "/ims") && (
                  <Link
                    href={selectedItem.href}
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-3 bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] border border-[#DADCE0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 text-center flex-1"
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
