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
    <main className="min-h-screen bg-[#FAFAF9]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
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
