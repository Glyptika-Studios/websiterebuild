"use client";

import { motion } from "framer-motion";
import { Cuboid, Move3d, Video } from "lucide-react";

// Real Data integrated from old website
const SERVICES_DATA = [
  {
    id: "svc-1",
    title: "Custom 3D Asset Creation",
    tag: "3D Modeling",
    description: "Bespoke 3D models tailored to your exact specifications. From product prototypes to architectural elements.",
    icon: Cuboid,
    color: "from-blue-500/20 to-cyan-500/5",
    glowColor: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
    iconColor: "text-blue-400"
  },
  {
    id: "svc-2",
    title: "VR Environment Creation",
    tag: "VR Simulation",
    description: "Fully immersive virtual reality environments designed for training, visualization, and interactive experiences.",
    icon: Move3d,
    color: "from-indigo-500/20 to-blue-600/5",
    glowColor: "group-hover:shadow-[0_0_40px_rgba(79,70,229,0.3)]",
    iconColor: "text-indigo-400"
  },
  {
    id: "svc-3",
    title: "INSDAG Collaboration",
    tag: "Explainer Reel",
    description: "Partnering with INSDAG to modernize workforce development through intuitive, high-fidelity instructional animations.",
    icon: Video,
    color: "from-cyan-500/20 to-teal-500/5",
    glowColor: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]",
    iconColor: "text-cyan-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 40, damping: 12 } }
};

export default function Services() {
  return (
    <section className="relative w-full py-32 bg-[#000000] overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#1e3a8a]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#0ea5e9]/5 blur-[150px] pointer-events-none" />
      
      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Service Division
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
          >
            Elite 3D & VR Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
          >
            Delivering precision-engineered 3D modeling, immersive VR experiences, and cutting-edge visualization solutions for commercial, government, and defense clients.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SERVICES_DATA.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative p-10 rounded-[2rem] bg-[#050B14]/80 border border-slate-800 backdrop-blur-2xl transition-all duration-500 ${service.glowColor} overflow-hidden flex flex-col h-full`}
              >
                {/* Dynamic Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                {/* Border highlight effect on hover */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-blue-500/20 rounded-[2rem] transition-colors duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#0a1128] border border-blue-900/50 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500 ease-out shadow-lg">
                      <Icon className={`w-8 h-8 ${service.iconColor} group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all`} />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-colors">
                      {service.tag}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-base leading-relaxed flex-grow group-hover:text-slate-300 transition-colors duration-300">
                    {service.description}
                  </p>
                  
                  {/* Subtle Learn More Link */}
                  <div className="mt-8 flex items-center text-sm font-semibold text-slate-500 group-hover:text-blue-400 transition-colors duration-300 cursor-pointer w-max">
                    <span className="relative">
                      Explore Capability
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-500" />
                    </span>
                    <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
