"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";

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
            className={`w-full md:w-[calc(50%-12px)] ${lgWidth} group relative bg-white hover:bg-[#D2E3FC] border border-[#E5E7EB] hover:border-[#B4D0FB] rounded-[20px] p-7 transition-all duration-300 flex flex-col shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.3)] ${
              type !== "posts" ? "cursor-pointer" : ""
            }`}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#111827] mb-2 leading-tight">
                {item.title}
              </h3>

              {item.date && (
                <p className="text-sm text-[#6B7280] mb-2 font-semibold uppercase tracking-widest">{item.date}</p>
              )}

              {item.description && (
                <p className="text-[#6B7280] text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>

            {item.href && (
              <div className="relative z-10 mt-auto pt-4 border-t border-[#E5E7EB] transition-colors duration-300 flex">
                {type === "posts" ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-sm font-bold bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF] hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white transition-all duration-300 shadow-sm"
                  >
                    Read Article
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-sm font-bold bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF] group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:text-white transition-all duration-300 shadow-sm"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
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
              className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-[20px] p-7 shadow-xl z-10 flex flex-col space-y-5"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 text-[#6B7280] hover:text-[#111827] transition-colors p-1"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                {selectedItem.category && (
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#2563EB] bg-[#F3F7FF] px-2.5 py-1 rounded-full border border-[#DCEBFF] w-fit block mb-3">
                    {selectedItem.category}
                  </span>
                )}
                <h4 className="text-xl font-bold text-[#111827] leading-tight">
                  {selectedItem.title}
                </h4>
              </div>

              <div className="text-[#6B7280] text-base leading-relaxed border-t border-[#E5E7EB] pt-4">
                {selectedItem.description || "Bespoke custom-engineered solution designed to optimize security, time efficiency, and operational accuracy."}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#E5E7EB]">
                <Link
                  href="/request-proposal"
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_10px_24px_rgba(37,99,235,0.15)] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 text-center flex-1 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Enquire / Get Details
                </Link>

                {(selectedItem.href === "/xplor" || selectedItem.href === "/ims") && (
                  <Link
                    href={selectedItem.href}
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-3 bg-white hover:bg-[#F3F7FF] text-[#2563EB] border border-[#2563EB] rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 text-center flex-1 hover:-translate-y-0.5 active:translate-y-0"
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
