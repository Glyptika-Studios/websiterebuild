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
    image: "https://ui-avatars.com/api/?name=Hasrat&background=0a1128&color=60a5fa&size=200",
  },
  {
    id: "team-2",
    name: "Lakshay",
    role: "Lead API Engineer",
    bio: "Systems architect specializing in high-throughput distributed architectures, secure RPC gateways, and enterprise database integrations.",
    image: "https://ui-avatars.com/api/?name=Lakshay&background=0a1128&color=818cf8&size=200",
  },
  {
    id: "team-3",
    name: "Vinayak",
    role: "Cloud Infrastructure",
    bio: "DevOps and security specialist managing secure container orchestration, air-gapped system deployments, and sovereign military-grade servers.",
    image: "https://ui-avatars.com/api/?name=Vinayak&background=0a1128&color=38bdf8&size=200",
  }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-blue-500/30">

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
              className="group relative bg-[#0a1128]/60 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-300 text-center flex flex-col items-center hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
            >
              {/* Profile Image (using UI Avatars for placeholder) */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-400 transition-colors mb-6 relative">
                <Image src={member.image} alt={member.name} fill sizes="128px" style={{ objectFit: "cover" }} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">{member.role}</p>

              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {member.bio}
              </p>

              <div className="flex gap-4 mt-auto">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">
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

