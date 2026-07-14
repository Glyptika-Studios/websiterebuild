"use client";

import { useState, useEffect } from "react";
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
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);

  useEffect(() => {
    fetch("/api/v1/posts")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((body: any) => {
        if (body.success && body.data && Array.isArray(body.data.posts) && body.data.posts.length > 0) {
          const mapped = body.data.posts.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category?.label || "General",
            date: new Date(p.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            excerpt: p.excerpt || "No description available.",
            href: p.linkedin_url ? p.linkedin_url : `/insights/${p.slug || p.id}`,
            featured: p.featured,
            tags: p.tags || [],
          }));

          // Sort featured posts at the top, preserving date ordering for others
          const sorted = [...mapped].sort((a: any, b: any) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });

          setPosts(sorted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader 
          badgeText="Our Insights" 
          badgeIcon={FileText}
          title="Engineering &" 
          gradientTitle="Thoughts"
          description="Read about our latest research, technical case studies, and perspectives on the future of software and visualization."
        />
        
        <ItemGrid items={posts.map(p => ({ ...p, description: p.excerpt }))} type="posts" />
      </div>
    </main>
  );
}
