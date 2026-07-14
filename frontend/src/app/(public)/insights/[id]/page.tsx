"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User, Sparkles, Clock, Share2 } from "lucide-react";

interface Post {
  id: string;
  type: "blog" | "linkedin";
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  date: string;
  image_url?: string;
  tags: string[];
  featured: boolean;
  url?: string;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: "post-1",
    type: "blog",
    title: "The Future of Spatial Computing in Enterprise",
    excerpt: "How VR and AR technologies are rapidly transforming industrial training, defense operations, and architectural visualization.",
    content: "## The Spatial Shift\nSpatial computing is no longer a gaming novelty. Modern cloud architectures require strict isolation, low-latency, and high-fidelity rendering. Across industrial setups, defense facilities, and corporate workspaces, immersive tech is altering operational pipelines.\n\n## Core Advantages of Spatial Tech\n1. **Zero-Risk Simulations**: Training personnel in high-risk environments (like tactical field logistics or machinery maintenance) without risking equipment or lives.\n2. **Reduced Production Iterations**: Visualizing CAD schematics in interactive stereoscopic scale saves up to 80% on prototype costs.\n3. **Real-Time Data Integration**: Merging live telemetry feeds directly into augmented HUD screens on-site.\n\n## Scaling Challenges\nRendering high-polygon density configurations within local browser constraints demands extreme network compression and optimized client-side buffer stacks. The future lies in hybrid WebGL streaming architectures.",
    category: "Opinion",
    date: "June 12, 2026",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    tags: ["SpatialComputing", "VR", "Enterprise"],
    featured: true,
  },
  {
    id: "post-2",
    type: "blog",
    title: "Automating Defense Workflows with Custom ERM",
    excerpt: "A deep dive into how Glyptika's Inventory Management Solution drastically reduced overhead for defense institutions.",
    content: "## Scaling Material Logistics\nSecurity institutions demand impeccable audit trails, strict authorization trees, and air-gapped system isolation. Standard commercial ERP solutions fail to address custom materials and packaging frameworks required for tactical operations.\n\n## The IMS Architecture\nOur custom Inventory Management Solution features three secure layers:\n- **Isolated PostgreSQL core**: Utilizing strict Row Level Security (RLS).\n- **Centralized Dispatch & Packaging Modules**: Automatically updating stock indexes when containers are scheduled.\n- **Uncapped local cache**: Preserving operations when server connectivity drops.",
    category: "Case Study",
    date: "May 28, 2026",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    tags: ["Defense", "SaaS", "Security"],
    featured: false,
  },
  {
    id: "post-3",
    type: "blog",
    title: "Next-Gen WebGL Rendering Techniques",
    excerpt: "Exploring the technical hurdles of rendering high-fidelity 3D assets directly within standard web browsers.",
    content: "## The WebGL Performance Bar\nDelivering high-fidelity 3D renderings within browser constraints requires specialized mesh optimization and advanced memory management pipelines.\n\n### Optimization checklist\n1. **Dynamic Level of Detail (LOD)**: Reducing triangle counts for objects far from the active camera perspective.\n2. **Pre-allocated vertex pools**: Bypassing garbage collector latency.\n3. **Texture Atlas packing**: Drastically lowering GPU draw calls.",
    category: "Engineering",
    date: "April 15, 2026",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    tags: ["WebGL", "WebGL3D", "Performance"],
    featured: false,
  }
];

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_posts");
    let allPosts = DEFAULT_POSTS;
    if (saved) {
      try {
        allPosts = JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    
    // Find matching post by id or slugified title
    const found = allPosts.find(p => {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return p.id === id || slug === id;
    });

    setPost(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-500 flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading article...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-center font-sans px-4">
        <h2 className="text-3xl font-black text-[#111827] mb-3">Article Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center">This post may have been draft-restricted or removed by system editors.</p>
        <Link href="/insights" className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl font-bold transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-32">
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40">
        {/* Back Link */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Link>

        {/* Category & Date badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A73E8] bg-[#E8F0FE] border border-[#D2E3FC] px-3.5 py-1.5 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </div>
          {post.featured && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Featured Article</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Author / Metadata teaser */}
        <div className="flex items-center justify-between border-y border-slate-200 py-5 mb-10 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[#111827] font-bold">Glyptika Engineering Team</p>
              <p className="text-xs text-slate-500">Creative Tech Authors</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> 4 min read</span>
          </div>
        </div>

        {/* Cover Image */}
        {post.image_url && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-lg mb-12">
            <Image 
              src={post.image_url} 
              alt={post.title} 
              fill 
              priority
              className="object-cover"
              sizes="(max-w-4xl) 100vw, 896px"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-slate-700 leading-relaxed font-light mb-8 italic border-l-2 border-[#1A73E8] pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Content Body */}
        <div className="max-w-none mb-16 space-y-6 text-slate-700 leading-relaxed">
          {post.content ? (
            post.content.split("\n").map((para, i) => {
              if (para.startsWith("##")) {
                return <h2 key={i} className="text-2xl font-bold text-[#111827] mt-10 mb-4">{para.replace("##", "").trim()}</h2>;
              }
              if (para.startsWith("###")) {
                return <h3 key={i} className="text-xl font-bold text-[#111827] mt-8 mb-3">{para.replace("###", "").trim()}</h3>;
              }
              if (para.startsWith("-") || para.startsWith("*")) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-slate-700">
                    <li>{para.substring(1).trim()}</li>
                  </ul>
                );
              }
              if (para.startsWith("1.")) {
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 text-slate-700">
                    <li>{para.substring(2).trim()}</li>
                  </ol>
                );
              }
              if (para.trim() === "") return null;
              return <p key={i} className="text-base text-slate-700 mb-4">{para}</p>;
            })
          ) : (
            <p>This article does not have any content written yet.</p>
          )}
        </div>

        {/* Tags footer */}
        <div className="border-t border-slate-200 pt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold">
                <Tag className="w-3 h-3" />
                #{tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#111827] rounded-xl text-xs font-bold border border-slate-200 transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Article
          </button>
        </div>
      </article>
    </main>
  );
}
