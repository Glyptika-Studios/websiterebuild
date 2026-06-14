/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
} from "lucide-react";

// Data Interfaces
interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  stats_projects: string;
  stats_uptime: string;
  stats_channels: string;
  custom_sections: { id: string; title: string; body: string; image_url?: string }[];
}

interface XplorContent {
  hero_video_url: string;
  core_heading: string;
  core_desc: string;
  modules: { name: string; desc: string; features: string[] }[];
}

interface ImsContent {
  hero_title: string;
  hero_desc: string;
  pricing: { tier: string; price: string; cycle: string; features: string[] }[];
  faqs: { question: string; answer: string }[];
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

  // Home State
  const [homeData, setHomeData] = useState<HomeContent>({
    hero_title: "Bleeding-Edge Telemetry Infrastructure",
    hero_subtitle: "Constructing digital SaaS portals, enterprise networks, and automated telemetry systems.",
    stats_projects: "150+",
    stats_uptime: "99.99%",
    stats_channels: "10M+",
    custom_sections: [
      { id: "1", title: "Robust Security Standards", body: "Every telemetry link utilizes end-to-end pgp keys and strict relational schema isolation rules to safeguard client feeds." }
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

  // Load from Storage on mount
  useEffect(() => {
    const home = localStorage.getItem("glyptika_cms_home");
    const xplor = localStorage.getItem("glyptika_cms_xplor");
    const ims = localStorage.getItem("glyptika_cms_ims");
    const contact = localStorage.getItem("glyptika_cms_contact");

    if (home) setHomeData(JSON.parse(home));
    if (xplor) setXplorData(JSON.parse(xplor));
    if (ims) setImsData(JSON.parse(ims));
    if (contact) setContactData(JSON.parse(contact));
  }, []);

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    localStorage.setItem("glyptika_cms_home", JSON.stringify(homeData));
    triggerSaveSuccess();
  };

  const handleSaveXplor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    localStorage.setItem("glyptika_cms_xplor", JSON.stringify(xplorData));
    triggerSaveSuccess();
  };

  const handleSaveIms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    localStorage.setItem("glyptika_cms_ims", JSON.stringify(imsData));
    triggerSaveSuccess();
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    localStorage.setItem("glyptika_cms_contact", JSON.stringify(contactData));
    triggerSaveSuccess();
  };

  // Helper additions/removals
  const addHomeCustomSection = () => {
    const item = { id: `sec-${Date.now()}`, title: "New Section Title", body: "Section details body description..." };
    setHomeData({ ...homeData, custom_sections: [...homeData.custom_sections, item] });
  };

  const removeHomeCustomSection = (id: string) => {
    setHomeData({ ...homeData, custom_sections: homeData.custom_sections.filter((s) => s.id !== id) });
  };

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
          XPLOR Details
        </button>
        <button
          onClick={() => setActiveTab("ims")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "ims" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          IMS Cluster Config
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Stats: Projects</label>
                  <input
                    type="text"
                    value={homeData.stats_projects}
                    onChange={(e) => setHomeData({ ...homeData, stats_projects: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Stats: System Uptime</label>
                  <input
                    type="text"
                    value={homeData.stats_uptime}
                    onChange={(e) => setHomeData({ ...homeData, stats_uptime: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Stats: Telemetry Streams</label>
                  <input
                    type="text"
                    value={homeData.stats_channels}
                    onChange={(e) => setHomeData({ ...homeData, stats_channels: e.target.value })}
                    disabled={!canWrite}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Custom Sections Editor */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-450">Homepage Custom freeform sections</span>
                {canWrite && (
                  <button
                    type="button"
                    onClick={addHomeCustomSection}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase border border-white/5 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Section
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {homeData.custom_sections.map((section, index) => (
                  <div key={section.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Section {index + 1}</span>
                      {canWrite && (
                        <button
                          type="button"
                          onClick={() => removeHomeCustomSection(section.id)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) => {
                          const sections = [...homeData.custom_sections];
                          sections[index].title = e.target.value;
                          setHomeData({ ...homeData, custom_sections: sections });
                        }}
                        disabled={!canWrite}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Section text content..."
                        value={section.body}
                        onChange={(e) => {
                          const sections = [...homeData.custom_sections];
                          sections[index].body = e.target.value;
                          setHomeData({ ...homeData, custom_sections: sections });
                        }}
                        disabled={!canWrite}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
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
              <h3 className="text-sm font-black text-white uppercase tracking-wider">XPLOR Product Layout</h3>
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

            {canWrite && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all"
              >
                Save XPLOR Settings
              </button>
            )}
          </form>
        )}

        {activeTab === "ims" && (
          <form onSubmit={handleSaveIms} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">IMS Layout & FAQs</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hero Main Title</label>
                <input
                  type="text"
                  value={imsData.hero_title}
                  onChange={(e) => setImsData({ ...imsData, hero_title: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hero Description</label>
                <textarea
                  rows={2}
                  value={imsData.hero_desc}
                  onChange={(e) => setImsData({ ...imsData, hero_desc: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* IMS FAQs Editor */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-450">IMS FAQ Accordions</span>
                {canWrite && (
                  <button
                    type="button"
                    onClick={addImsFaq}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase border border-white/5 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add FAQ
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {imsData.faqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question {index + 1}</span>
                      {canWrite && (
                        <button
                          type="button"
                          onClick={() => removeImsFaq(index)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="e.g. Is self-hosting supported?"
                        value={faq.question}
                        onChange={(e) => {
                          const faqs = [...imsData.faqs];
                          faqs[index].question = e.target.value;
                          setImsData({ ...imsData, faqs });
                        }}
                        disabled={!canWrite}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer details..."
                        value={faq.answer}
                        onChange={(e) => {
                          const faqs = [...imsData.faqs];
                          faqs[index].answer = e.target.value;
                          setImsData({ ...imsData, faqs });
                        }}
                        disabled={!canWrite}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-black uppercase tracking-wider transition-all"
              >
                Save IMS Settings
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
