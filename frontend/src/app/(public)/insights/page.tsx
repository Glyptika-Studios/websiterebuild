"use client";

import PageHeader from "@/components/shared/PageHeader";
import ItemGrid from "@/components/shared/ItemGrid";
import { FileText } from "lucide-react";

// Sample Data matching /api/posts fields
const MOCK_POSTS = [
  {
    id: "post-1",
    title: "The Future of Spatial Computing in Enterprise",
    category: "Opinion",
    date: "June 12, 2026",
    excerpt: "How VR and AR technologies are rapidly transforming industrial training, defense operations, and architectural visualization.",
    href: "/insights/future-of-spatial-computing"
  },
  {
    id: "post-2",
    title: "Automating Defense Workflows with Custom ERM",
    category: "Case Study",
    date: "May 28, 2026",
    excerpt: "A deep dive into how Glyptika's Inventory Management Solution drastically reduced overhead for defense institutions.",
    href: "/insights/automating-defense-workflows"
  },
  {
    id: "post-3",
    title: "Next-Gen WebGL Rendering Techniques",
    category: "Engineering",
    date: "April 15, 2026",
    excerpt: "Exploring the technical hurdles of rendering high-fidelity 3D assets directly within standard web browsers.",
    href: "/insights/webgl-rendering-techniques"
  }
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader 
          badgeText="Our Insights" 
          badgeIcon={FileText}
          title="Engineering &" 
          gradientTitle="Thoughts"
          description="Read about our latest research, technical case studies, and perspectives on the future of software and visualization."
        />
        
        <ItemGrid items={MOCK_POSTS.map(p => ({ ...p, description: p.excerpt }))} type="posts" />
      </div>
    </main>
  );
}
