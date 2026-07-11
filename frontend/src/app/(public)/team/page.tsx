"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Globe, Mail } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

// Sample Data
const MOCK_TEAM = [
  {
    id: "team-1",
    name: "Hasrat",
    role: "Founder & CEO",
    bio: "Visionary product architect and engineering leader focusing on high-performance spatial compilers, 3D visualization grids, and custom automation solutions.",
    image: "https://ui-avatars.com/api/?name=Hasrat&background=1A73E8&color=ffffff&size=200",
  },
  {
    id: "team-2",
    name: "Lakshay",
    role: "Lead API Engineer",
    bio: "Systems architect specializing in high-throughput distributed architectures, secure RPC gateways, and enterprise database integrations.",
    image: "https://ui-avatars.com/api/?name=Lakshay&background=1A73E8&color=ffffff&size=200",
  },
  {
    id: "team-3",
    name: "Vinayak",
    role: "Cloud Infrastructure",
    bio: "DevOps and security specialist managing secure container orchestration, air-gapped system deployments, and sovereign military-grade servers.",
    image: "https://ui-avatars.com/api/?name=Vinayak&background=1A73E8&color=ffffff&size=200",
  }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <PageHeader
          badgeText="Our Team"
          badgeIcon={Users}
          title="Meet the"
          gradientTitle="Innovators"
          description="The engineers, artists, and strategists behind our bleeding-edge digital ecosystems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TEAM.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white hover:bg-[#D2E3FC] border border-[#E5E7EB] hover:border-[#B4D0FB] rounded-2xl p-8 transition-all duration-300 text-center flex flex-col items-center hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)] cursor-default hover:-translate-y-1"
            >
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden border border-[#E5E7EB] group-hover:border-[#38BDF8] transition-colors duration-300 mb-6 relative">
                <Image src={member.image} alt={member.name} fill sizes="128px" style={{ objectFit: "cover" }} />
              </div>

              <h3 className="text-2xl font-semibold text-[#202124] transition-colors duration-300 mb-1">{member.name}</h3>
              <p className="text-[#2563EB] font-medium text-sm uppercase tracking-wider mb-4 transition-colors duration-300">{member.role}</p>

              <p className="text-[#5F6368] text-sm leading-relaxed mb-6 transition-colors duration-300">
                {member.bio}
              </p>

              <div className="flex gap-3 mt-auto">
                <a href="#" className="w-9 h-9 rounded-full bg-white group-hover:bg-white/5 border border-[#E5E7EB] group-hover:border-white/10 flex items-center justify-center text-[#5F6368] group-hover:text-slate-400 hover:!bg-[#2563EB] hover:!border-[#2563EB] hover:!text-white transition-all duration-300 shadow-sm">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white group-hover:bg-white/5 border border-[#E5E7EB] group-hover:border-white/10 flex items-center justify-center text-[#5F6368] group-hover:text-slate-400 hover:!bg-[#2563EB] hover:!border-[#2563EB] hover:!text-white transition-all duration-300 shadow-sm">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
