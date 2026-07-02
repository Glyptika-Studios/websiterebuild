"use client";

import PageHeader from "@/components/shared/PageHeader";
import ItemGrid from "@/components/shared/ItemGrid";
import { LayoutGrid } from "lucide-react";

const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    title: "XPLOR Engine",
    category: "Spatial Computing",
    description: "Our flagship automated compiler that takes flat floor plans (.DWG, .DXF, or PDF) and renders fully interactive 3D WebGL models and standalone virtual reality walkthroughs.",
    href: "/xplor"
  },
  {
    id: "prod-2",
    title: "IMS Portal",
    category: "Logistics SaaS",
    description: "Next-generation Inventory Management Solution custom-engineered for defense institutions and secure enterprises. Features isolated Postgres cores and air-gapped support.",
    href: "/ims"
  },
  {
    id: "prod-3",
    title: "HRV Simulator",
    category: "VR Tactical Training",
    description: "Highly secure virtual reality simulator engineered for defense onboarding, equipment training, and tactical coordination runs.",
    href: "/request-proposal"
  }
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader 
          badgeText="Our Products" 
          badgeIcon={LayoutGrid}
          title="Proprietary" 
          gradientTitle="Platforms"
          description="Discover our suite of high-performance tools designed to automate, train, and accelerate your operations."
        />
        
        <ItemGrid items={MOCK_PRODUCTS} type="products" />
      </div>
    </main>
  );
}
