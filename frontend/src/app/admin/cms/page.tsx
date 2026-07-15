/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Settings,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Sliders,
  Phone,
  Layout,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";

// Data Interfaces
interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  stats: { value: number; suffix: string; label: string }[];
  carousel_items: { media_id: string; title: string; description: string }[];
}

interface XplorContent {
  hero_video_url: string;
  core_heading: string;
  core_desc: string;
  modules: { name: string; desc: string; features: string[] }[];
  showcase_heading: string;
  showcase_description: string;
  showcase_items: { media_id: string; title: string; description: string }[];
}

interface ImsContent {
  hero_title: string;
  hero_desc: string;
  pricing: { tier: string; price: string; cycle: string; features: string[] }[];
  faqs: { question: string; answer: string }[];
  showcase_heading: string;
  showcase_description: string;
  showcase_items: { media_id: string; title: string; description: string }[];
}

interface ContactSettings {
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  address: string;
  services: string[];
  social_linkedin: string;
  social_instagram: string;
  social_discord: string;
}

export default function CMSPageEditor() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("home", "write");

  // Tabs state
  const [activeTab, setActiveTab] = useState<"home" | "xplor" | "ims" | "contact">("home");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [dbModules, setDbModules] = useState<any[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const fetchModules = async (productId: string) => {
    setLoadingModules(true);
    try {
      const res = await api.get<any>(`/api/v1/admin/products/${productId}/modules`);
      if (res.success && res.data) {
        setDbModules(res.data.items || res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    } finally {
      setLoadingModules(false);
    }
  };

  const [dbImsProject, setDbImsProject] = useState<{ title: string; description: string }>({
    title: "IMS Portal: Next-Gen Logistics",
    description: "Automated logistics management custom-engineered for defense institutions and secure enterprises."
  });
  const [loadingImsProject, setLoadingImsProject] = useState(false);

  const fetchImsProject = async () => {
    setLoadingImsProject(true);
    try {
      const res = await api.get<any>("/api/v1/projects/44444444-0000-0000-0000-000000000004");
      if (res.success && res.data) {
        setDbImsProject({
          title: res.data.title || "",
          description: res.data.description || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch IMS project:", err);
    } finally {
      setLoadingImsProject(false);
    }
  };

  useEffect(() => {
    if (activeTab === "xplor") {
      fetchModules("22222222-0000-0000-0000-000000000002");
    } else if (activeTab === "ims") {
      fetchImsProject();
    } else {
      setDbModules([]);
    }
  }, [activeTab]);

  // Home State
  const [homeData, setHomeData] = useState<HomeContent>({
    hero_title: "Building the Technology of Tomorrow",
    hero_subtitle: "One unified platform for 3D, virtual reality, AI, and automation — built for teams that refuse to settle for ordinary.",
    stats: [
      { value: 10, suffix: "+", label: "Projects Delivered" },
      { value: 4, suffix: "+", label: "Defense Projects" },
      { value: 25, suffix: "+", label: "VR Environments" },
      { value: 3, suffix: "", label: "Proprietary Softwares" }
    ],
    carousel_items: [
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" }
    ]
  });

  // Xplor State
  const [xplorData, setXplorData] = useState<XplorContent>({
    hero_video_url: "https://assets.mixkit.co/videos/preview/mixkit-data-stream-on-a-screen-closeup-34248-large.mp4",
    core_heading: "XPLOR Autonomous Telemetry",
    core_desc: "The hyper-fast network stream resolver serving high-throughput enterprise client pipelines.",
    modules: [
      { name: "NEO", desc: "Edge buffer pipeline", features: ["1M ops/sec buffering", "Encrypted cache", "Multi-region sync"] },
      { name: "ADORNO", desc: "Statistical filter network", features: ["Real-time aggregators", "Custom alert thresholds", "Influx integrations"] }
    ],
    showcase_heading: "",
    showcase_description: "",
    showcase_items: [
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" }
    ]
  });

  // IMS State
  const [imsData, setImsData] = useState<ImsContent>({
    hero_title: "IMS Cluster Manager",
    hero_desc: "Deploy, analyze, and manage private server grids directly from a single centralized telemetry node.",
    pricing: [
      { tier: "Basic", price: "$29", cycle: "monthly", features: ["Up to 3 server nodes", "Standard telemetry reports", "Email support"] },
      { tier: "Premium", price: "$189", cycle: "monthly", features: ["Unlimited server nodes", "Real-time socket alerts", "Priority 24/7 PM support"] }
    ],
    faqs: [
      { question: "Is IMS self-hostable?", answer: "Yes, IMS can be deployed as an isolated Docker package on private clusters." }
    ],
    showcase_heading: "",
    showcase_description: "",
    showcase_items: [
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" },
      { media_id: "", title: "", description: "" }
    ]
  });

  // Contact State
  const [contactData, setContactData] = useState<ContactSettings>({
    email1: "hello@glyptika.com",
    email2: "proposals@glyptika.com",
    phone1: "+1 (555) 019-2834",
    phone2: "+1 (555) 019-5678",
    address: "100 Innovation Way, Suite 400, Tech City, TC 90210",
    services: ["Cloud Migrations", "SaaS Development", "Telemetry Grids", "AI Infrastructure"],
    social_linkedin: "https://linkedin.com",
    social_instagram: "https://instagram.com",
    social_discord: "https://discord.com"
  });

  const [videoOptions, setVideoOptions] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [imageOptions, setImageOptions] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const fetchVideoOptions = async () => {
    setLoadingVideos(true);
    try {
      const res = await api.get<any>("/api/v1/admin/media?media_type=video&limit=100");
      if (res.success && res.data) {
        setVideoOptions(res.data.items || res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const fetchImageOptions = async () => {
    setLoadingImages(true);
    try {
      const res = await api.get<any>("/api/v1/admin/media?media_type=image&limit=100");
      if (res.success && res.data) {
        setImageOptions(res.data.items || res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  const fetchPageData = async () => {
    try {
      // 1. Fetch home content
      const homeRes = await api.get<any>("/api/v1/pages/home");
      if (homeRes.success && homeRes.data) {
        const dbContent = homeRes.data.content || {};
        
        // Handle 4 stats
        const dbStats = dbContent.stats || [];
        const stats = [...dbStats];
        while (stats.length < 4) {
          stats.push({ value: 0, suffix: "", label: "" });
        }

        // Handle carousel items
        const dbCarousel = dbContent.carousel_items || [];
        const carousel_items = [...dbCarousel];
        while (carousel_items.length < 8) {
          carousel_items.push({ media_id: "", title: "", description: "" });
        }

        setHomeData({
          hero_title: dbContent.hero_title || "Building the Technology of Tomorrow",
          hero_subtitle: dbContent.hero_subtitle || "One unified platform for 3D, virtual reality, AI, and automation — built for teams that refuse to settle for ordinary.",
          stats: stats,
          carousel_items: carousel_items
        });

        if (dbContent.contact) {
          setContactData(prev => ({
            ...prev,
            email1: dbContent.contact.email1 || prev.email1,
            email2: dbContent.contact.email2 || prev.email2,
            phone1: dbContent.contact.phone1 || prev.phone1,
            phone2: dbContent.contact.phone2 || prev.phone2,
            address: dbContent.contact.address || prev.address,
            services: dbContent.contact.services || prev.services
          }));
        }
      }

      // 2. Fetch social links
      const socialRes = await api.get<any>("/api/v1/social-links");
      if (socialRes.success && socialRes.data) {
        const links = socialRes.data;
        const linkedin = links.find((l: any) => l.platform === "linkedin")?.url || "";
        const instagram = links.find((l: any) => l.platform === "instagram")?.url || "";
        const discord = links.find((l: any) => l.platform === "discord")?.url || "";
        setContactData(prev => ({
          ...prev,
          social_linkedin: linkedin,
          social_instagram: instagram,
          social_discord: discord
        }));
      }

      // 3. Fetch Xplor page content
      const xplorRes = await api.get<any>("/api/v1/pages/xplor");
      if (xplorRes.success && xplorRes.data) {
        const dbContent = xplorRes.data.content || {};
        const rawItems = dbContent.showcase_items || [];
        const items = [...rawItems];
        while (items.length < 3) {
          items.push({ media_id: "", title: "", description: "" });
        }
        setXplorData(prev => ({
          ...prev,
          hero_video_url: dbContent.hero_video_url || prev.hero_video_url,
          core_heading: dbContent.core_heading || prev.core_heading,
          core_desc: dbContent.core_desc || prev.core_desc,
          modules: dbContent.modules || prev.modules,
          showcase_heading: dbContent.showcase_heading || "See XPLOR in Action",
          showcase_description: dbContent.showcase_description || "Explore high-fidelity interactive spaces built automatically using the XPLOR synthesis pipeline.",
          showcase_items: items
        }));
      }

      // 4. Fetch IMS page content
      const imsRes = await api.get<any>("/api/v1/pages/ims");
      if (imsRes.success && imsRes.data) {
        const dbContent = imsRes.data.content || {};
        const rawItems = dbContent.showcase_items || [];
        const items = [...rawItems];
        while (items.length < 3) {
          items.push({ media_id: "", title: "", description: "" });
        }
        setImsData(prev => ({
          ...prev,
          hero_title: dbContent.hero_title || prev.hero_title,
          hero_desc: dbContent.hero_desc || prev.hero_desc,
          pricing: dbContent.pricing || prev.pricing,
          faqs: dbContent.faqs || prev.faqs,
          showcase_heading: dbContent.showcase_heading || "See IMS in Action",
          showcase_description: dbContent.showcase_description || "Explore high-fidelity interactive screens and modules built automatically using the IMS management pipeline.",
          showcase_items: items
        }));
      }
    } catch (err) {
      console.error("Failed to load page configs:", err);
    }
  };

  useEffect(() => {
    fetchVideoOptions();
    fetchImageOptions();
    fetchPageData();
  }, []);

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    setSaving(true);
    setFormError(null);
    try {
      const currentRes = await api.get<any>("/api/v1/pages/home");
      const currentContent = currentRes.success && currentRes.data ? currentRes.data.content : {};

      const updatedContent = {
        ...currentContent,
        hero_title: homeData.hero_title,
        hero_subtitle: homeData.hero_subtitle,
        stats: homeData.stats,
        carousel_items: homeData.carousel_items
      };

      await api.put("/api/v1/admin/pages/home", {
        content: updatedContent
      });

      localStorage.setItem("glyptika_cms_home", JSON.stringify(homeData));
      triggerSaveSuccess();
    } catch (err: any) {
      setFormError(err.message || "Failed to save Homepage settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveXplor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    setSaving(true);
    setFormError(null);
    try {
      // Save Xplor page content in DB
      await api.put("/api/v1/admin/pages/xplor", {
        content: {
          showcase_heading: xplorData.showcase_heading,
          showcase_description: xplorData.showcase_description,
          showcase_items: xplorData.showcase_items
        }
      });

      localStorage.setItem("glyptika_cms_xplor", JSON.stringify(xplorData));

      // Update modules and their pricing tiers
      for (const mod of dbModules) {
        await api.put(`/api/v1/admin/products/22222222-0000-0000-0000-000000000002/modules/${mod.id}`, {
          title: mod.title,
          description: mod.description || null,
          display_order: mod.display_order || 0,
          active: mod.active ?? true,
        });

        if (mod.module_pricing && mod.module_pricing.length > 0) {
          for (const pricing of mod.module_pricing) {
            await api.put(`/api/v1/admin/modules/${mod.id}/pricing/${pricing.tier}`, {
              price_amount: Number(pricing.price_amount),
              currency: pricing.currency || "INR",
              billing_cycle: pricing.billing_cycle || "monthly",
              details: pricing.details || {}
            });
          }
        }
      }

      triggerSaveSuccess();
    } catch (err: any) {
      setFormError(err.message || "Failed to save XPLOR configurations.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    setSaving(true);
    setFormError(null);
    try {
      // Save IMS page content in DB
      await api.put("/api/v1/admin/pages/ims", {
        content: {
          showcase_heading: imsData.showcase_heading,
          showcase_description: imsData.showcase_description,
          showcase_items: imsData.showcase_items
        }
      });

      localStorage.setItem("glyptika_cms_ims", JSON.stringify(imsData));

      // Update IMS project record in database
      await api.put("/api/v1/admin/projects/44444444-0000-0000-0000-000000000004", {
        title: dbImsProject.title,
        description: dbImsProject.description || null,
        status: "completed",
        featured: true
      });

      triggerSaveSuccess();
    } catch (err: any) {
      setFormError(err.message || "Failed to save IMS configurations.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    setSaving(true);
    setFormError(null);
    try {
      const currentRes = await api.get<any>("/api/v1/pages/home");
      const currentContent = currentRes.success && currentRes.data ? currentRes.data.content : {};

      const updatedContent = {
        ...currentContent,
        contact: {
          email1: contactData.email1,
          email2: contactData.email2,
          phone1: contactData.phone1,
          phone2: contactData.phone2,
          address: contactData.address,
          services: contactData.services
        }
      };

      await api.put("/api/v1/admin/pages/home", {
        content: updatedContent
      });

      if (contactData.social_linkedin && contactData.social_linkedin.trim()) {
        await api.put("/api/v1/admin/social_links/linkedin", { url: contactData.social_linkedin.trim() });
      } else {
        await api.delete("/api/v1/admin/social_links/linkedin").catch(() => null);
      }

      if (contactData.social_instagram && contactData.social_instagram.trim()) {
        await api.put("/api/v1/admin/social_links/instagram", { url: contactData.social_instagram.trim() });
      } else {
        await api.delete("/api/v1/admin/social_links/instagram").catch(() => null);
      }

      if (contactData.social_discord && contactData.social_discord.trim()) {
        await api.put("/api/v1/admin/social_links/discord", { url: contactData.social_discord.trim() });
      } else {
        await api.delete("/api/v1/admin/social_links/discord").catch(() => null);
      }

      localStorage.setItem("glyptika_cms_contact", JSON.stringify(contactData));
      triggerSaveSuccess();
    } catch (err: any) {
      setFormError(err.message || "Failed to save Contact & Footer settings.");
    } finally {
      setSaving(false);
    }
  };

  // Helper additions/removals

  const addImsFaq = () => {
    const item = { question: "New Question?", answer: "Answer description." };
    setImsData({ ...imsData, faqs: [...imsData.faqs, item] });
  };

  const removeImsFaq = (index: number) => {
    setImsData({ ...imsData, faqs: imsData.faqs.filter((_, i) => i !== index) });
  };

  const addContactService = (service: string) => {
    if (!service.trim() || contactData.services.includes(service.trim())) return;
    setContactData({ ...contactData, services: [...contactData.services, service.trim()] });
  };

  const removeContactService = (service: string) => {
    setContactData({ ...contactData, services: contactData.services.filter((s) => s !== service) });
  };

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Page CMS Editors
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manage copywriting, lists, and layout parameters for public routes
          </p>
        </div>
        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 animate-bounce self-start">
            <CheckCircle className="w-4 h-4" />
            <span>Layout content saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "home" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Homepage
        </button>
        <button
          onClick={() => setActiveTab("xplor")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "xplor" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          XPLOR Edit
        </button>
        <button
          onClick={() => setActiveTab("ims")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "ims" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          IMS Edit
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "contact" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Footer & Checklist
        </button>
      </div>

      {/* Content tabs bodies */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl">
        {activeTab === "home" && (
          <form onSubmit={handleSaveHome} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Layout className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Homepage Hero & Metrics</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hero Main Title</label>
                <input
                  type="text"
                  value={homeData.hero_title}
                  onChange={(e) => setHomeData({ ...homeData, hero_title: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={homeData.hero_subtitle}
                  onChange={(e) => setHomeData({ ...homeData, hero_subtitle: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => {
                  const stat = homeData.stats?.[idx] || { value: 0, suffix: "", label: "" };
                  return (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block border-b border-white/5 pb-1">Stat #{idx + 1}</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Value (Number)</label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...(homeData.stats || [])];
                            while (updated.length <= idx) {
                              updated.push({ value: 0, suffix: "", label: "" });
                            }
                            updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                            setHomeData({ ...homeData, stats: updated });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Suffix (e.g. +, %)</label>
                        <input
                          type="text"
                          value={stat.suffix || ""}
                          onChange={(e) => {
                            const updated = [...(homeData.stats || [])];
                            while (updated.length <= idx) {
                              updated.push({ value: 0, suffix: "", label: "" });
                            }
                            updated[idx] = { ...updated[idx], suffix: e.target.value };
                            setHomeData({ ...homeData, stats: updated });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Label</label>
                        <input
                          type="text"
                          value={stat.label || ""}
                          onChange={(e) => {
                            const updated = [...(homeData.stats || [])];
                            while (updated.length <= idx) {
                              updated.push({ value: 0, suffix: "", label: "" });
                            }
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setHomeData({ ...homeData, stats: updated });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Media Carousel Editor Section */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Homepage Media Carousel</h4>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Customize the images, titles, and descriptions shown in the sliding carousel on the homepage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                  const item = homeData.carousel_items?.[idx] || { media_id: "", title: "", description: "" };
                  return (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block border-b border-white/5 pb-1">Carousel Item #{idx + 1}</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Select Photo</label>
                        {loadingImages ? (
                          <div className="text-[10px] text-slate-500">Loading photos list...</div>
                        ) : (
                          <select
                            value={item.media_id || ""}
                            onChange={(e) => {
                              const updatedItems = [...(homeData.carousel_items || [])];
                              while (updatedItems.length <= idx) {
                                updatedItems.push({ media_id: "", title: "", description: "" });
                              }
                              updatedItems[idx] = { ...updatedItems[idx], media_id: e.target.value };
                              setHomeData({ ...homeData, carousel_items: updatedItems });
                            }}
                            disabled={!canWrite}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-350 focus:outline-none [&>option]:bg-[#0a1122]"
                          >
                            <option value="">-- No Photo Selected --</option>
                            {imageOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.file_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const updatedItems = [...(homeData.carousel_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], title: e.target.value };
                            setHomeData({ ...homeData, carousel_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none focus:border-blue-500/25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Short Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const updatedItems = [...(homeData.carousel_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                            setHomeData({ ...homeData, carousel_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none resize-none focus:border-blue-500/25"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all"
              >
                Save Homepage Settings
              </button>
            )}
          </form>
        )}

        {activeTab === "xplor" && (
          <form onSubmit={handleSaveXplor} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">XPLOR Edit</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hero video URL</label>
                <input
                  type="text"
                  value={xplorData.hero_video_url}
                  onChange={(e) => setXplorData({ ...xplorData, hero_video_url: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Core Value Heading</label>
                <input
                  type="text"
                  value={xplorData.core_heading}
                  onChange={(e) => setXplorData({ ...xplorData, core_heading: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Core Value Description</label>
                <textarea
                  rows={2}
                  value={xplorData.core_desc}
                  onChange={(e) => setXplorData({ ...xplorData, core_desc: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Database modules & Pricing Editor */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">XPLOR Modules & Pricing Specs</h4>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Edit title, description, and pricing tiers dynamically (stored in database).</p>
              </div>

              {loadingModules ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading database modules...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {dbModules.map((mod, modIdx) => (
                    <div key={mod.id} className="p-6 rounded-3xl bg-slate-950/40 border border-white/5 space-y-4">
                      {/* Module Title & Description */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Module Title</label>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...dbModules];
                              updated[modIdx].title = e.target.value;
                              setDbModules(updated);
                            }}
                            disabled={!canWrite}
                            className="w-full px-4 py-3 bg-slate-900/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500/25"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Module Description</label>
                          <textarea
                            rows={1}
                            value={mod.description || ""}
                            onChange={(e) => {
                              const updated = [...dbModules];
                              updated[modIdx].description = e.target.value;
                              setDbModules(updated);
                            }}
                            disabled={!canWrite}
                            className="w-full px-4 py-2.5 bg-slate-900/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500/25 resize-none"
                          />
                        </div>
                      </div>

                      {/* Module Pricing Tiers */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Pricing Tiers (basic, standard, premium)</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {["basic", "standard", "premium"].map((tierName) => {
                            // Find or create tier object
                            let tierObj = mod.module_pricing?.find((p: any) => p.tier === tierName);
                            if (!tierObj) {
                              // Initialize tierObj
                              tierObj = {
                                tier: tierName,
                                price_amount: 0,
                                currency: "INR",
                                billing_cycle: "monthly",
                                details: {
                                  name: tierName === "basic" ? "Lite" : tierName === "standard" ? "Standard" : "Pro",
                                  price: "₹0",
                                  jobsPerMonth: 0,
                                  extraJob: "—",
                                  admins: 0,
                                  screens: 0,
                                  maxAdmins: 0,
                                  maxScreens: 0,
                                  extraAdminCost: "—",
                                  extraScreenCost: "—",
                                  furnitureUploads: 0,
                                  extraFurnitureCost: "—",
                                  features: []
                                }
                              };
                              if (!mod.module_pricing) mod.module_pricing = [];
                              mod.module_pricing.push(tierObj);
                            }

                            return (
                              <div key={tierName} className="p-4 bg-slate-900/20 border border-white/5 rounded-2xl space-y-3">
                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block border-b border-white/5 pb-1">{tierName} Plan</span>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Plan Display Name</label>
                                    <input
                                      type="text"
                                      value={tierObj.details?.name || ""}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.details = { ...t.details, name: e.target.value };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Price Amount (Numeric)</label>
                                    <input
                                      type="number"
                                      value={tierObj.price_amount}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.price_amount = Number(e.target.value);
                                        t.details = { ...t.details, price: `₹${t.price_amount.toLocaleString()}` };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Jobs/Month</label>
                                    <input
                                      type="number"
                                      value={tierObj.details?.jobsPerMonth || 0}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.details = { ...t.details, jobsPerMonth: Number(e.target.value) };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Extra Job Cost</label>
                                    <input
                                      type="text"
                                      value={tierObj.details?.extraJob || ""}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.details = { ...t.details, extraJob: e.target.value };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Admins</label>
                                    <input
                                      type="number"
                                      value={tierObj.details?.admins || 0}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.details = { ...t.details, admins: Number(e.target.value) };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-slate-500">Screens</label>
                                    <input
                                      type="number"
                                      value={tierObj.details?.screens || 0}
                                      onChange={(e) => {
                                        const updated = [...dbModules];
                                        const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                        t.details = { ...t.details, screens: Number(e.target.value) };
                                        setDbModules(updated);
                                      }}
                                      disabled={!canWrite}
                                      className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {/* Features Editor */}
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase text-slate-500 block">Plan Features (comma-separated)</label>
                                  <textarea
                                    rows={2}
                                    value={(tierObj.details?.features || []).join(", ")}
                                    onChange={(e) => {
                                      const updated = [...dbModules];
                                      const t = updated[modIdx].module_pricing.find((x: any) => x.tier === tierName);
                                      t.details = {
                                        ...t.details,
                                        features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                      };
                                      setDbModules(updated);
                                    }}
                                    disabled={!canWrite}
                                    className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none resize-none"
                                    placeholder="e.g. Standard compiler, 2D Floor Plan Import"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Showcase Config */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Showcase Media Section</h4>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Customize the heading, description, and the 3 display videos in the showcase section.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Showcase Main Heading</label>
                  <input
                    type="text"
                    value={xplorData.showcase_heading || ""}
                    onChange={(e) => setXplorData({ ...xplorData, showcase_heading: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500/25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Showcase Description</label>
                  <textarea
                    rows={1}
                    value={xplorData.showcase_description || ""}
                    onChange={(e) => setXplorData({ ...xplorData, showcase_description: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none focus:border-blue-500/25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => {
                  const item = xplorData.showcase_items?.[idx] || { media_id: "", title: "", description: "" };
                  return (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block border-b border-white/5 pb-1">Video Showcase #{idx + 1}</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Select Video</label>
                        {loadingVideos ? (
                          <div className="text-[10px] text-slate-500">Loading videos list...</div>
                        ) : (
                          <select
                            value={item.media_id || ""}
                            onChange={(e) => {
                              const updatedItems = [...(xplorData.showcase_items || [])];
                              while (updatedItems.length <= idx) {
                                updatedItems.push({ media_id: "", title: "", description: "" });
                              }
                              updatedItems[idx] = { ...updatedItems[idx], media_id: e.target.value };
                              setXplorData({ ...xplorData, showcase_items: updatedItems });
                            }}
                            disabled={!canWrite}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-350 focus:outline-none [&>option]:bg-[#0a1122]"
                          >
                            <option value="">-- No Video Selected --</option>
                            {videoOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.file_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const updatedItems = [...(xplorData.showcase_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], title: e.target.value };
                            setXplorData({ ...xplorData, showcase_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none focus:border-blue-500/25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const updatedItems = [...(xplorData.showcase_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                            setXplorData({ ...xplorData, showcase_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none resize-none focus:border-blue-500/25"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{saving ? "Saving configurations..." : "Save XPLOR Settings"}</span>
              </button>
            )}
          </form>
        )}

        {activeTab === "ims" && (
          <form onSubmit={handleSaveIms} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">IMS Edit</h3>
            </div>

            <div className="space-y-4">
              {loadingImsProject ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading database project configurations...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">IMS Project Title (Database)</label>
                    <input
                      type="text"
                      value={dbImsProject.title}
                      onChange={(e) => setDbImsProject({ ...dbImsProject, title: e.target.value })}
                      disabled={!canWrite}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">IMS Project Description (Database)</label>
                    <textarea
                      rows={4}
                      value={dbImsProject.description}
                      onChange={(e) => setDbImsProject({ ...dbImsProject, description: e.target.value })}
                      disabled={!canWrite}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Visual Showcase Config */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Showcase Media Section</h4>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Customize the heading, description, and the 3 display videos in the showcase section.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Showcase Main Heading</label>
                  <input
                    type="text"
                    value={imsData.showcase_heading || ""}
                    onChange={(e) => setImsData({ ...imsData, showcase_heading: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500/25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Showcase Description</label>
                  <textarea
                    rows={1}
                    value={imsData.showcase_description || ""}
                    onChange={(e) => setImsData({ ...imsData, showcase_description: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none focus:border-blue-500/25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => {
                  const item = imsData.showcase_items?.[idx] || { media_id: "", title: "", description: "" };
                  return (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block border-b border-white/5 pb-1">Video Showcase #{idx + 1}</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Select Video</label>
                        {loadingVideos ? (
                          <div className="text-[10px] text-slate-500">Loading videos list...</div>
                        ) : (
                          <select
                            value={item.media_id || ""}
                            onChange={(e) => {
                              const updatedItems = [...(imsData.showcase_items || [])];
                              while (updatedItems.length <= idx) {
                                updatedItems.push({ media_id: "", title: "", description: "" });
                              }
                              updatedItems[idx] = { ...updatedItems[idx], media_id: e.target.value };
                              setImsData({ ...imsData, showcase_items: updatedItems });
                            }}
                            disabled={!canWrite}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-355 focus:outline-none [&>option]:bg-[#0a1122]"
                          >
                            <option value="">-- No Video Selected --</option>
                            {videoOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.file_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const updatedItems = [...(imsData.showcase_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], title: e.target.value };
                            setImsData({ ...imsData, showcase_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none focus:border-blue-500/25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-slate-500">Item Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const updatedItems = [...(imsData.showcase_items || [])];
                            while (updatedItems.length <= idx) {
                              updatedItems.push({ media_id: "", title: "", description: "" });
                            }
                            updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                            setImsData({ ...imsData, showcase_items: updatedItems });
                          }}
                          disabled={!canWrite}
                          className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-white/5 rounded-xl text-[10px] text-white focus:outline-none resize-none focus:border-blue-500/25"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{saving ? "Saving configurations..." : "Save IMS Settings"}</span>
              </button>
            )}
          </form>
        )}

        {activeTab === "contact" && (
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Phone className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Footer Contact & Social links</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emails & Phones */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Primary Contact Email</label>
                  <input
                    type="email"
                    value={contactData.email1}
                    onChange={(e) => setContactData({ ...contactData, email1: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Proposal submissions Email</label>
                  <input
                    type="email"
                    value={contactData.email2}
                    onChange={(e) => setContactData({ ...contactData, email2: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Primary Office Phone</label>
                  <input
                    type="text"
                    value={contactData.phone1}
                    onChange={(e) => setContactData({ ...contactData, phone1: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Secondary Office Phone</label>
                  <input
                    type="text"
                    value={contactData.phone2}
                    onChange={(e) => setContactData({ ...contactData, phone2: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Headquarters Address</label>
                  <textarea
                    rows={2}
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Social Networks & Checklist Services */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">LinkedIn URL</label>
                  <input
                    type="text"
                    value={contactData.social_linkedin}
                    onChange={(e) => setContactData({ ...contactData, social_linkedin: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Instagram URL</label>
                  <input
                    type="text"
                    value={contactData.social_instagram}
                    onChange={(e) => setContactData({ ...contactData, social_instagram: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Discord Server Invite</label>
                  <input
                    type="text"
                    value={contactData.social_discord}
                    onChange={(e) => setContactData({ ...contactData, social_discord: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Proposal Checkboxes list */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Proposal Form Services Checklist</label>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {contactData.services.map((serv) => (
                      <span
                        key={serv}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                      >
                        <span>{serv}</span>
                        {canWrite && (
                          <button
                            type="button"
                            onClick={() => removeContactService(serv)}
                            className="text-slate-500 hover:text-red-400 shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {canWrite && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new service option..."
                        id="new-checklist-service"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            addContactService(val);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-checklist-service") as HTMLInputElement;
                          if (el) {
                            addContactService(el.value);
                            el.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 transition-all"
                      >
                        Append
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all"
              >
                Save Contact & Footer settings
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
