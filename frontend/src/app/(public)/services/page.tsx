"use client";

import PageHeader from "@/components/shared/PageHeader";
import ItemGrid from "@/components/shared/ItemGrid";
import { Layers } from "lucide-react";

const MOCK_SERVICES = [
  {
    id: "svc-1",
    title: "Custom 3D Asset Creation",
    category: "3D Visualization",
    description: "Procedural synthesis of high-fidelity 3D assets mapped from CAD outlines. Optimized using texture atlases and dynamic Level of Detail (LOD) compilation.",
    url: "/request-proposal"
  },
  {
    id: "svc-2",
    title: "VR Environment Creation",
    category: "Spatial Engineering",
    description: "Bespoke virtual reality scenes and simulations compatible with WebXR, SteamVR, and Oculus arrays. Full collision meshes and customized lighting bakes.",
    url: "/request-proposal"
  },
  {
    id: "svc-3",
    title: "Digital Automation",
    category: "Software Engineering",
    description: "Transition manual material logs to secure automated scripts. Custom APIs, webhooks, and air-gapped system integrations.",
    url: "/request-proposal"
  },
  {
    id: "svc-4",
    title: "Inventory Management Solutions",
    category: "Logistics Sync",
    description: "Bespoke deployment, migration, and maintenance packages for the IMS Portal. Custom authorization rules tailored to enterprise operational pipelines.",
    url: "/ims"
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
        <PageHeader 
          badgeText="Our Services" 
          badgeIcon={Layers}
          title="Digital" 
          gradientTitle="Ecosystems"
          description="We engineer bespoke solutions across spatial computing, 3D visualization, and automated enterprise software."
        />
        
        <ItemGrid items={MOCK_SERVICES.map(s => ({ ...s, href: s.url }))} type="services" />
      </div>
    </main>
  );
}

