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
    <main className="min-h-screen bg-[#000000] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[150px] rounded-full -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
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

