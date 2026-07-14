"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

interface TeamMember {
  id: string;
  name: string;
  bio?: string;
  linkedin_url?: string;
  display_order: number;
  position?: {
    id: string;
    title: string;
    department: string;
  } | null;
  photo?: {
    id: string;
    public_url: string;
    file_name: string;
  } | null;
}

interface TeamLayout {
  columns_mobile: number;
  columns_tablet: number;
  columns_desktop: number;
  columns_xl: number;
}

const DEFAULT_LAYOUT: TeamLayout = {
  columns_mobile: 1,
  columns_tablet: 2,
  columns_desktop: 3,
  columns_xl: 3
};

// Map numbers to compile-safe Tailwind grid layout classes
const mobileCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3"
};

const tabletCols: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4"
};

const desktopCols: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5"
};

const xlCols: Record<number, string> = {
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6"
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [layout, setLayout] = useState<TeamLayout>(DEFAULT_LAYOUT);
  const [headline, setHeadline] = useState("Meet the Innovators");
  const [subheadline, setSubheadline] = useState("The engineers, artists, and strategists behind our bleeding-edge digital ecosystems.");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamRes, pageRes] = await Promise.all([
          fetch("/api/v1/team").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch team members");
            return res.json();
          }),
          fetch("/api/v1/pages/team").then((res) => {
            // Non-blocking, fallback if page content not created
            if (!res.ok) return null;
            return res.json();
          }).catch(() => null)
        ]);

        if (teamRes?.success && Array.isArray(teamRes.data)) {
          setMembers(teamRes.data);
        } else if (teamRes?.success && Array.isArray(teamRes.data?.items)) {
          setMembers(teamRes.data.items);
        }

        if (pageRes?.success && pageRes?.data) {
          const dbContent = pageRes.data.content || {};
          if (dbContent.headline) setHeadline(dbContent.headline);
          if (dbContent.subheadline) setSubheadline(dbContent.subheadline);
          if (dbContent.layout) setLayout(dbContent.layout);
        }
      } catch (err) {
        console.error("Failed to load team data:", err);
        setError("Unable to load team roster. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Split headline for PageHeader titles
  const words = headline.trim().split(" ");
  let title = headline;
  let gradientTitle = "";
  if (words.length > 1) {
    gradientTitle = words[words.length - 1];
    title = words.slice(0, -1).join(" ");
  }

  // Build grid layout class
  const gridClass = `grid ${mobileCols[layout.columns_mobile] || "grid-cols-1"} ${
    tabletCols[layout.columns_tablet] || "md:grid-cols-2"
  } ${desktopCols[layout.columns_desktop] || "lg:grid-cols-3"} ${
    xlCols[layout.columns_xl] || ""
  } gap-8`;

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent flex flex-col items-center justify-center text-slate-400 gap-3 pt-36">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-bold uppercase tracking-wider">Loading Team...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader
          badgeText="Our Team"
          badgeIcon={Users}
          title={title}
          gradientTitle={gradientTitle}
          description={subheadline}
        />

        {error && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {!error && members.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-medium">
            No team members registered at this time.
          </div>
        )}

        {!error && members.length > 0 && (
          <div className={gridClass}>
            {members.map((member, index) => {
              const photoUrl = member.photo?.public_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name) + "&background=1A73E8&color=ffffff&size=200";
              const positionTitle = member.position?.title || "Specialist";

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white hover:bg-[#D2E3FC] border border-[#E5E7EB] hover:border-[#B4D0FB] rounded-2xl p-8 transition-all duration-300 text-center flex flex-col items-center hover:shadow-[0_24px_48px_rgba(15,23,42,0.3)] cursor-default hover:-translate-y-1"
                >
                  {/* Profile Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border border-[#E5E7EB] group-hover:border-[#2563EB] transition-colors duration-300 mb-6 relative">
                    <Image
                      src={photoUrl}
                      alt={member.name}
                      fill
                      sizes="128px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-[#202124] transition-colors duration-300 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#2563EB] font-medium text-sm uppercase tracking-wider mb-4 transition-colors duration-300">
                    {positionTitle}
                  </p>

                  {member.bio && (
                    <p className="text-[#5F6368] text-sm leading-relaxed mb-6 transition-colors duration-300">
                      {member.bio}
                    </p>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <a
                      href={member.linkedin_url || "#"}
                      onClick={(e) => {
                        if (!member.linkedin_url) {
                          e.preventDefault();
                        }
                      }}
                      target={member.linkedin_url ? "_blank" : undefined}
                      rel={member.linkedin_url ? "noreferrer" : undefined}
                      className={`w-9 h-9 rounded-full bg-white group-hover:bg-white/5 border border-[#E5E7EB] group-hover:border-white/10 flex items-center justify-center text-[#5F6368] group-hover:text-[#0077b5] hover:!bg-[#2563EB] hover:!border-[#2563EB] hover:!text-white transition-all duration-300 shadow-sm ${
                        !member.linkedin_url ? "cursor-default opacity-40 hover:!bg-white hover:!border-[#E5E7EB] hover:!text-[#5F6368] pointer-events-none" : ""
                      }`}
                      title={member.linkedin_url ? "LinkedIn Profile" : "No Profile Link"}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
