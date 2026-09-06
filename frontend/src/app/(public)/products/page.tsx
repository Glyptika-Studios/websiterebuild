"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import ItemGrid, { GridItem } from "@/components/shared/ItemGrid";
import { LayoutGrid, Loader2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  overview: string | null;
  description: string | null;
  category_id: string | null;
  cover_id: string | null;
  featured: boolean;
  status: string;
  published_at: string;
  category: { id: string; label: string; slug: string } | null;
  tags?: string[];
}

export default function ProductsPage() {
  const [items, setItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/products");
        const json = await res.json();
        if (json.success && json.data) {
          const mapped: GridItem[] = json.data.map((p: Product) => {
            // Map title/slug to custom page routes if they match xplor or ims
            let href = "/request-proposal";
            const titleLower = p.title.toLowerCase();
            if (titleLower.includes("xplor")) {
              href = "/xplor";
            } else if (titleLower.includes("ims")) {
              href = "/ims";
            }

            return {
              id: p.id,
              title: p.title,
              category: p.category?.label || "Platform",
              description: p.overview || "",
              fullDescription: p.description || p.overview || "",
              href: href,
              tags: p.tags || [],
            };
          });
          setItems(mapped);
        }
      } catch (err) {
        console.error("Failed to load public products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader 
          badgeText="Our Products" 
          badgeIcon={LayoutGrid}
          title="Proprietary" 
          gradientTitle="Platforms"
          description="We build training simulators, inventory automation systems, and spatial visualization tools — all engineered in-house, tailored to what you need."
        />
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
            <span className="ml-3 text-sm text-[#6B7280]">Loading products...</span>
          </div>
        ) : items.length === 0 ? (
          <ItemGrid 
            items={[
              {
                id: "prod-hrv",
                title: "HRV Simulator",
                category: "Simulation",
                description: "Immersive VR training for heavy recovery vehicle operations — engineered for real-world readiness without risking multi-million dollar equipment.",
                fullDescription: "Immersive VR training for heavy recovery vehicle operations — engineered for real-world readiness without risking multi-million dollar equipment.",
                href: "/request-proposal",
                tags: ["VR Training", "Defense"],
              },
              {
                id: "prod-ims",
                title: "IMS",
                category: "Logistics Automation",
                description: "Our defense-grade inventory automation platform, built on two core modules: GAVIN-SPARK for smart parts allocation and SAPEAA for procurement intelligence.",
                fullDescription: "Our defense-grade inventory automation platform, built on two core modules: GAVIN-SPARK (Global Automated Virtual Inventory & Network) for smart parts allocation and record keeping, and SAPEAA (Sales and Purchase Ecosystem with Advanced Analysis) for procurement intelligence.",
                href: "/ims",
                tags: ["GAVIN-SPARK", "SAPEAA", "Defense"],
              },
              {
                id: "prod-xplor",
                title: "XPLOR",
                category: "Spatial Visualization",
                description: "Making spatial visualization faster, more accessible, and more affordable — automating the conversion of 2D drawings into 3D and VR environments.",
                fullDescription: "Making spatial visualization faster, more accessible, and more affordable — automating the conversion of 2D drawings into 3D and VR environments.",
                href: "/xplor",
                tags: ["2D to 3D", "VR Conversion"],
              },
            ]} 
            type="products" 
          />
        ) : (
          <ItemGrid items={items} type="products" />
        )}
      </div>
    </main>
  );
}
